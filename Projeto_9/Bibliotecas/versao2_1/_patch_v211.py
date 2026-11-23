import json,re,sys
from pathlib import Path
from bs4 import BeautifulSoup,Tag,NavigableString
ROOT=Path(sys.argv[1])
base=ROOT/'Projeto_9/Bibliotecas'
target=base/'versao2_1/componentes/catalogo.json'
catalog=json.loads(target.read_text(encoding='utf8'))
changes={
'v21.01.telas.advogado.V1_011_atendimentos_advogado.screen.content':('V1_011_atendimentos_advogado.html','advogado','atendimentos_advogado','content'),
'v21.01.telas.advogado.V1_031_home_advogado.screen.actions':('V1_031_home_advogado.html','advogado','home_advogado','actions'),
'v21.01.telas.advogado.V1_038_perfil_profissional.screen.content':('V1_038_perfil_profissional.html','advogado','perfil_profissional','content'),
'v21.01.telas.cliente.V1_060_home_cliente.screen.search':('V1_060_home_cliente.html','cliente','home_cliente','search'),
'v21.01.telas.cliente.V1_060_home_cliente.screen.results':('V1_060_home_cliente.html','cliente','home_cliente','results'),
'v21.01.telas.cliente.V1_060_home_cliente_menu_estudante_limpo.screen.search':('V1_060_home_cliente_menu_estudante_limpo.html','cliente','home_cliente','search'),
'v21.01.telas.cliente.V1_060_home_cliente_menu_estudante_limpo.screen.results':('V1_060_home_cliente_menu_estudante_limpo.html','cliente','home_cliente','results'),
}
def lookup(ctx,path):
 v=ctx
 for p in path.split('.'):
  if isinstance(v,dict): v=v.get(p,'')
  else: return ''
 return v
def expand(html,ctx):
 def each(m):
  seq=lookup(ctx,m.group(1));arr=[]
  for item in (seq or []):
   scope={**ctx,**(item if isinstance(item,dict) else {'this':item})}
   arr.append(expand(m.group(2),scope))
  return ''.join(arr)
 html=re.sub(r'{{#each\s+([\w.]+)}}([\s\S]*?){{/each}}',each,html)
 def ifblock(m):
  val=lookup(ctx,m.group(1));yes,sep,no=m.group(2).partition('{{else}}');return expand(yes if val else no,ctx)
 html=re.sub(r'{{#if\s+([\w.]+)}}([\s\S]*?){{/if}}',ifblock,html)
 return re.sub(r'{{\s*([\w.]+)\s*}}',lambda m:str(lookup(ctx,m.group(1)) or ''),html)
def tograph(html):
 s=BeautifulSoup(html,'html.parser');elements={'v21.wrapper':{'tag':'div','paiRef':None,'ordem':0,'atributos':{'class':'v21-instance-wrapper'},'texto':''}}
 total=[0]
 def walk(tag,parent):
  count=0
  for ch in tag.children:
   if not isinstance(ch,(Tag,NavigableString)): continue
   count+=10;total[0]+=1;k=f'v21.repeat.e{total[0]:05d}'
   if isinstance(ch,Tag):
    attr={key:(' '.join(v) if isinstance(v,list) else v if v is not None else '') for key,v in ch.attrs.items()}
    elements[k]={'tag':ch.name,'paiRef':parent,'ordem':count,'atributos':attr,'texto':''}
    walk(ch,k)
   else:elements[k]={'tag':'#text','paiRef':parent,'ordem':count,'atributos':{},'texto':str(ch)}
 root=s.new_tag('div');[root.append(x.extract()) for x in list(s.contents)];walk(root,'v21.wrapper')
 return elements
for comp, (fn,folder,slug,sec) in changes.items():
 source=base/f'versao1/01/telas/{folder}/{fn}'
 html=source.read_text(encoding='utf8')
 m=re.search(r'<script[^>]*id="v1-embedded-bundle"[^>]*>(.*?)</script>',html,re.S)
 assert m, 'bundle ausente '+str(source)
 bundle=json.loads(m.group(1))
 comp_data=bundle['data']['components'][sec]
 template=bundle['files'][f'telas/{folder}/{slug}/main/{sec}/template.html']
 new_elements=tograph(expand(template,comp_data).strip())
 old=catalog[comp]['estrutura']['html']['elementos'];new_events=[]
 for ev in catalog[comp]['interacoes']:
  old_ref=ev['elementoRef'];old_elem=old[old_ref];old_attr=old_elem.get('atributos',{})
  constraints={key:old_attr[key] for key in ['data-action','data-goto','data-filter-type','data-ui-action','id'] if key in old_attr and old_attr[key]}
  candidates=[]
  for key,node in new_elements.items():
   at=node.get('atributos',{})
   if node.get('tag')!=old_elem.get('tag'):continue
   if constraints:
    if not all(at.get(k)==v for k,v in constraints.items()):continue
   elif old_attr.get('class'):
    if not set(old_attr['class'].split()).intersection(at.get('class','').split()):continue
   candidates.append(key)
  if not candidates:
   candidates=[key for key,node in new_elements.items() if node.get('tag')==old_elem.get('tag')]
  new_events.append({**ev,'elementoRef':candidates[0] if candidates else old_ref})
 if comp.endswith('V1_038_perfil_profissional.screen.content'):
  for ev in new_events:ev['elementoRef']=new_events[0]['elementoRef']
 catalog[comp]['estrutura']['html']['elementos']=new_elements
 catalog[comp]['estrutura']['html']['colecoes']=[{'id':comp+'.'+key,'campo':'dados.mocks.'+key,'quantidade':len(val),'origem':'html_v1_arquivo_embutido'} for key,val in sorted(comp_data.items()) if isinstance(val,list) and ('{{#each '+key+'}}' in template)]
 catalog[comp]['interacoes']=new_events
 print(comp,len(old),'->',len(new_elements))
hero=catalog['v21.01.telas.advogado.V1_031_home_advogado.screen.hero']
for node in hero['estrutura']['html']['elementos'].values():
 if node.get('tag')=='#text' and '{{' in node.get('texto',''):
  node['texto']=re.sub(r'{{\s*(?:#if|/if)[^}]*}}','',node['texto'])
out=json.dumps(catalog,ensure_ascii=False,separators=(',',':'))
target.write_text(out,encoding='utf8')
import hashlib
data=target.read_bytes()
sha=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
assert sha=='31b1355f09a7cadc44250fdf49c8bc6fead3a53d',f'Hash diferente: {sha}'
print('CATALOGO VALIDADO',len(catalog),'componentes; SHA',sha)
rdir=base/'versao2_1'
readme=rdir/'LEIA_ME.md'
r=readme.read_text(encoding='utf8').replace('Biblioteca AdvogadoJá V2.1 —','Biblioteca AdvogadoJá V2.1.1 —',1)
r+='\n## Atualização V2.1.1\nColeções de 7 componentes foram reconstruídas com os dados de demonstração dos HTMLs V1. Marcadores Handlebars deixam de aparecer na interface. As rotas pendentes permanecem identificadas; homologação visual e funcional ainda é necessária.\n'
readme.write_text(r,encoding='utf8')
report={'versao':'2.1.1','telas':192,'componentes':1181,'rotas':431,'componentes_colecoes_corrigidos':7,'componentes_condicionais_corrigidos':1,'catalogo_sha':sha,'teste':'reconstrucao_byte_a_byte_confirmada','limitacao':'sem_homologacao_visual_automatica'}
(rdir/'AUDITORIA_REVISAO_V2_1_1.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
details={'componentes':list(changes),'origem':'versao1/01/telas','motor_js':'inalterado','restricoes':['colecoes materializadas com mocks','rotas pendentes nao homologadas']}
(rdir/'AUDITORIA_TEMPLATES_CORRIGIDOS.json').write_text(json.dumps(details,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(rdir/'CORRECOES_V2_1_1.md').write_text('# Biblioteca V2.1.1 — Correção dos templates\n\nO catálogo foi reconstruído a partir das coleções originais de demonstração. Foram atualizados 7 componentes com repetições e 1 componente com condicionais, preservando os demais arquivos e o motor comum. A integridade do catálogo foi conferida pelo SHA do pacote corrigido.\n\nA correção não homologa filtros dinâmicos, rotas candidatas ou equivalência visual de produção.\n',encoding='utf8')
