"""Teste do módulo Contrato integrado à Store; funciona numa cópia temporária."""
import json, pathlib, tempfile, shutil, subprocess, sys, time, urllib.request, urllib.error, re
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as td:
    work=pathlib.Path(td)/'projeto'
    shutil.copytree(root,work,ignore=shutil.ignore_patterns('__pycache__','server_test.log'))
    s=subprocess.Popen([sys.executable,'iniciar.py','--no-browser','--port','8769'],cwd=work,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        base='http://127.0.0.1:8769'
        def query(path,method='GET',data=None):
            raw=json.dumps(data,ensure_ascii=False).encode() if data is not None else None
            req=urllib.request.Request(base+path,method=method,data=raw,headers={'Content-Type':'application/json'})
            try:
                with urllib.request.urlopen(req,timeout=12) as f:return f.status,json.loads(f.read())
            except urllib.error.HTTPError as err:return err.code,json.loads(err.read())
        for _ in range(60):
            try: code,catalog=query('/api/catalogo');break
            except Exception:time.sleep(.12)
        assert code==200
        assert len(catalog['screens'])==79 and len(catalog['components'])==234
        contract_code,contract=query('/api/contrato')
        assert contract_code==200 and contract['doc']['schema']=='advogadoja.modulo_contrato.v1'
        assert len(contract['doc']['areas'])==6
        assert sum(len(a['campos']) for a in contract['doc']['areas'])>20
        before_catalog=(len(catalog['screens']),len(catalog['components']))
        # Contract's API rejects a normal Catalog JSON and stale revisions.
        assert query('/api/contrato/sync','POST',{'doc':{'catalogo':{}},'expected':contract['version']})[0]==400
        assert query('/api/contrato/sync','POST',{'doc':contract['doc'],'expected':'stale'})[0]==409
        assert query('/api/contrato/sync','POST',{'doc':contract['doc'],'expected':contract['version']})[0]==200
        assert query('/api/catalogo')[1]['screens'].keys()==catalog['screens'].keys()
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
            page=browser.new_page(viewport={'width':1350,'height':860},accept_downloads=True)
            errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
            # DOM injection avoids environment blocking localhost in Chromium but uses actual server routes.
            def pyfetch(path,method,body):
                req=urllib.request.Request(base+'/'+path.lstrip('/'),method=method,headers={'Content-Type':'application/json'},data=body.encode() if method!='GET' else None)
                try:
                    with urllib.request.urlopen(req,timeout=12) as r:return {'status':r.status,'body':r.read().decode('utf-8')}
                except urllib.error.HTTPError as e:return {'status':e.code,'body':e.read().decode('utf-8')}
            page.expose_function('pyFetch',pyfetch)
            html=(work/'index.html').read_text()
            page.set_content(re.sub(r'<script src="[^\"]+"></script>','',re.sub(r'<link rel="stylesheet"[^>]+>','',html)))
            page.evaluate('''window.fetch=async(path,opt={})=>{const x=await window.pyFetch(path,opt.method||'GET',opt.body||null);return {ok:x.status>=200&&x.status<300,status:x.status,json:async()=>JSON.parse(x.body)};};undefined''')
            for css in ['app/estilos/base.css','motor_fluxo/fluxo.css','motor_prototipo/prototipo.css','modulo_contrato/contrato.css']:
                page.add_style_tag(content=(work/css).read_text())
            for script in re.findall(r'<script src="([^\"]+)"',html):page.add_script_tag(content=(work/script).read_text())
            try:page.wait_for_function("typeof ctState!=='undefined' && ctState.doc && Object.keys(model.screens).length===79",timeout=15000)
            except Exception:
                print('DEBUG_BROWSER',page.evaluate("({screens: typeof model!=='undefined'?Object.keys(model.screens).length:-1,contract:typeof ctState!=='undefined'&&!!ctState.doc,status:document.getElementById('diskStatus')?.textContent,contractMsg:document.getElementById('ctMessage')?.textContent})"),errors)
                raise
            page.locator('[data-tab="contrato"]').click()
            assert page.locator('#ctPanelObjetivos .ct-card').count()==7
            assert page.locator('#ctMetrics .ct-metric').count()==4
            page.locator('[data-ct-tab="areas"]').click()
            assert page.locator('.ct-area-btn').count()==6
            assert page.evaluate('ctState.doc.areas.some(a=>a.id==="prototipo")')
            assert not page.evaluate('ctState.doc.areas.some(a=>a.id==="simulacao")')
            assert page.locator('#ctCampoLista .ct-field-pill').count()>5
            # Make a new objective; save only module, never a catalog record.
            page.locator('[data-ct-tab="objetivos"]').click()
            page.locator('#ctAddObjetivo').click()
            count=page.locator('#ctPanelObjetivos .ct-card').count()
            assert count==8
            page.locator('#ctPanelObjetivos .ct-card').last.locator('[data-ct-obj-field="titulo"]').fill('Contrato testado')
            assert page.evaluate('ctState.dirty')
            page.locator('#ctSaveBtn').click()
            page.wait_for_function('!ctState.dirty',timeout=10000)
            status,saved=query('/api/contrato');assert status==200
            assert saved['doc']['objetivos'][-1]['titulo']=='Contrato testado'
            status,newcat=query('/api/catalogo');assert (len(newcat['screens']),len(newcat['components']))==before_catalog
            # Export exclusive JSON
            with page.expect_download() as dl:page.locator('#ctExportBtn').click()
            assert dl.value.suggested_filename=='ADVOGADOJA_CONTRATO_WORKSPACE.json'
            # Importação de um JSON exclusivo: substitui rascunho, não catálogo.
            page.on('dialog',lambda dialog:dialog.accept())
            import_doc=json.loads(json.dumps(saved['doc']))
            import_doc['objetivos'][-1]['titulo']='Importação verificada'
            page.locator('#ctImportFile').set_input_files({'name':'contrato_exclusivo.json','mimeType':'application/json','buffer':json.dumps(import_doc,ensure_ascii=False).encode('utf-8')})
            assert page.evaluate('ctState.doc.objetivos.at(-1).titulo')=='Importação verificada'
            assert page.evaluate('ctState.dirty')
            page.locator('#ctSaveBtn').click()
            page.wait_for_function('!ctState.dirty',timeout=10000)
            assert query('/api/contrato')[1]['doc']['objetivos'][-1]['titulo']=='Importação verificada'
            # Application still renders Flow and journeys unchanged.
            assert page.evaluate('compileFlowStructure().occurrences')==197
            assert page.evaluate('compileFlowStructure().branches')==33
            assert len(page.evaluate('journeyCatalog()'))==4
            page.locator('[data-ct-tab="json"]').click()
            page.locator('#ctJson').fill('{"catalogo":{}}')
            page.locator('#ctApplyJson').click()
            assert 'não é do módulo' in page.locator('#ctMessage').inner_text()
            assert len(page.evaluate('ctState.doc.areas'))==6
            assert not errors,errors
            print('PASSOU: UI, gravação, exportação exclusiva, isolamento, Flow, jornadas, validações e conflito.')
            browser.close()
    finally:
        s.terminate();s.wait(timeout=5)
