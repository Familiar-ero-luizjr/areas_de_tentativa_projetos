"""Teste de integração opcional: requer Playwright instalado na máquina de teste."""
import os,sys,time,json,shutil,tempfile,subprocess,pathlib,urllib.request,urllib.parse,mimetypes
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as td:
 work=pathlib.Path(td)/'projeto'
 shutil.copytree(root,work,ignore=shutil.ignore_patterns('server_test.log','__pycache__'))
 server=subprocess.Popen([sys.executable,'iniciar.py','--no-browser','--port','8767'],cwd=work,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 try:
  for i in range(40):
   try:
    with urllib.request.urlopen('http://127.0.0.1:8767/api/catalogo',timeout=2) as f:d=json.load(f)
    break
   except Exception:time.sleep(.1)
  else: raise RuntimeError('Servidor não iniciou')
  assert len(d['screens'])==79 and len(d['components'])==234
  errors=[]
  with sync_playwright() as p:
   browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
   page=browser.new_page(viewport={'width':1350,'height':850},accept_downloads=True)
   page.on('pageerror',lambda e:errors.append(str(e)))
   # Sandboxed Chromium may block direct http:// and file:// navigation.
   # Use exactly the same HTML and JS files in the test DOM, with fetch
   # forwarded through Python to the live localhost server.
   def py_fetch(path,method,body):
    data=(body or '').encode('utf-8') if method!='GET' else None
    req=urllib.request.Request('http://127.0.0.1:8767/'+path.lstrip('/'),data=data,headers={'Content-Type':'application/json'},method=method)
    try:
     with urllib.request.urlopen(req,timeout=10) as f:return {'status':f.status,'body':f.read().decode('utf-8')}
    except urllib.error.HTTPError as e:return {'status':e.code,'body':e.read().decode('utf-8')}
   page.expose_function('pyFetch',py_fetch)
   import re
   test_html=(work/'index.html').read_text()
   test_html=re.sub(r'<script src="[^"]+"></script>','',test_html)
   test_html=re.sub(r'<link rel="stylesheet"[^>]+>','',test_html)
   page.set_content(test_html,wait_until='domcontentloaded')
   page.evaluate("""window.fetch=async (path,opts={})=>{const r=await window.pyFetch(path,opts.method||'GET',opts.body||null);return {ok:r.status>=200&&r.status<300,status:r.status,headers:{get:name=>name.toLowerCase()==='content-type'?'application/json':null},json:async()=>JSON.parse(r.body)};};undefined""")
   for css in ['app/estilos/base.css','motor_fluxo/fluxo.css','motor_prototipo/prototipo.css']:
    page.add_style_tag(content=(work/css).read_text())
   import re
   for script in re.findall(r'<script src="([^"]+)"', (work/'index.html').read_text()):
    page.add_script_tag(content=(work/script).read_text())
   page.wait_for_timeout(1500)
   print('DEBUG',page.evaluate('({hasModel:typeof model,counts:typeof model==="undefined"?null:Object.keys(model.screens).length,status:document.getElementById("diskStatus").textContent})'),errors)
   page.wait_for_function('Object.keys(model.screens).length===79',timeout=8000)
   page.wait_for_timeout(500)
   print('PAGE',page.title())
   print('STATS',page.evaluate('({screens: allScreens().length,components:allComponents().length,occ:compileFlowStructure().occurrences,br:compileFlowStructure().branches,paths:compileFlowStructure().paths,links:collectEdges().length,protReady:typeof protRender})'))
   assert not errors,errors
   # Jornadas e mapa sao dinamicos: declaracao de uma tela cria uma nova aba.
   baseline=page.evaluate('journeyCatalog().map(x=>x.id)')
   assert set(baseline)=={'advogado','cliente','administrador','estudante'},baseline
   assert page.locator('#journeySubtabs [data-journey-tab]').count()==4
   page.evaluate("model.screens['admin.dashboard.dashboard'].classificacao.jornadas.push('mediacao');renderAll()")
   assert page.locator('#journeySubtabs [data-journey-tab="mediacao"]').count()==1
   assert page.locator('#mapCanvas [data-map-open-journey="mediacao"]').count()==1
   page.evaluate("journeyPanel.journey='mediacao';jornadasRender()")
   assert page.locator('#journeyScreenList [data-journey-screen="admin.dashboard.dashboard"]').count()==1
   page.evaluate("model.screens['admin.dashboard.dashboard'].classificacao.jornadas.pop();renderAll()")
   assert page.locator('#journeySubtabs [data-journey-tab]').count()==4
   print('JORNADAS DINAMICAS',baseline,'-> nova mediacao -> removida')
   # flow tab
   page.locator('[data-tab="fluxovisual"]').click()
   page.wait_for_timeout(500)
   print('CARDS',page.locator('[data-occ-id]').count(),'BIFURCACOES',page.locator('.f-branch').count())
   assert page.locator('[data-occ-id]').count()==197
   assert page.locator('.f-branch').count()==33
   # Protótipo: journeys from the Store and navigation based on flow.editor.
   page.locator('[data-tab="prototipo"]').click()
   page.wait_for_timeout(200)
   assert page.locator('#protJourneyTabs [data-prot-journey]').count()==4
   page.locator('#protJourneyTabs [data-prot-journey="cliente"]').click()
   assert page.locator('#protPoints [data-prot-index]').count()>8
   assert page.locator('#protPreview').get_attribute('srcdoc').startswith('<!doctype html>')
   total=page.locator('#protPoints [data-prot-index]').count()
   page.locator('#protNext').click()
   assert page.locator('#protSummary').inner_text().startswith('2 de')
   page.locator('#protBack').click()
   assert page.locator('#protSummary').inner_text().startswith('1 de')
   page.locator('#protSearch').fill('cadastro')
   assert page.locator('#protPoints [data-prot-index]').count()>0
   page.locator('#protReset').click()
   assert page.locator('#protPoints [data-prot-index]').count()==total
   print('PROTOTIPO',len(baseline),'jornadas, pontos navegaveis',total)
   # Operational connection is created/removed ONLY in source screen JSON.
   page.locator('[data-tab="relacoes"]').click()
   page.locator('#flowScreenChoice').select_option('admin.dashboard.dashboard')
   page.evaluate("window.prompt=(msg,def)=>msg.includes('destino')?'advogado.home_advogado':'Conexao teste';window.confirm=()=>true;undefined")
   before=page.evaluate('collectEdges().length')
   page.locator('#addRelation').click()
   page.wait_for_function('!diskDirty && !diskSaving',timeout=15000)
   assert page.evaluate('collectEdges().length')==before+1
   assert any(a.get('tipo')=='ligacao_flow_manual' for g in json.loads((work/'catalogo/telas/admin/dashboard/dashboard.json').read_text())['acoes']['grupos'] for a in g['acoes'])
   print('RELATION ADDED',before,'->',before+1)
   action=page.evaluate("model.screens['admin.dashboard.dashboard'].acoes.grupos.find(g=>g.id==='navegacao_editor_relacoes').acoes[0].id")
   page.locator('#outgoing [data-remove-ref="'+action+'"]').click()
   page.wait_for_function('!diskDirty && !diskSaving',timeout=15000)
   assert page.evaluate('collectEdges().length')==before
   print('RELATION REMOVED',before+1,'->',before)
   # Move a screen occurrence, persist it, then move back.
   page.locator('[data-tab="fluxovisual"]').click()
   choice=page.evaluate("(()=>{for(const [seq,list] of compileFlowStructure().sequenceMap){if(list.length>2 && seq!=='sequence-0429'){const i=list.findIndex(x=>x.node.type==='screen');if(i>=0&&i+1<list.length)return list[i].node.id;}}return null})()")
   assert choice
   own=page.evaluate('flowFindNode('+json.dumps(choice)+').owner.identidade.id')
   before_order=page.evaluate('flowFindNode('+json.dumps(choice)+').record.order')
   page.evaluate('flowMove('+json.dumps(choice)+',1)')
   page.wait_for_function('!diskDirty && !diskSaving',timeout=15000)
   moved=page.evaluate('flowFindNode('+json.dumps(choice)+').record.order')
   assert moved!=before_order
   page.evaluate('flowMove('+json.dumps(choice)+',-1)')
   page.wait_for_function('!diskDirty && !diskSaving',timeout=15000)
   assert page.evaluate('flowFindNode('+json.dumps(choice)+').record.order')==before_order
   print('FLOW REORDER + PERSIST + REVERT',choice,own)
   # editing name and disk persistence test
   page.locator('[data-tab="catalogo"]').click()
   page.evaluate("chooseItem('screen','admin.dashboard.dashboard');showEditMode('edit')")
   item=page.evaluate('JSON.parse(document.getElementById("itemEditor").value)')
   prior=item['identidade']['nome'];item['identidade']['nome']='Admin MODULAR TEST'
   page.locator('#itemEditor').fill(json.dumps(item,ensure_ascii=False))
   page.locator('#applyEdit').click()
   page.wait_for_function('!diskDirty && !diskSaving',timeout=15000)
   saved=json.loads((work/'catalogo/telas/admin/dashboard/dashboard.json').read_text())
   print('SAVED TO DISK',saved['identidade']['nome'])
   assert saved['identidade']['nome']=='Admin MODULAR TEST'
   # reverting a record from UI. Avoid localStorage
   page.evaluate("chooseItem('screen','admin.dashboard.dashboard');showEditMode('edit')")
   item['identidade']['nome']=prior
   page.locator('#itemEditor').fill(json.dumps(item,ensure_ascii=False))
   page.locator('#applyEdit').click()
   page.wait_for_function('!diskDirty && !diskSaving',timeout=15000)
   assert json.loads((work/'catalogo/telas/admin/dashboard/dashboard.json').read_text())['identidade']['nome']==prior
   assert not errors,errors
   print('NO PAGE ERRORS')
   # Evita captura de 197 previews em iframes (lenta e desnecessária para a regressão).
   browser.close()
 finally:
  server.terminate();server.wait(timeout=5)
