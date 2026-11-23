from __future__ import annotations
import json,pathlib,html,zipfile,sys
from collections import Counter
ROOT=pathlib.Path(sys.argv[1]).resolve() if len(sys.argv)>1 else pathlib.Path(__file__).resolve().parent.parent
viewjs=pathlib.Path(__file__).with_name('viewer.js').read_text()
css='''
:root{font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#1b2b45;background:#f1f5fb}
*{box-sizing:border-box}body{margin:0}button,select,input{font:inherit}button{cursor:pointer}a{color:#2165b5;text-decoration:none}button:focus-visible,a:focus-visible,select:focus-visible{outline:3px solid #9cc8ff;outline-offset:2px}
.header{padding:15px 22px;display:flex;align-items:center;gap:12px;justify-content:space-between;background:white;border-bottom:1px solid #dce4ef;flex-wrap:wrap}
.header h1{margin:4px 0 0;font-size:20px;letter-spacing:-.03em}.eyebrow{font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;color:#256bc1}.subtle{color:#697c93;font-size:12px}
.actions,.tabbar{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.btn{font-size:12px;font-weight:700;padding:9px 12px;border:1px solid #d2dfed;border-radius:9px;background:#fff;color:#29405e}.btn.active,.btn.primary{color:#fff;border-color:#1c64b9;background:#2169c4}
.grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;max-width:1760px;margin:0 auto;min-height:calc(100vh - 100px)}.stage{padding:18px 20px;min-width:0}.inspector{border-left:1px solid #dbe4ef;background:#fff;padding:16px;min-width:0}
.viewport-shell{width:100%;min-height:650px;background:#fff;outline:1px solid #d4deeb;border-radius:12px;overflow:hidden;box-shadow:0 15px 38px #18324d11;}
#viewport{width:100%;height:100%;min-height:650px;max-width:390px;margin:auto;transition:max-width .2s;border-left:1px solid #ecf0f5;border-right:1px solid #ecf0f5;background:#eef2f6}
#viewport::before{content:none}#viewport:empty{min-height:80vh}.stage-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;flex-wrap:wrap}.inspector h2{font-size:14px;margin:6px 0 12px}.inspector h3{font-size:12px;color:#49617f;margin:16px 0 9px}
.panel{display:none}.panel:not([hidden]){display:block}.state-row{display:flex;flex-direction:column;gap:4px;padding:8px 0;border-bottom:1px solid #edf1f8}.state-row span{overflow-wrap:anywhere;font:11px/1.5 ui-monospace,monospace;color:#536780}.state-row select{padding:8px;border:1px solid #d3deed;border-radius:8px;background:white;font-size:12px}
.route-row{font:11px/1.55 ui-monospace,monospace;padding:8px 0;overflow-wrap:anywhere;border-bottom:1px solid #edf0f5}.json{white-space:pre-wrap;word-break:break-word;background:#101e30;color:#e8f0fc;padding:13px;border-radius:8px;max-height:70vh;overflow:auto;font:10px/1.6 ui-monospace,monospace}.scenario{border:1px solid #dce7f5;border-radius:6px;padding:7px 8px;font-size:11px;background:#eff6ff;color:#235393;display:inline-block;margin:3px}.notice{padding:9px 13px;background:#fffaf0;color:#78571f;border:1px solid #eeddb8;border-radius:9px;font-size:11px;line-height:1.6}.statusbar{margin-top:12px;font-size:12px;color:#375475;min-height:34px}.statusbar.bad{color:#ab3449}
[hidden]{display:none!important}
@media(max-width:960px){.grid{grid-template-columns:1fr}.inspector{border-left:0;border-top:1px solid #dbe4ef}.stage{padding:12px}.header{padding:12px}.viewport-shell{min-height:510px}}
'''
def js_safe(obj):return json.dumps(obj,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
components={}
for p in ROOT.glob('componentes/**/documento.json'):
 c=json.loads(p.read_text());components[c['identidade']['id']]=c
screens={}
for p in ROOT.glob('telas/**/documento.json'):
 s=json.loads(p.read_text());screens[s['identidade']['id']]=s
for sid,s in screens.items():
 rel='telas/'+sid.replace('.','/')+'/visualizar.html';file=ROOT/rel
 refs=set(x['componenteRef'] for x in s['estrutura']['html']['composicao'].values()); bundle={'schema':'advogadoja.ui.bundle','schemaVersion':'1.0.0','telas':{sid:s},'componentes':{cid:components[cid] for cid in sorted(refs)}}
 up='../'*(len(sid.split('.'))+1)
 source=json.loads((ROOT/'dados'/'indice_telas.json').read_text());meta=next(x for x in source if x['id']==sid)
 file.write_text('''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'''+html.escape(s['identidade']['nome'])+''' — Estudo JSON AdvogadoJá</title><style>'''+css+'''</style></head><body>
<header class="header"><div><div class="eyebrow">AdvogadoJá · Contrato canônico UI · referência V1</div><h1 id="id-title">'''+html.escape(s['identidade']['nome'])+'''</h1><span class="subtle" id="id-key">'''+html.escape(sid)+'''</span></div><div class="actions"><a class="btn" href="'''+up+'''index.html">Índice de telas</a><button class="btn primary" id="export-json">Exportar JSON</button></div></header>
<div class="grid"><main class="stage"><div class="stage-bar"><span class="subtle">Visualização isolada · nenhum clique abre outra tela</span><div class="actions"><button class="btn active" data-width="mobile">Mobile</button><button class="btn" data-width="desktop">Ampliada</button><button class="btn" id="reset-states">Restaurar estados</button></div></div><div class="viewport-shell"><div id="viewport"></div></div><p id="status" class="statusbar" role="status">Pronto: interações e estados são simulados nesta tela.</p><p class="notice">Fonte de conteúdo: acervo Projeto 9. Header/menu: padrão visual das Homes V1. Ações funcionais reais e fidelidade visual por tela exigem homologação.</p></main>
<aside class="inspector"><div class="tabbar"><button class="btn active" data-panel="estados">Estados <b id="state-count"></b></button><button class="btn" data-panel="interacoes">Interações <b id="link-count"></b></button><button class="btn" data-panel="json">JSON</button></div>
<section data-content="estados"><h2>Estados das instâncias</h2><div id="state-controls"></div><h3>Cenários de referência</h3><div id="scenario-controls"></div></section>
<section data-content="interacoes" hidden><h2>Relações internas e destinos registrados</h2><div id="routes"></div></section>
<section data-content="json" hidden><h2>Contrato completo desta visualização</h2><p class="subtle">A cópia embutida resolve os componentes apenas para execução offline. Os documentos canônicos estão separados na pasta componentes.</p><pre class="json" id="json-view"></pre></section>
</aside></div><script type="application/json" id="embedded-json">'''+js_safe(bundle)+'''</script><script>'''+viewjs+'''</script></body></html>''',encoding='utf8')
print('VIEWERS',len(screens),'COMPONENTS',len(components))
