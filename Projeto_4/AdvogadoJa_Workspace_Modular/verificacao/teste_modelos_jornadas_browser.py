#!/usr/bin/env python3
"""Prova de Modelos e importação de Jornada contra uma cópia temporária da Store."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from urllib.request import urlopen,Request
from urllib.error import HTTPError
from subprocess import Popen,DEVNULL
import json, shutil, sys, tempfile, time, re
root=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as td:
 work=Path(td)/'workspace'
 shutil.copytree(root,work,ignore=shutil.ignore_patterns('__pycache__'))
 port=8775
 server=Popen([sys.executable,'iniciar.py','--no-browser','--port',str(port)],cwd=work,stdout=DEVNULL,stderr=DEVNULL)
 try:
  for i in range(50):
   try:
    with urlopen(f'http://127.0.0.1:{port}/api/catalogo',timeout=3) as res: data=json.load(res)
    break
   except Exception: time.sleep(.15)
  else: raise RuntimeError('Servidor não iniciou.')
  with sync_playwright() as pw:
   browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
   page=browser.new_page(viewport={'width':1420,'height':1000})
   errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
   def fetch(path,method='GET',body=None):
    uri=f'http://127.0.0.1:{port}/'+str(path or '').lstrip('/')
    try:
     with urlopen(Request(uri,data=body.encode('utf-8') if method!='GET' else None,method=method,headers={'Content-Type':'application/json'}),timeout=15) as res:
      return {'status':res.status,'body':res.read().decode('utf-8')}
    except HTTPError as exc:return {'status':exc.code,'body':exc.read().decode('utf-8')}
   page.expose_function('pyFetch',fetch)
   html=(work/'index.html').read_text(encoding='utf-8')
   html=re.sub(r'<script src="[^"]+"></script>','',html)
   html=re.sub(r'<link rel="stylesheet"[^>]+>','',html)
   page.set_content(html)
   page.evaluate('''window.fetch=async(url,opts={})=>{const r=await pyFetch(url,opts.method||'GET',opts.body||null);return {ok:r.status>=200&&r.status<300,status:r.status,headers:{get:k=>'application/json'},json:async()=>JSON.parse(r.body)};};undefined''')
   for tag in re.findall(r'<script src="([^"]+)"', (work/'index.html').read_text()):page.add_script_tag(content=(work/tag).read_text(encoding='utf-8'))
   page.wait_for_function('Object.keys(model.screens).length===79',timeout=18000)
   page.locator('[data-tab="modelos"]').click()
   page.wait_for_function('!!mdlState.docs.tela',timeout=10000)
   assert page.locator('#mdlTree [data-mdl-path="identidade"]').count()==1
   page.locator('#mdlCheck').click()
   assert '✓' in page.locator('#mdlValidation').inner_text(),page.locator('#mdlValidation').inner_text()
   page.locator('#mdlEditor').fill('{"schema":"invalido"}')
   page.locator('#mdlCheck').click()
   assert 'inconsistência' in page.locator('#mdlValidation').inner_text()
   page.locator('[data-mdl-type="jornada"]').click()
   page.wait_for_function('!!mdlState.docs.jornada',timeout=10000)
   page.locator('#mdlCheck').click()
   assert '✓' in page.locator('#mdlValidation').inner_text()
   page.locator('[data-tab="jornadas"]').click()
   data=page.evaluate('''(()=>{const r=jornadaExportar('referencias','cliente'),c=jornadaExportar('completo','cliente');return {ids:r.telas.length,full:c.catalogo.telas.length,comps:c.catalogo.componentes.length,stored:!!model.screens['cliente.home_cliente']};})()''')
   assert data['ids']==data['full'] and data['comps']>0 and data['stored'],data
   # Divergência: item existente nunca sobrescrito sem seleção explícita.
   page.evaluate('''(()=>{const t=deepClone(model.screens['cliente.home_cliente']);t.identidade.nome='ALTERAÇÃO TESTE';jioState.review=jornadaAnalisarImportacao({schema:JIO_SCHEMA,versao:'1.0.0',jornada:'cliente',modo:'completo',catalogo:{metadados:{schema:CONTRACT,tipo:'pacote_tela'},componentes:[],telas:[t]}});jioRenderReview();})()''')
   assert page.locator('[data-jio-replace]').count()==1
   assert page.locator('[data-jio-replace]').is_checked() is False
   page.locator('#jioApply').click()
   assert page.evaluate("model.screens['cliente.home_cliente'].identidade.nome!=='ALTERAÇÃO TESTE'")
   # Registro novo: precisa ser persistido em arquivo individual (no clone temporário).
   page.evaluate('''(()=>{const t=deepClone(emptyTemplate().catalogo.telas[0]);t.identidade.id='cliente.teste_intercambio';t.identidade.nome='Teste intercâmbio';t.classificacao.escopo='cliente';t.classificacao.jornadas=['cliente'];t.classificacao.localizacaoArvore.segmentos=['cliente'];t.classificacao.localizacaoArvore.chave='teste_intercambio';jioState.review=jornadaAnalisarImportacao({schema:JIO_SCHEMA,versao:'1.0.0',jornada:'cliente',modo:'completo',catalogo:{metadados:{schema:CONTRACT,tipo:'pacote_tela'},componentes:[],telas:[t]}});jioRenderReview();})()''')
   print('NEW_REVIEW', page.evaluate('jioState.review.records.map(r=>({id:r.id,status:r.status}))'))
   page.locator('#jioApply').click()
   print('POST_CLICK', page.evaluate('({status:document.getElementById("jioStatus").textContent, dirty:diskDirty,errors:window.__x||null})'), errors)
   page.wait_for_function('!diskDirty && !diskSaving',timeout=15000)
   dest=work/'catalogo/telas/cliente/teste_intercambio.json'
   print('IMPORT_DEBUG', page.evaluate('({status:document.getElementById("jioStatus").textContent, disk:document.getElementById("diskStatus").textContent, dirty:diskDirty, saving:diskSaving, readOnly:diskReadOnly, cached:!!model.screens["cliente.teste_intercambio"]})'), dest.exists())
   assert dest.exists() and json.loads(dest.read_text())['identidade']['id']=='cliente.teste_intercambio'
   assert not errors,errors
   print('OK: Modelos, validação sem escrita, exportação referência/completa, conflito não sobrescrito e importação com persistência individual.')
   browser.close()
 finally:server.terminate();server.wait(timeout=10)
