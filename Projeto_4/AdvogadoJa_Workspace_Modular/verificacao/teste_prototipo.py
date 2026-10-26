"""Regressão focada do módulo Protótipo (Playwright opcional + servidor local).
O catálogo original nunca é editado: teste roda em cópia temporária.
"""
from __future__ import annotations
import json, pathlib, re, shutil, subprocess, sys, tempfile, time, urllib.request, urllib.error
from playwright.sync_api import sync_playwright

root=pathlib.Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as td:
    work=pathlib.Path(td)/'workspace'
    shutil.copytree(root,work,ignore=shutil.ignore_patterns('__pycache__'))
    server=subprocess.Popen([sys.executable,'iniciar.py','--no-browser','--port','18765'],cwd=work,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        for _ in range(60):
            try:
                with urllib.request.urlopen('http://127.0.0.1:18765/api/catalogo',timeout=3) as response:
                    data=json.load(response)
                break
            except Exception:
                time.sleep(.15)
        else: raise RuntimeError('Servidor local de teste não respondeu.')
        assert len(data['screens'])==79 and len(data['components'])==234
        errors=[];writes=[]
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
            page=browser.new_page(viewport={'width':1280,'height':850})
            page.on('pageerror',lambda error:errors.append(str(error)))
            def pyfetch(path,method,body):
                if method=='POST' and path.startswith('/api/catalogo'):writes.append((path,body))
                req=urllib.request.Request('http://127.0.0.1:18765/'+path.lstrip('/'),method=method,
                    data=(body or '').encode('utf-8') if method!='GET' else None,headers={'Content-Type':'application/json'})
                try:
                    with urllib.request.urlopen(req,timeout=15) as response:
                        return {'status':response.status,'body':response.read().decode('utf-8')}
                except urllib.error.HTTPError as error:
                    return {'status':error.code,'body':error.read().decode('utf-8')}
            page.expose_function('pyFetch',pyfetch)
            html=(work/'index.html').read_text(encoding='utf-8')
            bare=re.sub(r'<script src="[^"]+"></script>','',re.sub(r'<link rel="stylesheet"[^>]+>','',html))
            page.set_content(bare)
            page.evaluate('''window.fetch=async(path,opt={})=>{const r=await window.pyFetch(path,opt.method||'GET',opt.body||null);return {ok:r.status>=200&&r.status<300,status:r.status,headers:{get:n=>n.toLowerCase()==='content-type'?'application/json':null},json:async()=>JSON.parse(r.body)};};undefined''')
            for css in ['app/estilos/base.css','motor_fluxo/fluxo.css','motor_prototipo/prototipo.css']:
                page.add_style_tag(content=(work/css).read_text())
            for script in re.findall(r'<script src="([^"]+)"',html):
                page.add_script_tag(content=(work/script).read_text())
            page.wait_for_function('Object.keys(model.screens).length===79',timeout=20000)
            page.locator('[data-tab="prototipo"]').click()
            assert page.locator('.tab.active').inner_text()=='Protótipo'
            assert page.locator('#protJourneyTabs [data-prot-journey]').count()==4
            assert page.evaluate('compileFlowStructure().occurrences')==197
            assert page.evaluate('compileFlowStructure().branches')==33
            assert page.evaluate('protState.journey')=='cliente'
            points=page.locator('#protPoints [data-prot-index]').count()
            assert points>5,points
            assert page.locator('#protPreview').get_attribute('srcdoc').startswith('<!doctype html>')
            page.locator('#protNext').click()
            assert page.evaluate('protState.cursor')==1
            page.locator('#protBack').click()
            assert page.evaluate('protState.cursor')==0
            page.locator('#protPoints [data-prot-index="3"]').click()
            assert page.evaluate('protState.cursor')==3
            page.locator('#protReset').click()
            assert page.evaluate('protState.cursor')==0
            page.locator('#protSearch').fill('cadastro')
            assert 0<page.locator('#protPoints [data-prot-index]').count()<points
            page.locator('#protReset').click()
            assert page.locator('#protPoints [data-prot-index]').count()==points
            # New journey must be discovered from a screen, with no hardcoded list.
            page.evaluate("model.screens['admin.dashboard.dashboard'].classificacao.jornadas.push('mediacao');renderAll()")
            assert page.locator('#protJourneyTabs [data-prot-journey="mediacao"]').count()==1
            page.locator('#protJourneyTabs [data-prot-journey="mediacao"]').click()
            assert page.evaluate('protState.route.length')>0
            assert page.evaluate("protState.route.some(x=>x.key==='admin.dashboard.dashboard')")
            page.evaluate("model.screens['admin.dashboard.dashboard'].classificacao.jornadas.pop();renderAll()")
            assert page.locator('#protJourneyTabs [data-prot-journey="mediacao"]').count()==0
            assert page.evaluate('journeyCatalog().length')==4
            # Contract names and isolated persistence remain valid.
            with urllib.request.urlopen('http://127.0.0.1:18765/api/contrato') as response:
                contract=json.load(response)['doc']
            assert contract['schema']=='advogadoja.modulo_contrato.v1'
            assert any(a['id']=='prototipo' for a in contract['areas'])
            assert not any(a['id']=='simulacao' for a in contract['areas'])
            assert not writes,f'Protótipo gravou no catálogo inesperadamente: {writes}'
            assert not errors,f'Erros de página: {errors}'
            print('PASSOU: protótipo, navegação, busca, jornada dinâmica, Flow, contrato V5 e isolamento do catálogo.')
            browser.close()
    finally:
        server.terminate();server.wait(timeout=10)
