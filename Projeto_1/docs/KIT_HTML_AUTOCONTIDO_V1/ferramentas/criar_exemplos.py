from pathlib import Path
import shutil,json
ROOT=Path(__file__).resolve().parents[1]
base=ROOT/'modelos/projeto_base'

specs={
 'arvore-repositorio':{
  'modo':'arvore','titulo':'Visualizador de árvore — exemplo offline',
  'itens':[
   ('projeto',None,'advogadoja-demo','pasta','Árvore fictícia usada para ilustrar hierarquia e busca.',{'origem':'exemplo ilustrativo'}),
   ('web','projeto','web','pasta','Frontend da demonstração.',{}),
   ('ui','web','ui','pasta','Composição e visual.',{}),
   ('cadastro','ui','cadastro','pasta','Etapas de cadastro.',{}),
   ('login','cadastro','LoginPage.tsx','arquivo','Tela de login com campos e estados de interação.',{'linguagem':'TSX','papel':'composição'}),
   ('login-hook','cadastro','LoginPage.hooks.ts','arquivo','Estados e eventos exclusivos do login.',{'linguagem':'TypeScript','papel':'comportamento'}),
   ('login-css','cadastro','LoginPage.styles.ts','arquivo','Estilos exclusivos da tela de login.',{'linguagem':'TypeScript','papel':'visual'}),
   ('home','ui','home','pasta','Tela principal ilustrativa.',{}),
   ('home-view','home','HomePage.tsx','arquivo','Estrutura de regiões da Home.',{'linguagem':'TSX'}),
   ('comp','web','components','pasta','Componentes do frontend.',{}),
   ('shell','comp','Shell.tsx','arquivo','Layout local da aplicação.',{'linguagem':'TSX'}),
   ('form','comp','Form.tsx','arquivo','Campos, labels e mensagens de formulário.',{}),
   ('data','web','data','pasta','Dados e contratos.',{}),
   ('json','data','catalogo.json','arquivo','JSON com IDs estáveis e atributos.',{'linguagem':'JSON'}),
   ('flow','data','fluxo.json','arquivo','Relações entre telas.',{'linguagem':'JSON'}),
   ('api','projeto','api','pasta','Camada de API ilustrativa.',{}),
   ('controller','api','controllers','pasta','Recepção e tradução de chamadas.',{}),
   ('controller-auth','controller','auth.controller.ts','arquivo','Controlador de autenticação.',{}),
   ('service','api','services','pasta','Regras de negócio do exemplo.',{}),
   ('service-auth','service','auth.service.ts','arquivo','Regra de autenticação simulada.',{}),
  ]
 },
 'catalogo-modulos':{
  'modo':'modulos','titulo':'Catálogo de módulos — exemplo offline',
  'itens':[
    ('dashboard',None,'Dashboard','módulo','Visão geral com indicadores fictícios.',{'telas':2,'estado':'demonstrativo'}),
    ('reservas',None,'Reservas','módulo','Calendário e gestão de reservas simuladas.',{'telas':5,'estado':'demonstrativo'}),
    ('movimentacoes',None,'Movimentações','módulo','Tabela de movimentações e filtros.',{'telas':4,'estado':'demonstrativo'}),
    ('pessoas',None,'Pessoas','módulo','Pessoas, contatos e permissões fictícios.',{'telas':3,'estado':'demonstrativo'}),
    ('relatorios',None,'Relatórios','módulo','Consultas e exportação de dados fictícios.',{'telas':3,'estado':'demonstrativo'}),
    ('configuracoes',None,'Configurações','módulo','Opções locais do exemplo.',{'telas':2,'estado':'demonstrativo'}),
  ]
 },
 'aplicacao-painel':{
  'modo':'aplicacao','titulo':'Painel de aplicação — exemplo offline',
  'itens':[
   ('home',None,'Início','tela','Ponto de entrada da aplicação ilustrativa.',{'blocos':['boas-vindas','indicadores','atalhos']}),
   ('clientes',None,'Clientes','tela','Lista e detalhes de registros fictícios.',{'blocos':['filtro','lista','detalhe']}),
   ('tarefas',None,'Tarefas','tela','Organizador ilustrativo com estados simulados.',{'blocos':['filtro','cards','ações']}),
   ('ajustes',None,'Ajustes','tela','Preferências locais, sem backend.',{'blocos':['configurações','histórico']}),
  ]
 }
}
for key, cfg in specs.items():
 dst=ROOT/'exemplos'/key
 if dst.exists():shutil.rmtree(dst)
 shutil.copytree(base,dst,ignore=shutil.ignore_patterns('saida'))
 p=json.loads((dst/'projeto.json').read_text('utf-8'))
 p.update({'modo':cfg['modo'],'id':key,'titulo':cfg['titulo']})
 (dst/'projeto.json').write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 itens=[]
 for keyid,parent,title,kind,desc,fields in cfg['itens']:
  itens.append({'id':keyid,'parentId':parent,'titulo':title,'tipo':kind,'descricao':desc,'campos':fields,'palavrasChave':['exemplo','fictício','autocontido']})
 data={'schema':'html.autocontido.dados.v1','versao':1,'itens':itens}
 (dst/'dados/conteudo.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print('Created',dst, 'items=',len(itens))
