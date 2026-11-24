#!/usr/bin/env python3
"""Projeto 9 -> Canon UI v1 with V1 home chrome. Outputs study-only standalone HTMLs."""
from __future__ import annotations
import json, re, copy, hashlib, os, html, pathlib, zipfile
from collections import defaultdict,Counter
from zipfile import ZipFile
from bs4 import BeautifulSoup, NavigableString, Tag
import tinycss2
from importlib.util import spec_from_file_location, module_from_spec

BASE=pathlib.Path(__file__).resolve().parent.parent; OUT=pathlib.Path(sys.argv[2]).resolve() if len(sys.argv)>2 else BASE;OUT.mkdir(parents=True,exist_ok=True)
Z=ZipFile(pathlib.Path(sys.argv[1]).resolve() if len(sys.argv)>1 else BASE/'bibliotecas.zip')
def jl(o):return json.dumps(o,ensure_ascii=False,separators=(',',':'))
def write(path,content):
 path.parent.mkdir(parents=True,exist_ok=True);path.write_text(content,encoding='utf-8')
def jwrite(path,content):write(path,json.dumps(content,ensure_ascii=False,indent=2)+'\n')
def embedded(filepath,id):
 d=BeautifulSoup(Z.read(filepath),'html.parser').find('script',id=id)
 return json.loads(d.string) if d else None
v1meta=json.loads(Z.read('01/inventario_telas.json'))['telas'];p9meta=json.loads(Z.read('02/inventario_telas.json'))['telas']
V1={m['key']:(m,embedded('01/'+m['path'],'v1-embedded-bundle')) for m in v1meta}
P9={m['key']:(m,embedded('02/'+m['path'],'view-data')) for m in p9meta}
V1A=V1['advogado.home_advogado'][1]; V1C=V1['cliente.home_cliente'][1]
assets={
 'header.css':V1A['files']['components/headers/app-header/v04/style.css'],
 'drawer.css':V1A['files']['components/menus/drawer/v01/style.css'],
}
logo=BeautifulSoup(V1A['files']['components/headers/app-header/v04/template.html'],'html.parser').find('img')['src']
ICONS={
 'inicio':'M3 11.5 12 4l9 7.5M5 10v10h14V10M9 20v-6h6v6',
 'lista':'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
 'perfil':'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
 'config':'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
 'agenda':'M7 3v4M17 3v4M3 10h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2',
 'sair':'M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10'
}
# Identity-only redirections for known equivalent keys, not duplicate screen definitions.
ALIASES={
 'advogado.home_advogado':'advogado.home',
 'cliente.home_cliente':'cliente.home.inicio',
 'admin.dashboard.dashboard':'admin.home.dashboard',
 'cliente.perfil_cliente':'cliente.perfil.visualizar',
 'advogado.perfil_profissional':'advogado.perfil.visualizar'
}
# Only resolve an alias if actual target exists.
IDS=set(P9)
def resolve(dest):
 if dest in IDS:return dest
 x=ALIASES.get(dest)
 return x if x in IDS else None

# Normalized CSS: CSS syntax-aware to preserve cascade, do not regex split by '}'.
cssparse_warnings=[]
def css_rules(raw,scope):
 results=[];items=raw.values() if isinstance(raw,dict) else ([raw] if isinstance(raw,str) else (raw or []));nr=0
 for rawstring in items:
  if not isinstance(rawstring,str) or not rawstring.strip():continue
  parsed=tinycss2.parse_stylesheet(rawstring,skip_comments=True,skip_whitespace=True)
  for rule in parsed:
   if rule.type=='error':cssparse_warnings.append((scope,str(rule)));continue
   css=tinycss2.serialize([rule]).strip()
   if not css:continue
   nr+=1;results.append({'id':f'{scope}.r{nr:04d}','ordem':nr*10,'css':css})
 return results

def empty_blocks(identity,classification,html_def,css_def):
 return {'identidade':identity,'classificacao':classification,'estrutura':{'html':html_def,'css':css_def},'estados':{},'variantes':[],'interacoes':[],'dados':{'fontes':[],'operacoes':[]},'mocks':{'cenarios':[]}}
def default_css(raw={},tokens={}):return {'tokens':dict(tokens),'regras':css_rules(raw,'legacy')}
def classify(id,kind,area=None,source=None):
 root='telas' if kind=='tela' else 'componentes'
 location=f'{root}/{id.replace(".","/")}/documento.json'
 scope={'perfilRef':area or id.split('.')[0]}
 jd=(source or {}).get('classificacao',{}).get('jornadas',[])
 return {'localizacao':{'caminho':location},'escopo':scope,'jornadas':jd if isinstance(jd,list) else []}
def sanitize_attrs(attrs):
 out={}
 for k,v in (attrs or {}).items():
  if k.lower().startswith('on') and k.lower() not in ('one','only') :continue
  if v is None:out[k]=''
  elif isinstance(v,(str,int,float,bool)):out[k]=str(v).lower() if isinstance(v,bool) else str(v)
  elif isinstance(v,list):out[k]=' '.join(map(str,v))
 return out

def dom_from_html(src,prefix):
 """Stable semantic prefixes; native element content represented with #text nodes."""
 soup=BeautifulSoup(src,'html.parser')
 # single top-level root expected; wrap if needed
 tops=[t for t in soup.contents if isinstance(t,Tag)];
 if len(tops)!=1:soup=BeautifulSoup('<div class="ui-fragment-root">'+src+'</div>','html.parser');tops=[soup.contents[0]]
 root=tops[0];elements={};seq=[0]
 def walk(node,parent,ord_):
  seq[0]+=1;name=f'{prefix}.e{seq[0]:04d}'
  if isinstance(node,NavigableString):
   elements[name]={'tag':'#text','paiRef':parent,'ordem':ord_,'atributos':{},'texto':str(node)};return name
  elements[name]={'tag':node.name,'paiRef':parent,'ordem':ord_,'atributos':sanitize_attrs(node.attrs),'texto':''}
  i=0
  for ch in node.children:
   if isinstance(ch,NavigableString) and not str(ch).strip():continue
   if not isinstance(ch,(NavigableString,Tag)):continue
   i+=1;walk(ch,name,i*10)
  return name
 ref=walk(root,None,10);return ref,elements

def normalize_elements(src,cref,issues):
 els=src.get('elementos') or {}
 if not els:
  r=cref+'.raiz';return r,{r:{'tag':'div','paiRef':None,'ordem':10,'atributos':{},'texto':''}}
 converted={}
 for key,v in els.items():
  t=v.get('tag') or 'div';converted[key]={'tag':t,'paiRef':v.get('paiRef'),'ordem':v.get('ordem',10),'atributos':sanitize_attrs(v.get('atributos')),'texto':''}
 # legacy textual content on nodes often appears with existing children. Preserve as child.
 for key,v in els.items():
  txt=v.get('texto')
  if converted[key]['tag']=='#text':
   converted[key]['texto']=str(txt or '')
   continue
  if txt is None or txt=='':continue
  if converted[key]['tag'] in ('input','img','br','meta','hr','path','rect','circle','link','source'):
   issues.append(f'{cref}: texto incompatível com elemento void {key}');continue
  rid=key+'.texto';i=1
  while rid in converted:rid=key+f'.texto{i}';i+=1
  children=[w for w in converted.values() if w['paiRef']==key]
  earlier=min([w.get('ordem') if isinstance(w.get('ordem'),int) else 10 for w in children],default=10)
  neword=earlier-1 if children else 10
  converted[rid]={'tag':'#text','paiRef':key,'ordem':neword,'atributos':{},'texto':str(txt)}
 # make explicit single root, merging any unparented elements
 roots=[k for k,v in converted.items() if v['paiRef'] is None]
 declared=src.get('raizRef')
 if len(roots)!=1 or declared not in roots:
  rid=cref+'.normalized_root';n=1
  while rid in converted:rid=cref+f'.normalized_root{n}';n+=1
  converted[rid]={'tag':'div','paiRef':None,'ordem':10,'atributos':{'class':'ui-normalized-fragment'},'texto':''}
  for n,k in enumerate(roots):converted[k]['paiRef']=rid;converted[k]['ordem']=10*(n+1)
  issues.append(f'{cref}: raiz múltipla/ausente, wrapper adicionado')
 else:rid=declared
 # verify parent refs, fix order collisions
 for k,v in list(converted.items()):
  if k!=rid and v['paiRef'] not in converted:
   issues.append(f'{cref}: paiRef órfão {k}->{v["paiRef"]}');v['paiRef']=rid
 siblings=defaultdict(list)
 for k,v in converted.items():siblings[v['paiRef']].append(k)
 for par,ks in siblings.items():
  vals=[converted[k]['ordem'] for k in ks]
  if not all(isinstance(v,int) for v in vals) or len(vals)!=len(set(vals)):
   ks=sorted(ks,key=lambda k:(converted[k].get('ordem') if isinstance(converted[k].get('ordem'),int) else 0,list(converted).index(k)))
   for n,k in enumerate(ks):converted[k]['ordem']=10*(n+1)
 return rid,converted

def from_old_states(old,elems):
 out={}
 for dim,desc in (old or {}).items():
  if not isinstance(desc,dict):continue
  options={};cmap=defaultdict(set)
  for value,os in desc.get('opcoes',{}).items():
   for er,e in os.get('elementos',{}).items():
    for cl in e.get('classesAdicionar',[]):cmap[er].add(cl)
    for cl in e.get('classesRemover',[]):cmap[er].add(cl)
  for value,os in desc.get('opcoes',{}).items():
   alvos=[]
   for er,change in os.get('elementos',{}).items():
    if er not in elems:continue
    origclass=set(elems[er]['atributos'].get('class','').split())
    flags={c:bool(c in (origclass|set(change.get('classesAdicionar',[]))) and c not in change.get('classesRemover',[])) for c in sorted(cmap.get(er,[]))}
    al={'tipo':'elemento','ref':er,'classes':flags,'atributos':sanitize_attrs(change.get('atributos',{}))}
    if 'texto' in change:al['texto']=str(change['texto'])
    alvos.append(al)
   options[value]={'alvos':alvos}
  if options:
   initial=desc.get('inicial') if desc.get('inicial') in options else next(iter(options))
   out[dim]={'inicial':initial,'opcoes':options}
 return out

def action_for_element(e):
 return e.get('atributos',{}).get('data-action') or e.get('atributos',{}).get('data-demo-action')

def convert_component(id,raw,issues):
 stru=raw.get('estrutura',{})
 root,els=normalize_elements(stru.get('html',{}),id,issues)
 cl=classify(id,'componente',source=raw)
 c=empty_blocks({'id':id,'tipo':'componente','nome':raw.get('identidade',{}).get('nome') or id},cl,
  {'raizRef':root,'elementos':els,'vinculos':[],'colecoes':[],'condicionais':[]},
  {'tokens':{},'regras':css_rules(stru.get('css',{}).get('regras',{}),id.replace('.','_'))})
 # state stored inside estrutura in legacy, but outside in canonical
 c['estados']=from_old_states(stru.get('estadosVisuais') or raw.get('estadosVisuais') or raw.get('estados'),els)
 # proven data-driven state dimension for professional access: CSS contains two explicit modes
 if id=='advogado.home.layout' and root in els:
  r=next((k for k,v in els.items() if v['atributos'].get('data-professional-access') is not None),None)
  if r:
   c['estados']['acessoProfissional']={'inicial':'enabled','opcoes':{
     'enabled':{'alvos':[{'tipo':'elemento','ref':r,'classes':{},'atributos':{'data-professional-access':'enabled'}}]},
     'restricted':{'alvos':[{'tipo':'elemento','ref':r,'classes':{},'atributos':{'data-professional-access':'restricted'}}]}}}
 for eid,e in els.items():
  if e['tag'] in ['button','a','input','select','textarea']:
   evt='change' if e['tag'] in ['select'] else 'click' if e['tag'] in ['button','a'] else 'input'
   c['interacoes'].append({'id':'event.'+eid,'elementoRef':eid,'evento':evt})
 return c

def handcrafted_component(cid,source,extra_css='',states=None):
 root,els=dom_from_html(source,cid.replace('.','_'))
 comp=empty_blocks({'id':cid,'tipo':'componente','nome':cid},classify(cid,'componente','comum'),
  {'raizRef':root,'elementos':els,'vinculos':[],'colecoes':[],'condicionais':[]},
  {'tokens':{},'regras':css_rules(extra_css,cid.replace('.','_'))})
 for k,e in els.items():
  if e['tag']=='button' or e['tag']=='a':comp['interacoes'].append({'id':'event.'+k,'elementoRef':k,'evento':'click'})
 return comp

header_src=f'''<header class="app-header" data-aj-header="v1">
<button class="app-menu-button" type="button" data-action="drawer.open" aria-label="Abrir menu"><span></span><span></span><span></span></button>
<div class="app-brand"><img src="{logo}" alt=""/><div class="app-brand-copy"><strong>AdvogadoJá+</strong><small>Profissional</small></div></div>
<button class="app-notifications" type="button" data-goto="notificacoes.lista.notificacoes" aria-label="Abrir notificações"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"></path></svg><span class="app-notifications-badge">2</span></button>
</header>'''
header_css=assets['header.css']+'\n.app-header[data-aj-header="v1"]{position:sticky;top:0;z-index:35;grid-template-columns:42px minmax(0,1fr) 42px;min-height:64px}\n.app-header[data-aj-header="v1"] .app-notifications svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}\n.app-header[data-aj-header="v1"] .app-notifications{position:relative}\n.app-header[data-aj-header="v1"] .app-notifications-badge{position:absolute;top:2px;right:0;min-width:17px;height:17px;border-radius:20px;display:grid;place-items:center;background:#ef4444;color:#fff;font-size:9px;font-weight:800}\n.app-header[data-aj-header="v1"] [hidden]{display:none!important}\n.app-header[data-aj-header="v1"] .app-brand-copy{display:flex;flex-direction:column}.app-header[data-aj-header="v1"] .app-brand-copy strong{font-size:16px;white-space:nowrap}.app-header[data-aj-header="v1"] .app-brand-copy small{font-size:10px;opacity:.75}\n.app-header[data-aj-header="v1"][data-ambiente="publico"] .app-brand{justify-self:center}.app-header[data-aj-header="v1"][data-ambiente="publico"]{grid-template-columns:42px minmax(0,1fr) 42px}\n'
header=handcrafted_component('ui.aj.header.v1',header_src,header_css)
hels=header['estrutura']['html']['elementos'];menu_btn=next(k for k,v in hels.items() if v['atributos'].get('data-action')=='drawer.open')
notif_btn=next(k for k,v in hels.items() if v['atributos'].get('data-goto'))
brandtxt=next(k for k,v in hels.items() if v['tag']=='#text' and v['texto']=='Profissional')
counttxt=next(k for k,v in hels.items() if v['tag']=='#text' and v['texto']=='2')
role_parent=hels[brandtxt]['paiRef']
for k,p in [(brandtxt,'props.perfil'),(counttxt,'props.notificacoes')]:
 header['estrutura']['html']['vinculos'].append({'id':'header.v.'+k,'elementoRef':k,'alvo':'texto','campo':p})
header['estados']['ambiente']={'inicial':'interno','opcoes':{}}
for mode in ['interno','publico']:
 hide=(mode=='publico');hids=[menu_btn,notif_btn]
 header['estados']['ambiente']['opcoes'][mode]={'alvos':[{'tipo':'elemento','ref':hel['estrutura']['html']['raizRef'] if False else header['estrutura']['html']['raizRef'],'classes':{},'atributos':{'data-ambiente':mode}},
  *[{'tipo':'elemento','ref':k,'classes':{},'atributos':{'hidden':hide}} for k in hids+[role_parent]]]}

# Derive authenticated nav from V1 home menus. No artificially invented URLs.
nav_v1={}
for profile,key in [('advogado','advogado.home_advogado'),('cliente','cliente.home_cliente')]:
 d=V1[key][1]['data']['components']['drawer'];nav_v1[profile]=copy.deepcopy(d)
nav_v1['escritorio']=copy.deepcopy(nav_v1['advogado'])
nav_v1['admin']={'avatar':'AD','name':'Administração','subtitle':'ACESSO INTERNO','showOnline':False,'items':[
 {'goto':'admin.home.dashboard','label':'Painel','icon':ICONS['inicio']},
 {'goto':'admin.oab.lista','label':'Validação OAB','icon':ICONS['lista']},
 {'goto':'admin.perfil.moderacao','label':'Moderação','icon':ICONS['perfil']},
 {'goto':'admin.denuncias.lista','label':'Denúncias','icon':ICONS['lista']},
 {'goto':'admin.assinatura.lista','label':'Assinaturas','icon':ICONS['lista']},
 {'goto':'admin.auditoria.logs','label':'Logs','icon':ICONS['config']},
 ],'logoutGoto':'auth.sessao.entrar','logoutLabel':'Sair','footer':'Versão: 1.0.55','emergencyLabel':'Disque 190'}
nav_v1['estudante']={'avatar':'ES','name':'Estudante','subtitle':'MINHA CONTA','showOnline':False,'items':[
 {'goto':'estudante.home.inicio','label':'Início','icon':ICONS['inicio']},
 {'goto':'estudante.cursos.catalogo','label':'Cursos','icon':ICONS['lista']},
 {'goto':'estudante.cursos.meus_cursos','label':'Meus cursos','icon':ICONS['lista']},
 {'goto':'estudante.assinatura.planos','label':'Planos','icon':ICONS['config']},
 {'goto':'estudante.perfil.editar_academicos','label':'Perfil','icon':ICONS['perfil']}],
 'logoutGoto':'auth.sessao.entrar','logoutLabel':'Sair','footer':'Versão: 1.0.55','emergencyLabel':'Disque 190'}

shared={'ui.aj.header.v1':header}; menuids={};menu_target_map={}
for profile,data in nav_v1.items():
 cid='ui.aj.menu.'+profile+'.v1'
 # Faithful V1 drawer classes and structure; specific links are only present if target exists.
 parts=['<aside class="prototype-drawer" aria-hidden="true"><button class="drawer-backdrop" data-action="drawer.close" aria-label="Fechar menu" type="button"></button><div class="drawer-panel"><div class="drawer-top"><div class="drawer-identity">',
 f'<div class="drawer-avatar">{html.escape(data.get("avatar",""))}</div><div class="drawer-profile"><strong>{html.escape(data.get("name",""))}</strong><small>{html.escape(data.get("subtitle",""))}</small></div></div></div>']
 if data.get('showOnline'):
  parts.append('<button class="drawer-online" type="button" data-action="online.toggle" data-online-root><span class="online-dot"></span><span class="drawer-online-copy"><strong data-online-status>Online</strong><small data-online-copy>Recebendo novas solicitações</small></span><i class="online-switch"><b></b></i></button>')
 parts.append('<nav class="drawer-nav" aria-label="Menu principal">')
 for item in data.get('items',[]):
  dest=resolve(item['goto']);attr=(f' data-goto="{dest}"' if dest else '')
  cap=(f' data-professional-capability="{html.escape(item.get("capability",""))}"' if item.get('capability') else '')
  parts.append(f'<button type="button"{attr}{cap}><svg class="drawer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{html.escape(item.get("icon") or ICONS["lista"])}"></path></svg><span>{html.escape(item["label"])}</span></button>')
 parts.append('</nav><div class="drawer-footer"><div class="drawer-footer-top">')
 logout=resolve(data.get('logoutGoto','auth.sessao.entrar')) or 'auth.sessao.entrar'
 parts.append(f'<button class="drawer-logout" type="button" data-goto="{logout}"><span>Sair</span></button><small>{html.escape(data.get("footer",""))}</small></div><button class="drawer-emergency" data-action="emergency.mock" type="button">{html.escape(data.get("emergencyLabel","Disque 190"))}</button></div></div></aside>')
 mc=handcrafted_component(cid,''.join(parts),assets['drawer.css']+'\n.prototype-drawer [hidden]{display:none!important}\n')
 me=mc['estrutura']['html']['elementos']
 rr=mc['estrutura']['html']['raizRef']
 mc['estados']['painel']={'inicial':'fechado','opcoes':{
  'fechado':{'alvos':[{'tipo':'elemento','ref':rr,'classes':{'open':False},'atributos':{'aria-hidden':'true'}}]},
  'aberto':{'alvos':[{'tipo':'elemento','ref':rr,'classes':{'open':True},'atributos':{'aria-hidden':'false'}}]}}}
 if data.get('showOnline'):
  status=next((k for k,v in me.items() if v['tag']=='#text' and v['texto']=='Online'),None)
  switch=next((k for k,v in me.items() if v['atributos'].get('data-online-root') is not None),None)
  copytxt=next((k for k,v in me.items() if v['tag']=='#text' and v['texto']=='Recebendo novas solicitações'),None)
  mc['estados']['disponibilidade']={'inicial':'online','opcoes':{}}
  for name in ['online','offline']:
   arr=[]
   if switch:arr.append({'tipo':'elemento','ref':switch,'classes':{'is-offline':name=='offline'},'atributos':{'aria-pressed':name=='online'}})
   if status:arr.append({'tipo':'elemento','ref':status,'classes':{},'atributos':{},'texto':'Online' if name=='online' else 'Offline'})
   if copytxt:arr.append({'tipo':'elemento','ref':copytxt,'classes':{},'atributos':{},'texto':'Recebendo novas solicitações' if name=='online' else 'Pausado para novas solicitações'})
   mc['estados']['disponibilidade']['opcoes'][name]={'alvos':arr}
 shared[cid]=mc;menuids[profile]=cid; menu_target_map[profile]=[x for x in data['items'] if resolve(x['goto'])]

# Screen order proven in V1 index (thematic, not always procedural).
auth_seq=['auth.cadastro.tipo_conta','auth.cadastro.identificacao','auth.cadastro.contato','auth.cadastro.endereco','auth.cadastro.seguranca','auth.cadastro.consentimentos','auth.cadastro.revisao','auth.cadastro.concluido']
auth_before=['auth.inicializacao.splash','auth.inicializacao.boas_vindas','auth.sessao.entrar']
# for automatic inferred next links, only when next screen is in inventory
nextmap={x:y for x,y in zip(auth_seq,auth_seq[1:]) if x in IDS and y in IDS}
nextmap.update({'auth.inicializacao.splash':'auth.inicializacao.boas_vindas','auth.inicializacao.boas_vindas':'auth.sessao.entrar',
 'cliente.onboarding.localizacao':'cliente.onboarding.preferencias_contato',
 'cliente.onboarding.preferencias_contato':'cliente.onboarding.concluido',
 'advogado.onboarding.dados_academicos':'advogado.onboarding.dados_profissionais',
 'advogado.onboarding.areas_atuacao':'advogado.onboarding.perfil_profissional',
 'advogado.onboarding.perfil_profissional':'advogado.onboarding.disponibilidade',
 'advogado.onboarding.disponibilidade':'advogado.onboarding.revisao_profissional',
 'advogado.onboarding.revisao_profissional':'advogado.onboarding.conclusao_profissional',
 'escritorio.onboarding.vinculo_escritorio':'escritorio.onboarding.cadastro_escritorio'})

issues=[];converted={};rawcomponents={};source_elements={}
for sid,(meta,doc) in P9.items():
 if not doc:continue
 for cid,raw in doc.get('definicoes',{}).items():
  if cid not in rawcomponents:rawcomponents[cid]=raw
for cid,raw in rawcomponents.items():
 if cid.startswith('modal.route-modal.') or 'route-modal' in cid:continue
 shared[cid]=convert_component(cid,raw,issues)

removed=Counter(); corrected=Counter(); candidate=0; buttons_without_dest=0
for sid,(meta,doc) in P9.items():
 if not doc:continue
 orig=doc['estrutura']; oinst=orig.get('html',{}).get('composicao',{})
 screen=empty_blocks(copy.deepcopy(doc['identidade']),classify(sid,'tela',meta.get('area'),doc),
  {'raizRef':orig.get('html',{}).get('raizRef','screen.root'),'composicao':{}},
  {'tokens':{k:str(v) for k,v in orig.get('css',{}).get('tokens',{}).items()},'regras':css_rules(orig.get('css',{}).get('regras',{}),sid.replace('.','_'))})
 instances={};owners=defaultdict(list)
 for ik,ins in oinst.items():
  cid=ins.get('componenteRef')
  if cid not in shared:removed['modais_navegacao']+=1;continue
  instances[ik]=ins
  for er in shared[cid]['estrutura']['html']['elementos']:owners[er].append(ik)
 # Replace preexisting app headers / menus with shared V1 designs; maintain slot location.
 header_candidates=[]; menu_candidates=[]
 for ik,ins in list(instances.items()):
  cid=ins['componenteRef'];tag=(ins.get('slot') or '').lower();cl=cid.lower()
  if tag=='menu' and any(x in cl for x in ('drawer','menu.')):menu_candidates.append(ik)
  if tag=='header' and ('header' in cl or 'topbar' in cl):header_candidates.append(ik)
 is_public=sid.startswith('auth.')
 is_splash=sid in ['auth.inicializacao.splash','auth.inicializacao.boas_vindas']
 role=meta['area'] if meta['area'] in menuids else 'cliente'
 if not is_splash:
  if header_candidates:
   hk=header_candidates[0]
   instances[hk]=dict(instances[hk],componenteRef='ui.aj.header.v1',_norm_role=role,_norm_mode='publico' if is_public else 'interno')
   for extra in header_candidates[1:]:
    if extra.startswith('screen.header'):instances.pop(extra,None);removed['headers_duplicados']+=1
  else:
   # mount a new header in root, don't invent nested wrapper
   hk='screen.header.v1'
   rootk=screen['estrutura']['html']['raizRef']
   parentroot=shared[instances[rootk]['componenteRef']]['estrutura']['html']['raizRef']
   instances[hk]={'componenteRef':'ui.aj.header.v1','paiRef':parentroot,'slot':'header','ordem':-10,'_norm_role':role,'_norm_mode':'publico' if is_public else 'interno'}
   corrected['headers_completados']+=1
 else:hk=None
 if not is_public:
  if menu_candidates:
   mk=menu_candidates[0];instances[mk]=dict(instances[mk],componenteRef=menuids[role]);
   for extra in menu_candidates[1:]:
    instances.pop(extra,None);removed['menus_duplicados']+=1
  else:
   mk='screen.menu.v1';rootk=screen['estrutura']['html']['raizRef'];parentroot=shared[instances[rootk]['componenteRef']]['estrutura']['html']['raizRef']
   instances[mk]={'componenteRef':menuids[role],'paiRef':parentroot,'slot':'menu','ordem':970};corrected['menus_completados']+=1
 else:
  mk=None
  for dead in menu_candidates:instances.pop(dead,None);removed['menu_publico']+=1
 if is_splash:
  for dead in header_candidates:instances.pop(dead,None)
 # Recalc element owners post replacements
 owners=defaultdict(list)
 for ik,ins in instances.items():
  cid=ins['componenteRef'];
  for er in shared[cid]['estrutura']['html']['elementos']:owners[er].append(ik)
 # resolve parent element references -> instance parent and element target, in canonical representation
 rootid=screen['estrutura']['html']['raizRef']
 if rootid not in instances:
  rootid=next(iter(instances));screen['estrutura']['html']['raizRef']=rootid
 for ik,ins in instances.items():
  parent_old=ins.get('paiRef');target=None;parent=None
  if ik!=rootid:
   if parent_old in owners:
    poss=[k for k in owners[parent_old] if k!=ik]
    if poss:parent=poss[0];target=parent_old
   if not parent:
    parent=rootid;target=shared[instances[rootid]['componenteRef']]['estrutura']['html']['raizRef']
    issues.append(f'{sid}/{ik}: pai antigo {parent_old} não resolve, anexado à raiz')
  props={};override={}
  if ins.get('_norm_role'):
   props={'perfil':('' if is_public else {'advogado':'Profissional','cliente':'Cliente','admin':'Administração','escritorio':'Escritório','estudante':'Estudante'}.get(role,'Cliente')),'notificacoes':'2' if role=='advogado' else '3' if role=='cliente' else '0'}
   override={'ambiente':ins['_norm_mode']}
  if ins.get('estadoVisual'):
   override.update({dim:val for dim,val in ins['estadoVisual'].items() if val in shared[ins['componenteRef']].get('estados',{}).get(dim,{}).get('opcoes',{})})
  screen['estrutura']['html']['composicao'][ik]={'componenteRef':ins['componenteRef'],'paiRef':parent,'alvoRef':target,'ordem':ins.get('ordem',10) if isinstance(ins.get('ordem'),int) else 10,'props':props,'estados':override}
 # parent order and root consistency fixes
 comp=screen['estrutura']['html']['composicao']
 if rootid in comp:comp[rootid]['paiRef']=None;comp[rootid]['alvoRef']=None
 for ik,v in comp.items():
  if ik!=rootid and v['paiRef'] not in comp:
   v['paiRef']=rootid;v['alvoRef']=shared[comp[rootid]['componenteRef']]['estrutura']['html']['raizRef']
 # every other root is now nested
 for ik,v in comp.items():
  if ik!=rootid and v['paiRef']==ik:v['paiRef']=rootid;v['alvoRef']=shared[comp[rootid]['componenteRef']]['estrutura']['html']['raizRef']
 # If removed parent's target: normalize into root
 for ik,v in comp.items():
  if ik==rootid:continue
  if v['alvoRef'] not in shared[comp[v['paiRef']]['componenteRef']]['estrutura']['html']['elementos']:
   v['paiRef']=rootid;v['alvoRef']=shared[comp[rootid]['componenteRef']]['estrutura']['html']['raizRef']
 # ensure order unique per target
 sib=defaultdict(list)
 for ik,v in comp.items():sib[(v['paiRef'],v['alvoRef'])].append(ik)
 for group,ks in sib.items():
  ordered=sorted(ks,key=lambda k:(comp[k]['ordem'],list(comp).index(k)))
  if len({comp[k]['ordem'] for k in ks})!=len(ks):
   for n,k in enumerate(ordered):comp[k]['ordem']=n*10
 # create explicit screen effects for provenance-supported links + local states, do not switch screen
 seen=set()
 for ik,v in comp.items():
  cid=v['componenteRef'];cc=shared[cid]
  nodes=cc['estrutura']['html']['elementos']
  for event in cc['interacoes']:
   eid=event['elementoRef'];e=nodes[eid];a=e['atributos']; act=a.get('data-action');dest=resolve(a.get('data-goto')) if a.get('data-goto') else None
   eff=None
   if dest:eff={'tipo':'navegar','destinoRef':dest}
   elif act=='drawer.open' and mk and ik!=mk:eff={'tipo':'definir_estado','instanciaRef':mk,'dimensao':'painel','valor':'aberto'}
   elif act=='drawer.close' and mk:eff={'tipo':'definir_estado','instanciaRef':mk,'dimensao':'painel','valor':'fechado'}
   elif act=='online.toggle': # handled in local preview as toggle, but target is canonical choice 'offline'
    if mk and 'disponibilidade' in shared[comp[mk]['componenteRef']]['estados']:
     eff={'tipo':'definir_estado','instanciaRef':mk,'dimensao':'disponibilidade','valor':'offline'}
    elif 'disponibilidade' in cc['estados']:eff={'tipo':'definir_estado','instanciaRef':ik,'dimensao':'disponibilidade','valor':'offline'}
   if eff:
    key=(ik,event['id'])
    if key not in seen:
     screen['interacoes'].append({'id':sid+'.link.'+str(len(screen['interacoes'])+1),'origem':{'instanciaRef':ik,'eventoRef':event['id']},'efeito':eff})
     seen.add(key)
   elif e['tag']=='button':buttons_without_dest+=1
 # Home buttons with source-backed candidate destinations from Projeto_9_Rotas_Fluxo_Preview_V6.zip / Dados_Motor_V4/documento.json.
 # They are simulated relationships; the normalized HTML never navigates.
 if sid=='advogado.home':
  v6_candidates={('screen.hero','hero_restricted.e005'):'advogado.configuracao.validacao_oab',
    ('screen.actions','actions.e007'):'advogado.clientes.detalhe_solicitacao',
    ('screen.actions','actions.e016'):'advogado.clientes.detalhe_solicitacao',
    ('screen.actions','actions.e025'):'advogado.clientes.detalhe_solicitacao'}
  for (ik,eid),dest in v6_candidates.items():
   if ik not in comp or dest not in IDS:continue
   cc=shared[comp[ik]['componenteRef']]
   ev=next((ev for ev in cc['interacoes'] if ev['elementoRef']==eid),None)
   if not ev or (ik,ev['id']) in seen:continue
   screen['interacoes'].append({'id':sid+'.rota_documentada_v6.'+str(len(screen['interacoes'])+1)+'.candidata',
     'origem':{'instanciaRef':ik,'eventoRef':ev['id']},
     'efeito':{'tipo':'navegar','destinoRef':dest}})
   seen.add((ik,ev['id']))
 # Add strong evidence workflow progression only if exactly one continue button and destination documented by sequence.
 if sid in nextmap and nextmap[sid] in IDS:
  matches=[]
  for ik,v in comp.items():
   cc=shared[v['componenteRef']];els=cc['estrutura']['html']['elementos']
   for event in cc['interacoes']:
    n=els[event['elementoRef']];a=n['atributos'];
    descendants=[x.get('texto','') for nid,x in els.items() if x.get('paiRef')==event['elementoRef']]
    caption=(' '.join(descendants)+' '+a.get('aria-label','')).lower()
    if re.search(r'\b(continuar|próximo|avançar|começar|iniciar|entrar)\b',caption) and n['tag']=='button' and not a.get('data-goto') and (ik,event['id']) not in seen:matches.append((ik,event))
  if len(matches)==1:
   ik,ev=matches[0];screen['interacoes'].append({'id':sid+'.sequencia.candidata','origem':{'instanciaRef':ik,'eventoRef':ev['id']},'efeito':{'tipo':'navegar','destinoRef':nextmap[sid]}});candidate+=1
 # Screen scenarios for states are generated from confirmed dimensions (not random business mocks)
 for ik,v in comp.items():
  cc=shared[v['componenteRef']]
  for dim,definition in cc['estados'].items():
   for val in definition['opcoes']:
    # cap scenarios to avoid long menus; all choices still in component state
    if len(screen['mocks']['cenarios'])>=8:break
    screen['mocks']['cenarios'].append({'id':sid+'.cenario.'+str(len(screen['mocks']['cenarios'])+1),'nome':f'{ik}: {dim}={val}','tipo':'estado_visual','valores':{f'{ik}.{dim}':val}})
 converted[sid]=screen

# Don't persist unused legacy components; shared ones also deduped.
needed=set()
for s in converted.values():needed.update(x['componenteRef'] for x in s['estrutura']['html']['composicao'].values())
shared={k:v for k,v in shared.items() if k in needed}
# Propose source P9 resetar_senha HTML has no structural JSON: convert real page fragment, without inventing route.
if P9['auth.sessao.resetar_senha'][1] is None:
 meta=P9['auth.sessao.resetar_senha'][0];src=BeautifulSoup(Z.read('02/'+meta['path']),'html.parser')
 # strip scripts/style controls; use visible content from main/body and preserve tags; stylesheet in source
 main=src.select_one('main') or src.select_one('section') or src.body
 for x in list(main.select('script,style')):x.decompose()
 cid='auth.sessao.resetar_senha.conteudo'
 cc=handcrafted_component(cid,str(main),'\n'.join(x.get_text() for x in src.select('style')))
 shared[cid]=cc
 sid='auth.sessao.resetar_senha'
 layid='ui.aj.layout.publico';
 if layid not in shared:
  shared[layid]=handcrafted_component(layid,'<div class="aj-base-app"><div class="aj-layout-header"></div><main class="aj-layout-main"></main></div>', '.aj-base-app{min-height:100vh;background:#eef2f6;color:#172033}.aj-layout-main{width:min(100%,720px);margin:auto;padding:24px 16px}')
 rootcomp=shared[layid];els=rootcomp['estrutura']['html']['elementos'];h=next(k for k,v in els.items() if 'aj-layout-header' in v['atributos'].get('class',''));m=next(k for k,v in els.items() if 'aj-layout-main' in v['atributos'].get('class',''))
 # from source metadata; header public uses V1 logo only
 screen=empty_blocks({'id':sid,'tipo':'tela','nome':meta.get('name','Redefinir senha')},classify(sid,'tela','auth'),{'raizRef':'screen.root','composicao':{
  'screen.root':{'componenteRef':layid,'paiRef':None,'alvoRef':None,'ordem':10,'props':{},'estados':{}},
  'screen.header':{'componenteRef':'ui.aj.header.v1','paiRef':'screen.root','alvoRef':h,'ordem':10,'props':{'perfil':'','notificacoes':'0'},'estados':{'ambiente':'publico'}},
  'screen.content':{'componenteRef':cid,'paiRef':'screen.root','alvoRef':m,'ordem':20,'props':{},'estados':{}}}}, {'tokens':{},'regras':[]})
 # corrected wrong args handling later
 converted[sid]=screen;shared['ui.aj.header.v1']=header

# Save the corpus and track exact sources; screen .json contains no embedded component clones.
paths=[]
for cid,c in shared.items():jwrite(OUT/'componentes'/cid.replace('.','/')/'documento.json',c)
for sid,s in converted.items():
 p=OUT/'telas'/sid.replace('.','/')
 jwrite(p/'documento.json',s)
 paths.append((sid,p))
indexes=[{'id':id,'nome':x['identidade']['nome'],'area':id.split('.')[0], 'arquivo':'telas/'+id.replace('.','/')+'/visualizar.html', 'origem':P9[id][0]['path'], 'instancias':len(x['estrutura']['html']['composicao']),'interacoes':len(x['interacoes'])} for id,x in converted.items()]
write(OUT/'dados'/'indice_telas.json',json.dumps(indexes,ensure_ascii=False,indent=2))
# relationship map source-linked, no copied navigation registry inside JSON
edges=[]
for sid,s in converted.items():
 for i in s['interacoes']:
  if i['efeito']['tipo']=='navegar':edges.append({'origem':sid,'destino':i['efeito']['destinoRef'],'interacaoRef':i['id'],'natureza':'inferencia_de_sequencia' if i['id'].endswith('candidata') else 'atributo_explicito_do_html'})
write(OUT/'dados'/'relacoes_extraidas.json',json.dumps(edges,ensure_ascii=False,indent=2))
write(OUT/'dados'/'pendencias_normalizacao.json',json.dumps({'avisos_estruturais':issues,'observacoes_css':cssparse_warnings,'metadados':{'telas':len(converted),'componentes':len(shared),'rotas_em_estudo':len(edges),'sequencias_inferidas':candidate,'botoes_sem_destino':buttons_without_dest,'headers_completados':corrected['headers_completados'],'menus_completados':corrected['menus_completados']}},ensure_ascii=False,indent=2))
print('BUILD_JSON',len(converted),len(shared),len(edges),'CSS warnings',len(cssparse_warnings),'structural',len(issues),'removed',removed,'added',corrected)
