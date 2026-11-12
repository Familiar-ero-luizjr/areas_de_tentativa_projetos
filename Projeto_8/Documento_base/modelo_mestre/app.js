/* Laboratório de Contrato Vivo — autocontido, sem dependências externas. */
'use strict';

const APP_KEY = 'advogadoja.contrato-vivo.v1';
const ENGINES = [
  { id:'flow', name:'Flow', icon:'↗', intro:'Leitura proposta V0.2: nós, jornadas, ocorrências, bifurcações, caminhos, relações e prévia. Cada funcionalidade recebe os campos necessários; o motor apenas vincula IDs explícitos.' },
  { id:'prototype', name:'Protótipo', icon:'▣', intro:'Resolve telas e componentes identificados e apresenta sua versão visual a partir dos blocos próprios de estrutura e estilos.' },
  { id:'map', name:'Mapa', icon:'◎', intro:'Nós e relações de interação. Identidade resolve referências e classificação permite agrupar o mapa.' },
  { id:'catalog', name:'Catálogo', icon:'☷', intro:'Organiza e pesquisa telas, componentes e outros objetos a partir da identidade e da classificação.' },
  { id:'database', name:'Banco', icon:'▤', intro:'Identifica os objetos relacionados a operações e persistência. A modelagem do banco virá de dados e operações.' },
  { id:'generator', name:'Gerador', icon:'⌘', intro:'Aproveita IDs, tipo, módulo e escopo para gerar arquivos React/Flutter; caminhos concretos terão um bloco próprio.' },
  { id:'audit', name:'Auditoria', icon:'✓', intro:'Confere IDs, compatibilidade, referências, documentação e cobertura dos blocos e motores.' }
];
const ENGINE_BY_ID = Object.fromEntries(ENGINES.map(x=>[x.id,x]));
const ALL_ENGINES = ENGINES.map(x=>x.id);
const KINDS = ['object','array','string','number','boolean','null'];
const KIND_LABEL = {object:'objeto',array:'lista',string:'texto',number:'número',boolean:'booleano',null:'nulo'};
let INIT_MODEL = null;
const FIELD_GUIDE = {
  'identidade.id': ['Identificador estável e único deste objeto.',{
    flow:'Cria/identifica o nó da tela e resolve referências de origem ou destino.',
    prototype:'Localiza qual tela deve ser renderizada ou aberta.',
    map:'Identifica o nó e relaciona eventos, telas e destinos.',
    catalog:'Chave única de cadastro e pesquisa do objeto.',
    database:'Relaciona operações/dados à tela de origem, quando aplicável.',
    generator:'Gera identificadores e resolve referências entre arquivos.',
    audit:'Verifica unicidade e integridade das referências.'}],
  'identidade.tipo': ['Distingue tela, componente, ação, estado e outros objetos.', Object.fromEntries(ALL_ENGINES.map(id=>[id,'Distingue o tipo de objeto antes de aplicar as regras próprias deste motor.']))],
  'identidade.namespace': ['Contexto lógico a que o objeto pertence.',{
    catalog:'Agrupa identidades pelo contexto advogado, cliente ou global.',generator:'Auxilia na organização lógica dos módulos e dos arquivos.',audit:'Detecta inconsistências de namespace e colisões.'}],
  'identidade.chave': ['Nome estável e curto dentro do namespace.',{
    catalog:'Exibe e pesquisa a chave curta no agrupamento.',generator:'Fornece nome base para símbolos/arquivos, conforme as regras definidas.',audit:'Verifica padronização e unicidade dentro do namespace.'}],
  'identidade.nome': ['Nome técnico legível para editores e desenvolvedores.',{
    catalog:'Mostra o nome legível nos itens do catálogo.',audit:'Exibe a identificação humana em relatórios.'}],
  'identidade.nomeExibicao': ['Título amigável do objeto.',{
    prototype:'Pode apresentar o título amigável quando a tela o especificar.',catalog:'Mostra o nome de exibição ao usuário do catálogo.'}],
  'identidade.descricao': ['Finalidade do objeto, sem regras de execução.',{
    catalog:'Explica a finalidade do item em sua ficha.',audit:'Acrescenta contexto para a revisão de completude.'}],
  'identidade.versao': ['Versão do contrato, independente do ID.',{
    catalog:'Mostra a versão registrada do objeto.',generator:'Permite validar compatibilidade com o modelo de entrada.',audit:'Rastreia mudanças e compatibilidade entre versões.'}],
  'identidade.aliasesLegados': ['IDs anteriores aceitos na migração, sem mudar o ID canônico.',{
    generator:'Pode traduzir IDs antigos na migração de arquivos.',audit:'Encontra referências legadas e conflitos de aliases.'}],
  'identidade.referenciasExternas': ['IDs usados por outros sistemas ou catálogos.',{
    generator:'Associa o objeto a referências externas quando configurado.',audit:'Valida rastreabilidade externa e possíveis referências órfãs.'}],
  'classificacao.dominio': ['Área de negócio do objeto.',{
    catalog:'Organiza a árvore por domínio de negócio.',map:'Agrupa nós por domínio, sem criar relações.',generator:'Auxilia na organização lógica por domínio.'}],
  'classificacao.moduloRef': ['Referência explícita ao módulo responsável.',{
    flow:'Opcionalmente agrupa nós do fluxo por módulo.',map:'Agrupa nós do mapa por módulo.',catalog:'Posiciona a tela no módulo advogado.',generator:'Orienta organização dos arquivos e namespaces.',audit:'Verifica se o módulo referenciado existe.'}],
  'classificacao.submoduloRef': ['Subdivisão opcional do módulo.',{
    catalog:'Aninha o item no submódulo quando informado.',generator:'Permite separar arquivos por submódulo.',audit:'Valida a referência ao submódulo.'}],
  'classificacao.secao': ['Seção funcional à qual o objeto pertence.',{
    catalog:'Agrupa páginas e componentes na seção home.',generator:'Pode organizar agrupamentos de arquivos dentro do módulo.'}],
  'classificacao.categoria': ['Categoria de catálogo, como tela_inicial.',{
    catalog:'Classifica e filtra telas por categoria.',map:'Permite filtros visuais por categoria.'}],
  'classificacao.escopo': ['Indica onde o objeto pode pertencer: global, módulo, tela ou instância.',{
    prototype:'Ajuda a resolver o alcance declarado de componentes reutilizados.',catalog:'Distingue elementos globais e locais na árvore.',generator:'Orienta onde declarar componentes compartilhados.',audit:'Confere referências incompatíveis com o escopo.'}],
  'classificacao.reutilizavel': ['Marca a intenção de reutilização, não autoriza acesso.',{
    prototype:'Identifica componentes destinados à reutilização.',catalog:'Permite filtrar elementos reutilizáveis.',generator:'Orienta a separação de componentes compartilhados.'}],
  'classificacao.publicoAlvo': ['Perfis associados ao objeto; não é regra de permissão.',{
    catalog:'Filtra o acervo por advogado, cliente e outros públicos.',map:'Permite agrupar ou filtrar nós por público relacionado.'}],
  'classificacao.tags': ['Etiquetas livres de busca e organização.',{
    catalog:'Facilita pesquisas e filtros por palavras-chave.',audit:'Apoia inventários e agrupamentos documentais.'}]
};

/* Leitura proposta por funcionalidade; a tradução já está no contrato V0.2. */
const V02_FIELD_RULES = [
  {test:/^schema(?:Version)?$/,description:'Identifica o formato e a versão do contrato da tela.',uses:{generator:'Seleciona o conversor compatível com o contrato.',audit:'Verifica o formato homologado.'}},
  {test:/^navegacao\.participacoes(?:\[|$)/,description:'Participação da tela em jornadas, incluindo ocorrências, sequência, ordem e cadeia de bifurcações.',uses:{flow:'Precisa reconstruir onde cada ocorrência aparece, em qual sequência e por quais caminhos; o ID da tela não se confunde com o ID da ocorrência.',catalog:'Relaciona a tela às jornadas de que participa.'}},
  {test:/^navegacao\.bifurcacoes(?:\[|$)/,description:'Bifurcação editorial com identidade própria, posição e caminhos, inclusive caminhos sem telas.',uses:{flow:'Precisa construir e editar bifurcações, selecionar caminhos, renderizar suas sequências e preservar ramos vazios.',audit:'Confere unicidade dos IDs de bifurcação, caminho e sequência.'}},
  {test:/^navegacao\.saidas(?:\[|$)/,description:'Relação de saída por ID, ação, destino, portas, condição, prioridade e fallback.',uses:{flow:'Precisa conectar telas pelas relações explícitas e identificar evento, destino, condição e porta sem inferir pelo rótulo.',prototype:'Resolve o destino da navegação simulada.',map:'Rastreia o efeito de navegação disparado por uma ação.'}},
  {test:/^navegacao\.entradas(?:\[|$)/,description:'Relação de entrada e seus espelhos derivados das saídas de outras telas.',uses:{flow:'Precisa mostrar de onde a tela é alcançada, mantendo a relação de saída como fonte autoritativa.',map:'Relaciona origens e destinos de navegação.',audit:'Confere se entradas espelhadas correspondem às saídas existentes.'}},
  {test:/^navegacao\.referenciasEditoriaisExternas(?:\[|$)/,description:'IDs de bifurcações pertencentes a outros contratos de tela ou à raiz de jornada.',uses:{flow:'Precisa relacionar cada caminho à sua bifurcação proprietária sem criar nós por heurística.',audit:'Identifica dependências externas pendentes de resolução.'}},
  {test:/^navegacao\.rotaPrincipal(?:$|\.)/,description:'Rota canônica proposta para abrir a tela.',uses:{prototype:'Abre a tela pela rota declarada.',generator:'Projeta rotas para a tecnologia alvo.'}},
  {test:/^navegacao\.rotasLegadas(?:\[|$)/,description:'Rota real da implementação antiga, preservada para migração.',uses:{flow:'Pode resolver referências a rotas legadas na auditoria de navegação.',generator:'Normaliza caminhos de rota no destino.'}},
  {test:/^navegacao\.parametrosRota(?:\[|$)/,description:'Parâmetros esperados para entrar na tela.',uses:{flow:'Pode identificar o contexto necessário à transição.',prototype:'Prepara argumentos de navegação.'}},
  {test:/^estados\.(estadoInicialRef|estadoFallbackRef|criterioSelecao|itens)(?:\[|\.|$)/,description:'Estados, condições, prioridades e referências de variantes.',uses:{flow:'Precisa mostrar e avaliar condições que habilitam caminhos e ações, quando o contrato as declara.',prototype:'Seleciona o estado visual e comportamental ativo.',audit:'Valida estados e condições declarados.'}},
  {test:/^acoes\.itens(?:\[|$)/,description:'Ação identificada com tipo, pré-condições e efeitos.',uses:{flow:'Precisa saber qual ação origina uma relação e para onde ela leva; não deduz ação a partir do texto.',prototype:'Executa o efeito da interação no protótipo.',map:'Relaciona evento, ação, operação e efeito.'}},
  {test:/^interacoes\.itens(?:\[|$)/,description:'Vínculo entre elemento ou evento de origem e ação, inclusive marcação de mapeamento pendente.',uses:{flow:'Precisa reconhecer o disparo que conduz à ação; vínculo legado não confirmado continua explicitamente pendente.',prototype:'Liga componentes renderizados às ações.',map:'Identifica evento originador para rastreabilidade.'}},
  {test:/^componentes\.instancias(?:\[|$)/,description:'Instância de componente com referência, props, slot, ordem e arquivos do template.',uses:{flow:'Precisa compor a prévia de tela por referências visuais, usando slot e ordem declarados.',prototype:'Renderiza os componentes da tela.',catalog:'Relaciona instâncias a componentes reutilizáveis.',generator:'Resolve implementações e imports de componentes.'}},
  {test:/^estrutura\.montagem(?:\[|\.|$)/,description:'Montagem da prévia em slots, com referências explícitas às instâncias e seu preset.',uses:{flow:'Precisa apresentar a tela nos slots corretos ao abrir a prévia, sem inventar a hierarquia.',prototype:'Monta as regiões do layout.'}},
  {test:/^estrutura\.raiz(?:\[|\.|$)/,description:'Árvore de elementos da interface final, distinta da árvore editorial do Flow.',uses:{prototype:'Constrói hierarquia e elementos da tela.',generator:'Projeta a estrutura de componentes na stack escolhida.'}},
  {test:/^estilos\.(fontesCss|temaOrigemFlowV2|layoutOrigemFlowV2)(?:\[|\.|$)/,description:'CSS, tema e medidas observados no wireframe original.',uses:{flow:'Precisa reproduzir a aparência da prévia segundo os estilos declarados.',prototype:'Aplica aparência e regras responsivas.',generator:'Converte configurações visuais para a tecnologia de destino.'}},
  {test:/^estilos\.(temaRef|tokensLocais|regras)(?:\[|\.|$)/,description:'Tema, tokens e regras da apresentação final.',uses:{prototype:'Aplica aparência declarada aos elementos.',generator:'Converte tokens e regras para a tecnologia de destino.'}},
  {test:/^variantes\.itens(?:\[|$)/,description:'Diferenças de apresentação condicionadas a estados.',uses:{flow:'Pode sinalizar qual apresentação corresponde ao estado da ramificação.',prototype:'Aplica diferenças visuais da tela ativa.'}},
  {test:/^dados\.(campos|fontes|operacoes|vinculos)(?:\[|$)/,description:'Contexto e operações que fornecem valores para condições e apresentação.',uses:{flow:'Precisa conhecer dados referenciados por condições de estado ou ação, sem executar banco de dados.',prototype:'Alimenta apresentação e simulação de ações.',map:'Rastreia fonte e operação do dado.',database:'Contrata campos e operações pertinentes à tela.'}},
  {test:/^mocks\.(cenarioPadraoRef|cenarios)(?:\[|\.|$)/,description:'Cenários simulados para estados e prévia, sem implicar dados reais.',uses:{prototype:'Executa cenários simulados de estado e apresentação.',audit:'Verifica cobertura de cenários e fallback.'}},
  {test:/^localizacao\.(?:caminhoLogico|arquivoContrato|implementacoes|origensLegadas)(?:\[|\.|$)/,description:'Caminhos lógicos, alvos React/Flutter e origem histórica dos arquivos.',uses:{catalog:'Organiza recursos na árvore lógica.',generator:'Gera ou resolve caminhos de implementação.',audit:'Rastreia localizações e aliases antigos.'}}
];
function guideFor(path){
  if(FIELD_GUIDE[path])return FIELD_GUIDE[path];
  const entry=V02_FIELD_RULES.find(r=>r.test.test(path));
  return entry?[entry.description,entry.uses]:null;
}

const FLOW_REQUIREMENTS_V02 = [
  {id:'flow.identificar_nos',name:'Identificar e apresentar nós',goal:'Mostrar cada tela por identidade estável, nome e classificação, independentemente de quantas vezes aparece.',fields:['identidade.id','identidade.tipo','identidade.nomeExibicao','classificacao.moduloRef','classificacao.secao'],notes:'Não confundir a identidade da tela com a identidade de uma ocorrência.'},
  {id:'flow.montar_jornadas',name:'Montar jornadas e sequências',goal:'Organizar ocorrências pela jornada, sequência, ordem e percurso hierárquico declarados.',fields:['navegacao.participacoes[].jornadaRef','navegacao.participacoes[].ocorrencias[].id','navegacao.participacoes[].ocorrencias[].sequenciaRef','navegacao.participacoes[].ocorrencias[].ordem'],notes:'A jornada é referência explícita; o motor não a deduz do namespace.'},
  {id:'flow.bifurcacoes',name:'Criar e apresentar bifurcações',goal:'Representar bifurcações com identidade, título, posição e caminhos aninhados.',fields:['navegacao.bifurcacoes[].id','navegacao.bifurcacoes[].titulo','navegacao.bifurcacoes[].aposOcorrenciaRef','navegacao.bifurcacoes[].bifurcacaoPaiRef','navegacao.bifurcacoes[].caminhos[]'],notes:'Bifurcação editorial não representa automaticamente uma decisão condicional.'},
  {id:'flow.caminhos',name:'Selecionar e editar caminhos',goal:'Exibir caminhos como alternativas identificadas e permitir renomeação, adição e remoção sem perder caminhos vazios.',fields:['navegacao.bifurcacoes[].caminhos[].id','navegacao.bifurcacoes[].caminhos[].rotulo','navegacao.bifurcacoes[].caminhos[].sequenciaRef'],notes:'Cada bifurcação mantém no mínimo dois caminhos.'},
  {id:'flow.mover_ocorrencias',name:'Mover e reordenar telas',goal:'Mover uma ocorrência entre sequências e caminhos sem alterar a identidade da tela.',fields:['navegacao.participacoes[].ocorrencias[].id','navegacao.participacoes[].ocorrencias[].sequenciaRef','navegacao.participacoes[].ocorrencias[].ordem','navegacao.participacoes[].ocorrencias[].caminhoHierarquico[]'],notes:'A atualização da árvore editorial não deve inventar conexões funcionais.'},
  {id:'flow.relacionar_telas',name:'Relacionar origens, destinos e portas',goal:'Construir conexões a partir dos IDs das relações, telas, portas e destinos já declarados.',fields:['navegacao.saidas[].id','navegacao.saidas[].destinoRef','navegacao.saidas[].portaOrigemRef','navegacao.saidas[].portaDestinoRef','navegacao.entradas[].id'],notes:'Saída da origem é autoritativa; entrada do destino é espelho identificável.'},
  {id:'flow.disparar_acoes',name:'Exibir eventos, ações e efeitos',goal:'Relacionar evento de origem, ação, pré-condições e efeitos sem inferir semântica do texto do botão.',fields:['interacoes.itens[].evento','interacoes.itens[].acaoRef','acoes.itens[].id','acoes.itens[].precondicoes','acoes.itens[].efeitos','navegacao.saidas[].acaoRef'],notes:'legacy-event não prova o elemento real: registrar vínculo pendente até auditoria.'},
  {id:'flow.condicoes_estados',name:'Explicar caminhos condicionais',goal:'Associar bifurcações e saídas às condições e estados declarados, respeitando prioridades e fallback.',fields:['estados.itens[].id','estados.itens[].quando','navegacao.saidas[].quando','navegacao.saidas[].prioridade','navegacao.saidas[].fallback'],notes:'Condições de OAB ainda exigem validação de regras de acesso.'},
  {id:'flow.preview_telas',name:'Pré-visualizar telas',goal:'Montar a apresentação da tela com slots, componentes, templates e ordem explícita.',fields:['estrutura.montagem.slots[]','componentes.instancias[].componenteRef','componentes.instancias[].slot','componentes.instancias[].ordem','componentes.instancias[].baseTemplate','componentes.instancias[].props'],notes:'Prévia é visualização da tela; o canvas de Flow é a árvore editorial de navegação.'},
  {id:'flow.estilizar_previa',name:'Aplicar tema e layout da prévia',goal:'Reproduzir estilos, tema e composição responsiva identificados na implementação de origem.',fields:['estilos.fontesCss','estilos.temaOrigemFlowV2','estilos.layoutOrigemFlowV2'],notes:'O contrato preserva a referência e o gerador poderá convertê-la para Flutter/React.'},
  {id:'flow.validar_integridade',name:'Validar a estrutura antes de apresentar',goal:'Verificar unicidade de IDs, referências a caminhos e ações, e compatibilidade de saídas e entradas.',fields:['identidade.id','navegacao.participacoes','navegacao.bifurcacoes','navegacao.saidas','navegacao.entradas','componentes.instancias','estrutura.montagem'],notes:'Referências externas devem ser declaradas, nunca reconstruídas por heurística.'}
];

let serial = 0;
function uid(){ serial += 1; return 'n_' + Date.now().toString(36) + '_' + serial.toString(36); }
function kindOf(v){ return v===null?'null':Array.isArray(v)?'array':typeof v==='object'?'object':typeof v; }
function makeNode(key,value){
  const kind=kindOf(value);
  const n={uid:uid(),key:String(key),kind};
  if(kind==='object')n.children=Object.entries(value).map(([k,v])=>makeNode(k,v));
  else if(kind==='array')n.children=value.map((v,i)=>makeNode(String(i),v));
  else n.value=value;
  return n;
}
function toValue(node){
  if(node.kind==='object')return Object.fromEntries((node.children||[]).map(c=>[c.key,toValue(c)]));
  if(node.kind==='array')return (node.children||[]).map(toValue);
  return node.kind==='null'?null:node.value;
}
function makeProject(){
  const tree=Object.entries(INIT_MODEL).map(([k,v])=>makeNode(k,v));
  const p={format:'advogadoja.contrato-vivo.projeto',formatVersion:3,templateVersion:2,screen:'advogado.home',tree,meta:{},sources:[],modules:{flow:{audits:[],functions:FLOW_REQUIREMENTS_V02.map(f=>({internalId:uid(),...structuredClone(f)})),links:{},definition:'Flow V0.2: apresentar nós, jornadas, ocorrências, bifurcações, caminhos, relações e prévias usando os IDs, condições, slots e ordem declarados no JSON de tela. O módulo não deduz ações, estados nem relações a partir de nomes; as referências externas são explícitas. Regras de negócio pendentes não são consideradas confirmadas.'}},createdAt:new Date().toISOString()};
  walkTree(tree,({node,path})=>{
    const cfg=guideFor(path);
    if(cfg)p.meta[node.uid]={description:cfg[0],uses:structuredClone(cfg[1])};
    else p.meta[node.uid]={description:'',uses:{}};
  });
  return p;
}
function upgradeTemplateV02(){
  /* Mescla inclusões de forma aditiva: IDs e valores locais existentes têm prioridade. */
  const template=makeProject();
  const merge=(dest,incoming)=>{
    if(dest.kind==='object'&&incoming.kind==='object'){
      for(const child of incoming.children){
        const existing=dest.children.find(x=>x.key===child.key);
        if(existing)merge(existing,child);else dest.children.push(child);
      }
    }else if(dest.kind==='array'&&incoming.kind==='array'){
      for(const child of incoming.children){
        const val=toValue(child),ref=val&&typeof val==='object'&&!Array.isArray(val)?val.id:null;
        const existing=ref?dest.children.find(x=>toValue(x)?.id===ref):dest.children.find(x=>JSON.stringify(toValue(x))===JSON.stringify(val));
        if(existing)merge(existing,child);else dest.children.push(child);
      }
      dest.children.forEach((x,i)=>x.key=String(i));
    }
  };
  for(const section of template.tree){
    const current=project.tree.find(x=>x.key===section.key);
    if(current)merge(current,section);else project.tree.push(section);
  }
  if(!project.meta||typeof project.meta!=='object')project.meta={};
  walkTree(project.tree,({node,path})=>{
    const cfg=guideFor(path);
    if(!project.meta[node.uid])project.meta[node.uid]={description:cfg?.[0]||'',uses:cfg?structuredClone(cfg[1]):{}};
  });
  ensureModuleData();
  const flow=project.modules.flow;
  for(const example of FLOW_REQUIREMENTS_V02){
    if(!flow.functions.some(x=>x.id===example.id))flow.functions.push({internalId:uid(),...structuredClone(example)});
  }
  if(!flow.definition.trim())flow.definition=template.modules.flow.definition;
  project.formatVersion=3;project.templateVersion=2;
}
function ensureModuleData(){
  if(!project.modules||typeof project.modules!=='object')project.modules={};
  ENGINES.forEach(e=>{
    if(!project.modules[e.id]||typeof project.modules[e.id]!=='object')project.modules[e.id]={};
    const data=project.modules[e.id];
    if(!Array.isArray(data.audits))data.audits=[];
    if(!Array.isArray(data.functions))data.functions=[];
    if(!data.links||typeof data.links!=='object')data.links={};
    if(typeof data.definition!=='string')data.definition='';
  });
}
function walkTree(nodes,fn,parent=null,prefix=''){
  nodes.forEach((node,index)=>{
    const name=parent?.kind==='array'?`[${index}]`:node.key;
    const path=prefix?(name.startsWith('[')?prefix+name:prefix+'.'+name):name;
    fn({node,parent,index,path});
    if(node.children)walkTree(node.children,fn,node,path);
  });
}
function findNode(id){let found=null;walkTree(project.tree,x=>{if(x.node.uid===id)found=x;});return found;}
function findPath(path){let found=null;walkTree(project.tree,x=>{if(x.path===path)found=x;});return found;}
function countFields(){let n=0;walkTree(project.tree,x=>{if(x.parent?.kind==='object')n++;});return n;}
function leafCount(){let n=0;walkTree(project.tree,x=>{if(!x.node.children)n++;});return n;}
function countUsed(engine){let n=0;walkTree(project.tree,x=>{if(x.parent?.kind==='object'&&meta(x.node).uses[engine])n++;});return n;}
function meta(n){if(!project.meta[n.uid])project.meta[n.uid]={description:'',uses:{}};return project.meta[n.uid];}
function hasDirectUse(n,engine){return Boolean(meta(n).uses[engine]);}
function anyDescendantUsed(n,engine){return Boolean(n.children?.some(c=>hasDirectUse(c,engine)||anyDescendantUsed(c,engine)));}
function inheritedUse(found,engine){
  let cursor=found.parent;
  while(cursor){
    if(hasDirectUse(cursor,engine))return cursor;
    cursor=findNode(cursor.uid)?.parent||null;
  }
  return null;
}
function firstUsed(engine){let uidFound=null;walkTree(project.tree,({node})=>{if(!uidFound&&hasDirectUse(node,engine))uidFound=node.uid;});return uidFound;}
function getParentArray(found){return found.parent?found.parent.children:project.tree;}
function formatMini(v){
  const str=JSON.stringify(v);
  return str.length>50?str.slice(0,47)+'…':str;
}
function validKey(k){return /^[^\u0000-\u001f]+$/.test(k)&&k.length<121&&!['__proto__','prototype','constructor'].includes(k);}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function safeJson(v){return JSON.stringify(v,null,2);}
function getEl(id){return document.getElementById(id);}

let project = null;
let mode='master',subview='overview',selectedUid=null;
let expanded=new Set();
let history=[],sourceIndex=-1,sourceSelection=null,searchTerm='',toastTimer=null,editingFunctionId=null;
function initializeProject(){
  try{
    const loaded=JSON.parse(localStorage.getItem(APP_KEY)||'null');
    if(loaded&&loaded.format==='advogadoja.contrato-vivo.projeto'&&Array.isArray(loaded.tree)&&loaded.meta&&Array.isArray(loaded.sources))project=loaded;
    else project=makeProject();
  }catch(err){project=makeProject();}
  ensureModuleData();
  if((project.templateVersion||0)<2)upgradeTemplateV02();
  mode='master'; subview='overview';
  selectedUid=findPath('identidade.id')?.node.uid||project.tree[0]?.uid||null;
  expanded=new Set(project.tree.map(x=>x.uid));
}

function moduleData(id=mode){return project.modules[id];}

function checkpoint(){history.push(JSON.stringify(project));if(history.length>40)history.shift();}
function save(){
  try{localStorage.setItem(APP_KEY,JSON.stringify(project));getEl('saveIndicator').textContent='✓ Salvo neste navegador';}
  catch(err){getEl('saveIndicator').textContent='⚠ Armazenamento indisponível';toast('O navegador não conseguiu salvar. Exporte o projeto para não perder as alterações.');}
}
function changed(message){save();renderAll();if(message)toast(message);}
function toast(msg){const el=getEl('toast');el.textContent=msg;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),4200);}
function download(name,content){
  const url=URL.createObjectURL(new Blob([content],{type:'application/json;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
}
function exportModel(){download('documento.json',safeJson(Object.fromEntries(project.tree.map(n=>[n.key,toValue(n)]))));}
function exportProject(){download('advogado_home_projeto_contrato_vivo.json',safeJson(project));}
function exportUsages(){
  const fields=[];
  walkTree(project.tree,({node,path})=>{const m=meta(node);fields.push({fieldId:node.uid,path,type:node.kind,description:m.description||'',usedBy:m.uses||{}});});
  download('advogado_home_mapa_consumo_motores.json',safeJson({screen:project.screen,version:1,engines:ENGINES.map(({id,name})=>({id,name})),fields}));
}
function showMode(m){
  mode=m;subview='overview';
  if(mode!=='master'&&selectedUid){const chosen=findNode(selectedUid)?.node;if(!chosen||(!hasDirectUse(chosen,mode)&&!anyDescendantUsed(chosen,mode)))selectedUid=firstUsed(mode);}
  renderAll();
}
function showSubview(s){subview=s;renderAll();}
function renderAll(){
  ensureModuleData();renderTabs();renderSidebar();renderMetrics();renderFlowSummary();
  const showTree=mode==='master'||subview==='overview';
  getEl('workspaceGrid').hidden=!showTree;getEl('moduleContent').hidden=showTree;
  if(showTree){renderTree();renderDetails();}else renderModuleContent();
  getEl('undoBtn').disabled=!history.length;
}
function renderFlowSummary(){
  const box=getEl('flowReadSummary');box.hidden=mode!=='flow'||subview!=='overview';if(box.hidden)return;
  const navigation=toValue(findPath('navegacao')?.node||{kind:'object',children:[]});
  const components=toValue(findPath('componentes')?.node||{kind:'object',children:[]});
  const occurrences=(navigation.participacoes||[]).reduce((sum,p)=>sum+(p.ocorrencias?.length||0),0);
  const branches=navigation.bifurcacoes||[];
  const paths=branches.reduce((sum,b)=>sum+(b.caminhos?.length||0),0);
  const relations=(navigation.saidas||[]).filter(s=>s.origem==='flow_v2_relations_outbound').length;
  const visuals=(components.instancias||[]).filter(c=>String(c.origem||'').startsWith('flow_v2_fragment')).length;
  const counts=[[occurrences,'ocorrências'],[branches.length,'bifurcações'],[paths,'caminhos'],[relations,'saídas do Flow V2'],[visuals,'fragmentos visuais']];
  getEl('flowReadNumbers').innerHTML=counts.map(([n,label])=>`<span><strong>${n}</strong> ${label}</span>`).join('');
}
function focusFlowField(path){
  const found=findPath(path);if(!found){toast('O campo foi removido ou renomeado neste projeto.');return;}
  searchTerm='';getEl('treeSearch').value='';selectedUid=found.node.uid;
  let parent=found.parent;while(parent){expanded.add(parent.uid);parent=findNode(parent.uid)?.parent||null;}
  if(found.node.children)expanded.add(found.node.uid);
  mode='flow';subview='overview';renderAll();getEl('modelTree').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function renderTabs(){
  // Os módulos antigos não fazem parte deste pacote: sem menu de navegação inerte.
  const host=getEl('modeTabs');
  if(host){host.innerHTML='';host.hidden=true;}
}
function renderSidebar(){
  getEl('sectionsCount').textContent=project.tree.length;getEl('fieldsCount').textContent=countFields();
  const fieldIds=[];walkTree(project.tree,({node,parent})=>{if(parent?.kind==='object')fieldIds.push(node.uid);});
  const mapped=fieldIds.filter(id=>Object.keys(meta(findNode(id).node).uses).length).length;
  getEl('coverageCount').textContent=(fieldIds.length?Math.round(mapped/fieldIds.length*100):0)+'%';
  getEl('sourcesCount').textContent=project.sources.length;
  const host=getEl('sourceList');host.innerHTML='';
  project.sources.forEach((s,i)=>{
    const item=document.createElement('div');item.className='source-card';
    item.innerHTML=`<button class="source-open" title="Explorar e incorporar"><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.summary||'JSON importado')}</small></button><button class="source-remove" title="Remover fonte" aria-label="Remover fonte ${escapeHtml(s.name)}">×</button>`;
    item.querySelector('.source-open').onclick=()=>openSource(i);
    item.querySelector('.source-remove').onclick=()=>{if(!confirm('Remover esta fonte da lista? Os campos já incorporados ao modelo serão mantidos.'))return;checkpoint();project.sources.splice(i,1);changed('Fonte removida. Modelo mestre preservado.');};
    host.append(item);
  });
}
function renderMetrics(){
  const master=mode==='master';const e=ENGINE_BY_ID[mode];
  const special=!master&&subview!=='overview';
  const detail=special?{
    functions:['Funcionalidades desejadas','Defina o que o módulo precisa fazer, antes de decidir como o motor será implementado.',moduleData().functions.length,'funcionalidades definidas'],
    compare:['Comparação entre auditorias','Compare campos lidos, nomes equivalentes e operações das implementações importadas.',moduleData().audits.length,'auditorias disponíveis'],
    definition:['Definição consolidada','Registre suas decisões, com base nas funcionalidades desejadas e nas evidências.',moduleData().functions.length,'funcionalidades desejadas'],
    template:['Modelo de auditoria para IA','Exporte o padrão, envie à IA com uma implementação existente e importe sua análise.',moduleData().audits.length,'análises já importadas']
  }[subview]||['Auditoria importada','Investigação da implementação original; nenhuma decisão é aplicada automaticamente.',moduleData().audits.length,'fontes deste módulo']:null;
  getEl('modeEyebrow').textContent=master?'CONTRATO MESTRE':'MÓDULO / '+e.name.toUpperCase();
  getEl('modeTitle').textContent=master?'Home Advogado · contrato V0.2':special?detail[0]:e.name+' · campos necessários';
  getEl('modeDescription').textContent=master?'Base completa com 15 seções: selecione cada campo e defina de que funcionalidades os módulos precisam.':special?detail[1]:e.intro;
  getEl('modeCount').textContent=master?countFields():special?detail[2]:countUsed(mode);
  getEl('modeCountLabel').textContent=master?'campos no contrato':special?detail[3]:'campos necessários para '+e.name;
  getEl('treeHeading').textContent=master?'Modelo mestre':'Campos vistos pelo '+e.name;
  getEl('treeChip').textContent=master?'Editável':'Somente leitura';
  getEl('treeGuide').hidden=master;
  getEl('addSectionBtn').hidden=!master;getEl('addFieldBtn').hidden=!master;
  getEl('treeFootHint').textContent=master?'Selecione um campo para editar.':'Cinza = não necessário nesta visão.';
  getEl('detailHeading').textContent=master?'Editor e necessidades':'O que '+e.name+' precisa ler';
  getEl('detailChip').textContent=master?'Contrato único':'Leitura do motor';
}
function showNodeTree(nodes,host,parent=null,prefix='',inherited=false,parentMatched=false){
  const ul=document.createElement('ul');ul.className='tree-list'+(parent?' nested':'');
  let shown=0;
  nodes.forEach((node,index)=>{
    const label=parent?.kind==='array'?`[${index}]`:node.key;
    const path=prefix?(label.startsWith('[')?prefix+label:prefix+'.'+label):label;
    const thisMatch=searchTerm&&(label.toLowerCase().includes(searchTerm)||path.toLowerCase().includes(searchTerm));
    const childMatch=searchTerm&&node.children?.some(c=>matchSubtree(c,searchTerm));
    if(searchTerm&&!parentMatched&&!thisMatch&&!childMatch)return;
    shown++;
    const direct=mode==='master'||hasDirectUse(node,mode)||inherited;
    const childUsed=mode!=='master'&&anyDescendantUsed(node,mode);
    const canSelect=direct||childUsed;
    const state=mode==='master'?'model':direct?'used':childUsed?'contextual':'inactive';
    const li=document.createElement('li');
    const row=document.createElement('div');row.className='tree-row '+state+(selectedUid===node.uid?' selected':'');
    const expander=document.createElement('button');expander.className='tree-expander'+(!node.children?.length?' blank':'');expander.type='button';expander.textContent=expanded.has(node.uid)||searchTerm?'⌄':'›';
    expander.title='Expandir / recolher';expander.disabled=!node.children?.length;
    expander.addEventListener('click',()=>{if(expanded.has(node.uid))expanded.delete(node.uid);else expanded.add(node.uid);renderTree();});
    const btn=document.createElement('button');btn.type='button';btn.className='tree-node-button';btn.disabled=!canSelect;btn.setAttribute('role','treeitem');btn.setAttribute('aria-selected',String(selectedUid===node.uid));
    const ico=node.kind==='object'?'▧':node.kind==='array'?'▤':node.kind==='boolean'?'◉':node.kind==='null'?'○':'•';
    btn.innerHTML=`<span class="state-dot"></span><span aria-hidden="true">${ico}</span><span class="tree-node-name" title="${escapeHtml(path)}">${escapeHtml(label)}</span><span class="tree-node-type">${KIND_LABEL[node.kind]}</span>${node.children?'':`<span class="tree-node-value" title="${escapeHtml(formatMini(toValue(node)))}">${escapeHtml(formatMini(toValue(node)))}</span>`}`;
    btn.onclick=()=>{selectedUid=node.uid;renderTree();renderDetails();};
    row.append(expander,btn);li.append(row);
    if(node.children?.length&&(expanded.has(node.uid)||searchTerm))showNodeTree(node.children,li,node,path,inherited||hasDirectUse(node,mode),Boolean(parentMatched||thisMatch));
    ul.append(li);
  });
  if(!shown&&!parent){host.innerHTML='<div class="tree-footer-empty">Nenhum campo encontrado.</div>';return;}
  host.append(ul);
}
function matchSubtree(n,q){return n.key.toLowerCase().includes(q)||Boolean(n.children?.some(c=>matchSubtree(c,q)));}
function renderTree(){const host=getEl('modelTree');host.innerHTML='';showNodeTree(project.tree,host);}

function renderDetails(){
  const host=getEl('detailContent');host.innerHTML='';
  const found=findNode(selectedUid);
  if(!found){host.innerHTML='<div class="empty-state">Selecione um campo para explorar seus dados e suas utilizações.</div>';return;}
  if(mode==='master')renderModelEditor(found,host);else renderEngineInspector(found,host);
}
function renderModelEditor(found,host){
  const {node,path,parent}=found;const m=meta(node);const selectableValue=node.kind!=='object'&&node.kind!=='array';
  const options=KINDS.map(k=>`<option value="${k}" ${k===node.kind?'selected':''}>${KIND_LABEL[k]}</option>`).join('');
  const canRename=parent?.kind!=='array';
  const position=getParentArray(found).findIndex(x=>x.uid===node.uid);
  const canUp=position>0,canDown=position<getParentArray(found).length-1;
  host.innerHTML=`
    <div class="detail-header"><div><div class="eyebrow">CAMPO SELECIONADO</div><h2>${escapeHtml(node.key)}</h2></div><span class="kind-chip">${KIND_LABEL[node.kind]}</span></div>
    <code class="detail-path">${escapeHtml(path)}</code><div class="detail-id">Identidade interna estável: ${escapeHtml(node.uid)}</div>
    <div class="detail-section-title">Editar estrutura</div>
    <div class="detail-form"><div class="form-row"><label>Nome do campo<input id="editKey" value="${escapeHtml(node.key)}" ${canRename?'':'disabled'}></label><label>Tipo<select id="editKind">${options}</select></label></div>
    <label>Descrição do campo<textarea id="editDesc" rows="2" placeholder="Explique por que este campo existe...">${escapeHtml(m.description||'')}</textarea></label>
    ${selectableValue?`<label>Valor (JSON válido)<textarea id="editValue" rows="3" spellcheck="false">${escapeHtml(safeJson(toValue(node)))}</textarea></label>`:'<div class="usage-banner no">Este bloco possui filhos. Edite ou adicione campos diretamente na árvore.</div>'}
    <div class="edit-actions"><button class="btn btn-primary" id="saveFieldBtn">Salvar alterações</button><button class="btn btn-ghost" id="moveUpBtn" ${canUp?'':'disabled'} title="Mover para cima">↑</button><button class="btn btn-ghost" id="moveDownBtn" ${canDown?'':'disabled'} title="Mover para baixo">↓</button><button class="btn btn-danger-lite push-right" id="deleteFieldBtn">Excluir</button></div>
    </div><div class="detail-divider"></div><div class="detail-section-title">Qual módulo precisa deste campo?</div>
    <p class="detail-summary">Marque o módulo e registre qual funcionalidade exige essa informação. As abas mostram essa necessidade automaticamente.</p><div class="usage-list" id="usageList"></div>`;
  getEl('saveFieldBtn').onclick=()=>saveField();
  getEl('moveUpBtn').onclick=()=>moveField(-1);
  getEl('moveDownBtn').onclick=()=>moveField(1);
  getEl('deleteFieldBtn').onclick=deleteField;
  renderUsageList(node);
}
function renderUsageList(node){
  const host=getEl('usageList');host.innerHTML='';const m=meta(node);
  ENGINES.forEach(e=>{
    const on=Boolean(m.uses[e.id]);
    const entry=document.createElement('div');entry.className='usage-entry'+(on?' active':'');
    entry.innerHTML=`<div class="usage-entry-top"><input type="checkbox" id="use_${e.id}" ${on?'checked':''} aria-label="${escapeHtml(e.name)} precisa deste campo"><label for="use_${e.id}"><strong>${escapeHtml(e.name)}</strong></label><small>${on?'NECESSÁRIO':'NÃO MARCADO'}</small></div>${on?`<textarea id="reason_${e.id}" placeholder="Qual funcionalidade precisa deste campo e por quê?">${escapeHtml(m.uses[e.id])}</textarea>`:''}`;
    const checkbox=entry.querySelector('input');
    checkbox.onchange=()=>{checkpoint();if(checkbox.checked)m.uses[e.id]=m.uses[e.id]||'Utilização a definir.';else delete m.uses[e.id];save();renderTabs();renderSidebar();renderTree();renderUsageList(node);};
    const reason=entry.querySelector('textarea');
    if(reason)reason.onchange=()=>{checkpoint();m.uses[e.id]=reason.value.trim()||'Utilização a definir.';save();toast('Finalidade salva para '+e.name+'.');};
    host.append(entry);
  });
}
function renderEngineInspector(found,host){
  const {node,path}=found;const direct=hasDirectUse(node,mode),desc=anyDescendantUsed(node,mode),ancestor=inheritedUse(found,mode);
  const e=ENGINE_BY_ID[mode];
  if(!direct&&!desc&&!ancestor){host.innerHTML='<div class="empty-state">Este campo não está marcado como necessário para este módulo. Selecione um campo em destaque na árvore.</div>';return;}
  const description=meta(node).description||'Campo do contrato mestre.';
  let content=`<div class="detail-header"><div><div class="eyebrow">LEITURA POR MOTOR</div><h2>${escapeHtml(node.key)}</h2></div><span class="kind-chip">${KIND_LABEL[node.kind]}</span></div><code class="detail-path">${escapeHtml(path)}</code><div class="detail-id">ID estável: ${escapeHtml(node.uid)}</div><p class="detail-summary">${escapeHtml(description)}</p>`;
  if(direct)content+=`<div class="usage-banner">✓ <strong>${escapeHtml(e.name)} precisa deste campo.</strong></div><div class="detail-section-title">Qual funcionalidade precisa e por quê</div><div class="engine-reason">${escapeHtml(meta(node).uses[mode])}</div>`;
  else if(ancestor)content+=`<div class="usage-banner">↳ Este item faz parte de <strong>${escapeHtml(findNode(ancestor.uid)?.path||ancestor.key)}</strong>, necessário ao módulo.</div><div class="detail-section-title">Finalidade do bloco</div><div class="engine-reason">${escapeHtml(meta(ancestor).uses[mode])}</div>`;
  else content+=`<div class="usage-banner">↳ Este bloco contém campos necessários ao ${escapeHtml(e.name)}.</div><div class="detail-section-title">Campos necessários dentro deste bloco</div><ul class="child-hints">${getUsedChildren(node,mode).slice(0,25).map(x=>`<li><code>${escapeHtml(x)}</code></li>`).join('')}</ul>`;
  content+=`<div class="detail-divider"></div><div class="detail-section-title">Valor no JSON mestre</div><pre class="json-mini">${escapeHtml(safeJson(toValue(node)))}</pre><div class="detail-divider"></div><div class="detail-section-title">Outros módulos que precisam</div><div class="field-usage-chips">${ENGINES.map(en=>`<span class="usage-chip${(hasDirectUse(node,en.id)||inheritedUse(found,en.id))?'':' off'}">${escapeHtml(en.name)}</span>`).join('')}</div>`;
  host.innerHTML=content;
}
function getUsedChildren(root,engine){const paths=[];walkTree(root.children||[],({node,path})=>{if(hasDirectUse(node,engine))paths.push(path);});return paths;}

function saveField(){
  const found=findNode(selectedUid);if(!found)return;
  const {node,parent}=found;
  const key=getEl('editKey').value.trim();const kind=getEl('editKind').value;
  if(parent?.kind!=='array'&&(!validKey(key)||getParentArray(found).some(x=>x.uid!==node.uid&&x.key===key))){toast('Nome inválido, reservado ou duplicado neste nível.');return;}
  if(!KINDS.includes(kind)){toast('Tipo inválido.');return;}
  let value=null;
  if(kind!=='object'&&kind!=='array'){
    if(node.kind===kind&&getEl('editValue')){
      try{value=JSON.parse(getEl('editValue').value);}catch(err){toast('O valor precisa ser um JSON válido. Ex.: "texto", 123, true ou null.');return;}
      if(kindOf(value)!==kind){toast('O valor não corresponde ao tipo selecionado.');return;}
    }else value=kind==='string'?'':kind==='number'?0:kind==='boolean'?false:null;
  }
  if(node.kind!==kind&&node.children?.length&&!confirm('Mudar o tipo deste bloco excluirá seus filhos. Deseja continuar?'))return;
  checkpoint();node.key=parent?.kind==='array'?node.key:key;
  if(node.kind!==kind){removeDescendantMeta(node);node.kind=kind;delete node.value;delete node.children;if(kind==='object'||kind==='array')node.children=[];else node.value=value;}
  else if(kind!=='object'&&kind!=='array')node.value=value;
  meta(node).description=getEl('editDesc').value.trim();changed('Campo atualizado. Identidade interna preservada.');
}
function removeDescendantMeta(node){if(!node.children)return;walkTree(node.children,({node:child})=>delete project.meta[child.uid]);}
function moveField(offset){
  const f=findNode(selectedUid);if(!f)return;const arr=getParentArray(f),at=arr.indexOf(f.node),target=at+offset;
  if(target<0||target>=arr.length)return;checkpoint();[arr[at],arr[target]]=[arr[target],arr[at]];changed('Ordem atualizada sem alterar os IDs internos.');
}
function deleteField(){
  const f=findNode(selectedUid);if(!f)return;
  if(!confirm(`Excluir ${f.path}${f.node.children?.length?' e todos os seus filhos':''}? Os vínculos associados também serão removidos.`))return;
  checkpoint();removeDescendantMeta(f.node);delete project.meta[f.node.uid];getParentArray(f).splice(f.index,1);
  selectedUid=f.parent?.uid||project.tree[0]?.uid||null;changed('Campo excluído do contrato.');
}
function showAddDialog(section=false){
  if(mode!=='master')return;
  getEl('addDialogTitle').textContent=section?'Nova seção':'Novo campo';
  const select=getEl('addParent');select.innerHTML='<option value="root">Raiz do modelo</option>';
  walkTree(project.tree,({node,path})=>{
    if(node.kind!=='object'&&node.kind!=='array')return;
    const opt=document.createElement('option');opt.value=node.uid;opt.textContent=path+(node.kind==='array'?' [ ]':' { }');select.append(opt);
  });
  if(section){select.value='root';select.disabled=true;}
  else {const current=findNode(selectedUid)?.node;const parent=current?.children?current:findNode(selectedUid)?.parent;select.value=parent?.uid||'root';select.disabled=false;}
  getEl('addName').value='';getEl('addKind').value='object';getEl('addError').hidden=true;
  getEl('addDialog').showModal();getEl('addName').focus();
}
function addFieldSubmit(event){
  event.preventDefault();const parentId=getEl('addParent').value;const key=getEl('addName').value.trim(),kind=getEl('addKind').value;
  const parent=parentId==='root'?null:findNode(parentId)?.node;
  const arr=parent?parent.children:project.tree;
  if(!arr||!validKey(key)||(!parent||parent.kind==='object')&&arr.some(n=>n.key===key)){getEl('addError').textContent='Nome inválido ou duplicado neste nível.';getEl('addError').hidden=false;return;}
  const initial={object:{},array:[],string:'',number:0,boolean:false,null:null}[kind];
  if(!KINDS.includes(kind)){toast('Tipo desconhecido.');return;}
  checkpoint();const n=makeNode(parent?.kind==='array'?String(arr.length):key,initial);
  arr.push(n);project.meta[n.uid]={description:'',uses:{}};expanded.add(parent?.uid||n.uid);selectedUid=n.uid;
  getEl('addDialog').close();changed('Campo criado. Configure quais motores o utilizam.');
}

async function readSources(files){
  let count=0;
  for(const file of files){
    try{
      if(file.size>12*1024*1024)throw Error('Arquivo maior que 12 MB.');
      const raw=JSON.parse(await file.text());
      if(raw===null||typeof raw!=='object')throw Error('O JSON precisa ter um objeto ou uma lista na raiz.');
      checkpoint();project.sources.push({id:uid(),name:file.name,summary:(Array.isArray(raw)?raw.length:Object.keys(raw).length)+' itens na raiz',data:raw});count++;
    }catch(err){toast('Não foi possível importar '+file.name+': '+err.message);}
  }
  if(count){changed(count+' JSON(s) adicionados às fontes.');openSource(project.sources.length-1);}
}
async function readProject(file){
  try{
    const incoming=JSON.parse(await file.text());
    if(incoming.format!=='advogadoja.contrato-vivo.projeto'||!Array.isArray(incoming.tree)||!incoming.meta||!Array.isArray(incoming.sources))throw Error('Este arquivo não é um projeto do laboratório. Importe-o como fonte JSON.');
    if(!confirm('Abrir projeto salvo substitui o rascunho atual. Deseja continuar?'))return;
    checkpoint();project=incoming;ensureModuleData();mode='master';subview='overview';selectedUid=project.tree[0]?.uid||null;expanded=new Set(project.tree.map(n=>n.uid));changed('Projeto restaurado.');
  }catch(err){toast(err.message);}
}
function getSourceAtPath(obj,path){let cur=obj;for(const seg of path)cur=cur[seg];return cur;}
function openSource(index){
  sourceIndex=index;sourceSelection=null;
  const src=project.sources[index];if(!src)return;
  getEl('sourceDialogTitle').textContent=src.name;
  const tree=getEl('sourceTree');tree.innerHTML='';
  addSourceBranch(tree,'JSON completo',src.data,[],0);
  renderDestinations();selectSource([], 'JSON completo');getEl('sourceDialog').showModal();
}
function addSourceBranch(host,label,value,path,depth){
  const wrap=document.createElement('div');wrap.style.marginLeft=depth?Math.min(depth*11,150)+'px':'0';
  const row=document.createElement('button');row.type='button';row.className='source-tree-row';
  const branch=value!==null&&typeof value==='object';const count=branch?(Array.isArray(value)?value.length:Object.keys(value).length):0;
  row.textContent=(branch?'▸ ':'· ')+label+(branch?'  ('+count+')':'  '+formatMini(value));
  row.addEventListener('click',()=>{
    selectSource(path,label);
    if(branch){
      const next=wrap.querySelector(':scope > .source-children');
      if(next){next.remove();row.textContent='▸ '+label+'  ('+count+')';}
      else{const children=document.createElement('div');children.className='source-children';
        (Array.isArray(value)?value.map((v,i)=>[i,v]):Object.entries(value)).forEach(([k,v])=>addSourceBranch(children,String(k),v,[...path,k],depth+1));
        wrap.append(children);row.textContent='⌄ '+label+'  ('+count+')';
      }
    }
  });
  wrap.append(row);host.append(wrap);
}
function selectSource(path,label){
  const src=project.sources[sourceIndex];if(!src)return;
  const value=getSourceAtPath(src.data,path);
  sourceSelection={path,value};
  getEl('sourceSelectionTitle').textContent=label;
  getEl('sourceSelectionPath').textContent=path.length?path.join(' / '):'Raiz do arquivo';
  const preview=safeJson(value);getEl('sourcePreview').textContent=preview.length>2500?preview.slice(0,2500)+'\n… prévia limitada':preview;
  const leaf=path.length?String(path[path.length-1]):src.name.replace(/\.json$/i,'');
  getEl('sourceTargetKey').value=leaf.replace(/[^a-zA-Z0-9_\-À-ú]/g,'_').slice(0,120);
  getEl('sourceError').hidden=true;
}
function renderDestinations(){
  const select=getEl('sourceDestination');select.innerHTML='<option value="root">Raiz do modelo</option>';
  walkTree(project.tree,({node,path})=>{
    if(node.kind!=='object'&&node.kind!=='array')return;
    const opt=document.createElement('option');opt.value=node.uid;opt.textContent=path;select.append(opt);
  });
}
function mergeNode(dest,incoming){
  if(dest.kind==='object'&&incoming.kind==='object'){
    for(const child of incoming.children){const existing=dest.children.find(x=>x.key===child.key);
      if(existing)mergeNode(existing,child);else{dest.children.push(child);addMissingMeta(child);}}
  }else if(dest.kind==='array'&&incoming.kind==='array'){
    const known=new Set(dest.children.map(x=>JSON.stringify(toValue(x))));
    incoming.children.forEach(child=>{const raw=JSON.stringify(toValue(child));if(!known.has(raw)){dest.children.push(child);addMissingMeta(child);known.add(raw);}});
  }
}
function addMissingMeta(node){meta(node);if(node.children)node.children.forEach(addMissingMeta);}
function incorporateSource(){
  if(!sourceSelection)return;
  const parentId=getEl('sourceDestination').value,parent=parentId==='root'?null:findNode(parentId)?.node;
  const arr=parent?parent.children:project.tree;
  const key=getEl('sourceTargetKey').value.trim();const conflict=getEl('sourceConflict').value;
  const err=getEl('sourceError');
  if(!arr||!validKey(key)){err.textContent='Escolha um destino e um nome de campo válido.';err.hidden=false;return;}
  const existing=parent?.kind==='array'?null:arr.find(x=>x.key===key);
  if(existing&&conflict==='skip'){err.textContent='O campo já existe; nenhum dado foi alterado.';err.hidden=false;return;}
  if(existing&&conflict==='replace'&&!confirm('Substituir o bloco existente? Seus filhos e vínculos serão removidos.'))return;
  if(existing&&conflict==='merge'&&kindOf(sourceSelection.value)!==existing.kind){err.textContent='Não é possível mesclar tipos diferentes. Escolha não alterar ou substituir.';err.hidden=false;return;}
  checkpoint();const fresh=makeNode(key,sourceSelection.value);
  if(existing&&conflict==='merge'){mergeNode(existing,fresh);selectedUid=existing.uid;}
  else if(existing&&conflict==='replace'){removeDescendantMeta(existing);delete project.meta[existing.uid];arr[arr.indexOf(existing)]=fresh;addMissingMeta(fresh);selectedUid=fresh.uid;}
  else {arr.push(fresh);addMissingMeta(fresh);selectedUid=fresh.uid;}
  if(parent)expanded.add(parent.uid);
  getEl('sourceDialog').close();mode='master';changed('Bloco incorporado ao modelo. Configure seu consumo por motor.');
}

/* ── Laboratório de funcionalidades e auditorias por módulo ── */
const CATEGORIES_BY_MODULE={
  flow:['nos','relacoes','acoes','estados','jornadas','layout'],
  prototype:['renderizacao','componentes','estados','navegacao','interacoes'],
  map:['eventos','servicos','operacoes','relacoes','efeitos'],
  catalog:['arvore','classificacao','filtros','busca','componentes'],
  database:['entidades','campos','relacionamentos','consultas','persistencia'],
  generator:['arquivos','componentes','conversoes','imports','rotas'],
  audit:['validacoes','integridade','referencias','cobertura','relatorios']
};
function auditTemplate(moduleId=mode){
  return {
    formato:'advogadoja.auditoria-modulo.v1',modulo:moduleId,
    auditoria:{id:'',nome:'',origem:'',versao:'',arquivosAnalisados:[],resumo:'',limitesDaAnalise:''},
    funcionalidades:[{id:'',nome:'',objetivo:'',comportamentoObservado:'',passos:[],entradas:[],saidas:[],evidencias:[]}],
    leiturasTela:[{id:'',campoOriginal:'',tipoOriginal:'',origemDados:'tela',finalidade:'',comoLido:'',campoCanonicoSugerido:'',funcionalidadesRef:[],obrigatorio:null,condicoes:[],evidencia:'',confianca:'confirmado|inferido|nao_localizado'}],
    resolucoes:[{id:'',categoria:CATEGORIES_BY_MODULE[moduleId]?.join('|')||'outra',nome:'',comoResolve:'',passos:[],camposEntradaRef:[],saidas:[],regras:[],evidencias:[]}],
    representacaoTela:{comoAparece:'',estruturaObservada:'',componentes:[],estadosVisuais:[],observacoes:[]},
    lacunas:[],observacoes:[]
  };
}
function aiPrompt(moduleId=mode){
  const m=ENGINE_BY_ID[moduleId];
  return `TAREFA: Audite a implementação existente do módulo ${m.name} do AdvogadoJá.\n\n`+
    `Receba junto com este pedido: (1) o JSON padrão advogadoja.auditoria-modulo.v1 e (2) os arquivos, trechos de código, motores ou JSONs da implementação antiga.\n\n`+
    `OBJETIVO: Investigar como a implementação realmente funciona; identificar funcionalidades observadas, dados que ela lê da tela, como resolve operações e como representa a tela. A implementação antiga NÃO define automaticamente como o futuro módulo deverá ser.\n\n`+
    `REGRAS OBRIGATÓRIAS:\n`+
    `1. Devolva APENAS um JSON válido, seguindo exatamente as chaves e tipos do modelo fornecido. Mantenha formato="advogadoja.auditoria-modulo.v1" e modulo="${moduleId}".\n`+
    `2. Preencha auditoria.id, auditoria.nome, auditoria.origem e os arquivos analisados.\n`+
    `3. Registre cada funcionalidade encontrada e o comportamento REAL observado; não presuma uma funcionalidade só por existir uma intenção em comentários.\n`+
    `4. Para cada informação lida da tela, informe campoOriginal com o caminho EXATO na fonte, finalidade, tipoOriginal, comoLido, condições, funcionalidade relacionada e evidência verificável (arquivo/função/trecho).\n`+
    `5. Em resolucoes, detalhe como a implementação monta ${CATEGORIES_BY_MODULE[moduleId]?.join(', ')}; liste passos, entradas, regras e saídas.\n`+
    `6. Registre representacaoTela: como aparecem as telas, componentes e estados, mesmo que a implementação apenas exiba nós ou metadados.\n`+
    `7. Se dois nomes parecem ter a mesma finalidade, use campoCanonicoSugerido como HIPÓTESE, nunca como equivalência confirmada.\n`+
    `8. Não invente campos, chamadas, referências, comportamentos, condições ou evidências. Se não encontrar, deixe em branco e registre a lacuna.\n`+
    `9. Remova os exemplos vazios dos arrays caso não exista evidência. Para obrigatorio, use true, false ou null quando indeterminado. Para confianca, use apenas confirmado, inferido ou nao_localizado.\n`+
    `10. Não modifique o JSON padrão de TELA; este relatório descreve a IMPLEMENTAÇÃO do módulo.\n\n`+
    `RESULTADO: Um arquivo .json que eu possa importar no laboratório como uma sub-aba independente do módulo ${m.name}.`;
}
function downloadTemplate(){download(`modelo_auditoria_${mode}_para_ia.json`,safeJson(auditTemplate()));}
function downloadPrompt(){download(`prompt_auditoria_${mode}.txt`,aiPrompt());}
function moduleHeader(note,buttons=''){return `<div class="module-toolbar"><p>${escapeHtml(note)}</p><div class="module-actions">${buttons}</div></div>`;}
function asArray(v){return Array.isArray(v)?v:[];}
function strings(v){return Array.isArray(v)?v.map(x=>typeof x==='string'?x:safeJson(x)):v===null||v===undefined?[]:[typeof v==='string'?v:safeJson(v)];}
function smallList(v){const items=strings(v).filter(Boolean);return items.length?`<ul>${items.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`:'<span class="data-pill soft">Não informado</span>';}
function sectionCard(title,children,eyebrow=''){return `<section class="module-card"><div class="eyebrow">${escapeHtml(eyebrow)}</div><h3>${escapeHtml(title)}</h3>${children}</section>`;}
function sourceAuditName(a){return a.report.auditoria?.nome||a.fileName||'Auditoria';}
function renderModuleContent(){
  const host=getEl('moduleContent');host.innerHTML='';
  if(mode==='master'||subview==='overview')return;
  if(subview==='functions')renderFunctions(host);
  else if(subview==='compare')renderComparison(host);
  else if(subview==='definition')renderDefinition(host);
  else if(subview==='template')renderTemplate(host);
  else if(subview.startsWith('audit:'))renderAudit(host,subview.slice(6));
}
function renderFunctions(host){
  host.innerHTML=moduleHeader('Cadastre as funcionalidades desejadas para este módulo. Elas não precisam reproduzir as implementações antigas.',`<button class="btn btn-secondary" id="functionImportAudit">＋ Importar auditoria</button><button class="btn btn-primary" id="newFunctionBtn">＋ Funcionalidade</button>`);
  getEl('newFunctionBtn').onclick=()=>openFunctionDialog();
  getEl('functionImportAudit').onclick=()=>getEl('importAuditFile').click();
  const data=moduleData();
  if(!data.functions.length){const el=document.createElement('div');el.className='module-empty';el.innerHTML='<span class="empty-icon">☑</span><h3>O que este módulo precisa fazer?</h3><p>Comece registrando uma funcionalidade desejada. Depois, associe os campos necessários e use as auditorias antigas como evidência.</p><div class="module-actions"><button class="btn btn-primary" id="firstFunctionBtn">＋ Cadastrar a primeira</button></div>';host.append(el);getEl('firstFunctionBtn').onclick=()=>openFunctionDialog();return;}
  const wrap=document.createElement('div');wrap.className='module-grid';host.append(wrap);
  data.functions.forEach(fn=>{
    const card=document.createElement('section');card.className='module-card';
    card.innerHTML=`<div class="module-item-head"><div><div class="eyebrow">${escapeHtml(fn.id)}</div><h3>${escapeHtml(fn.name)}</h3></div><div class="module-item-actions"><button class="btn btn-ghost edit-function">Editar</button><button class="btn btn-danger-lite delete-function">Excluir</button></div></div><p>${escapeHtml(fn.goal)}</p><div class="detail-divider"></div><div class="detail-section-title">Dados necessários (hipóteses em discussão)</div><div class="module-inline">${fn.fields.length?fn.fields.map(f=>`<span class="data-pill">${escapeHtml(f)}</span>`).join(''):'<span class="data-pill soft">Ainda não definidos</span>'}</div>${fn.notes?`<div class="module-note" style="margin-top:14px">${escapeHtml(fn.notes)}</div>`:''}`;
    card.querySelector('.edit-function').onclick=()=>openFunctionDialog(fn.internalId);
    card.querySelector('.delete-function').onclick=()=>{if(!confirm('Excluir esta funcionalidade desejada? As auditorias importadas serão preservadas.'))return;checkpoint();data.functions=data.functions.filter(x=>x.internalId!==fn.internalId);changed('Funcionalidade removida.');};
    wrap.append(card);
  });
}
function openFunctionDialog(internalId=null){
  editingFunctionId=internalId;const data=moduleData();const fn=data.functions.find(x=>x.internalId===internalId);
  getEl('functionDialogTitle').textContent=fn?'Editar funcionalidade':'Nova funcionalidade';
  getEl('functionId').value=fn?.id||'';getEl('functionName').value=fn?.name||'';getEl('functionGoal').value=fn?.goal||'';
  getEl('functionFields').value=fn?.fields.join('\n')||'';getEl('functionNotes').value=fn?.notes||'';
  getEl('functionError').hidden=true;getEl('functionDialog').showModal();
}
function saveFunction(event){
  event.preventDefault();const data=moduleData();const id=getEl('functionId').value.trim(),name=getEl('functionName').value.trim(),goal=getEl('functionGoal').value.trim();
  const err=getEl('functionError');
  if(!id||!name||!goal||data.functions.some(f=>f.id===id&&f.internalId!==editingFunctionId)){err.hidden=false;err.textContent='Informe ID, nome e objetivo; o ID não pode se repetir neste módulo.';return;}
  checkpoint();let fn=data.functions.find(x=>x.internalId===editingFunctionId);
  if(!fn){fn={internalId:uid()};data.functions.push(fn);}
  Object.assign(fn,{id,name,goal,fields:getEl('functionFields').value.split('\n').map(x=>x.trim()).filter(Boolean),notes:getEl('functionNotes').value.trim()});
  getEl('functionDialog').close();changed('Funcionalidade desejada salva.');
}
function renderTemplate(host){
  const en=ENGINE_BY_ID[mode];const template=safeJson(auditTemplate());const prompt=aiPrompt();
  host.innerHTML=moduleHeader(`Use este mesmo formato com qualquer IA para analisar um ${en.name} antigo. Cada JSON preenchido poderá ser importado como uma sub-aba independente.`,`<button class="btn btn-primary" id="importAuditAction">↑ Importar análise da IA</button>`)+
    `<div class="module-grid"><section class="module-card"><div class="eyebrow">PASSO 1 / PADRÃO REUTILIZÁVEL</div><h3>Modelo JSON de auditoria</h3><p>Campos para funcionalidades observadas, leituras da tela, operações, representação visual e evidências. Adapte as categorias do módulo sem alterar as chaves principais.</p><button class="btn btn-secondary" id="downloadTemplateBtn">↓ Baixar modelo JSON</button><pre class="template-preview">${escapeHtml(template)}</pre></section><section class="module-card"><div class="eyebrow">PASSO 2 / INSTRUÇÃO À IA</div><h3>Pedido de análise</h3><p>Envie o JSON padrão, este pedido e os arquivos da implementação antiga à IA escolhida. Não é necessário integrar serviços de IA a este site.</p><div class="module-actions"><button class="btn btn-secondary" id="copyPromptBtn">⧉ Copiar prompt</button><button class="btn btn-ghost" id="downloadPromptBtn">↓ Baixar prompt</button></div><div class="ai-prompt">${escapeHtml(prompt)}</div></section></div>`+
    sectionCard('Como criar as sub-abas',`<ol class="ai-guide"><li>Baixe o modelo do módulo <strong>${escapeHtml(en.name)}</strong>.</li><li>Peça à IA que audite o código do Flow, Mapa ou módulo antigo, usando esse modelo.</li><li>Salve a resposta como arquivo <code>.json</code>.</li><li>Importe aqui. O resultado ganhará uma nova sub-aba, com origem e informações separadas.</li><li>Na aba <strong>Comparar</strong>, confirme manualmente equivalências de caminhos antes de consolidar.</li></ol>`,'PASSO 3 / INCORPORAR');
  getEl('importAuditAction').onclick=()=>getEl('importAuditFile').click();
  getEl('downloadTemplateBtn').onclick=downloadTemplate;
  getEl('copyPromptBtn').onclick=async()=>{try{await navigator.clipboard.writeText(prompt);toast('Prompt copiado.');}catch(e){const textEl=host.querySelector('.ai-prompt');const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(textEl);selection.removeAllRanges();selection.addRange(range);toast('Selecione e copie o texto destacado.');}};
  getEl('downloadPromptBtn').onclick=downloadPrompt;
}
async function readAuditFiles(files){
  let success=0,errors=[];
  for(const file of files){
    try{
      if(file.size>12*1024*1024)throw Error('Arquivo acima de 12 MB.');
      const raw=JSON.parse(await file.text());
      if(raw?.formato!=='advogadoja.auditoria-modulo.v1')throw Error('Formato não reconhecido. Utilize o modelo para IA.');
      if(!ENGINE_BY_ID[raw.modulo])throw Error('O campo modulo não corresponde a um módulo cadastrado.');
      if(!raw.auditoria||typeof raw.auditoria.nome!=='string'||!raw.auditoria.nome.trim())throw Error('Informe auditoria.nome.');
      if(!Array.isArray(raw.funcionalidades)||!Array.isArray(raw.leiturasTela)||!Array.isArray(raw.resolucoes))throw Error('funcionalidades, leiturasTela e resolucoes devem ser listas.');
      const data=moduleData(raw.modulo);checkpoint();
      const internalId=uid();data.audits.push({internalId,fileName:file.name,importedAt:new Date().toISOString(),report:raw});
      mode=raw.modulo;subview='audit:'+internalId;success++;
    }catch(err){errors.push(file.name+': '+err.message);}
  }
  if(success)changed(success+' auditoria(s) adicionada(s) como sub-abas independentes.');
  if(errors.length)toast('Importações não realizadas: '+errors.join(' | '));
}
function screenFields(){const fields=[];walkTree(project.tree,({node,path,parent})=>{if(parent?.kind==='object')fields.push(path);});return fields;}
function normalizePurpose(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,100);}
function getReadingKey(a,i,entry){return a.internalId+'::'+(entry.id||String(i));}
function renderComparison(host){
  const data=moduleData(),audits=data.audits;
  host.innerHTML=moduleHeader('Compare os caminhos originais e as finalidades descritas por cada implementação. As sugestões da IA não são confirmadas até você vincular um campo do modelo mestre.',`<button class="btn btn-primary" id="importCompareBtn">＋ Importar outra auditoria</button>`);
  getEl('importCompareBtn').onclick=()=>getEl('importAuditFile').click();
  if(!audits.length){host.insertAdjacentHTML('beforeend','<div class="module-empty"><span class="empty-icon">⇄</span><h3>Sem implementações para comparar</h3><p>Importe duas ou mais auditorias do mesmo módulo. Cada uma manterá seus caminhos originais, evidências e resoluções.</p></div>');return;}
  const rows=[];
  audits.forEach(a=>asArray(a.report.leiturasTela).forEach((r,i)=>{if(!r||typeof r!=='object')return;rows.push({audit:a,read:r,key:getReadingKey(a,i,r),index:i});}));
  const buckets=new Map();
  rows.forEach(x=>{const hint=x.read.campoCanonicoSugerido?.trim(),purpose=normalizePurpose(x.read.finalidade);
    const key=hint?'campo:'+normalizePurpose(hint):purpose?'proposito:'+purpose:'original:'+normalizePurpose(x.read.campoOriginal);
    if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(x);
  });
  const groups=[...buckets.values()].filter(g=>new Set(g.map(x=>x.audit.internalId)).size>1);
  host.insertAdjacentHTML('beforeend',`<div class="module-grid three"><div class="module-card"><div class="eyebrow">IMPLEMENTAÇÕES</div><h3>${audits.length} auditorias</h3><p>Importações mantidas separadamente.</p></div><div class="module-card"><div class="eyebrow">LEITURAS OBSERVADAS</div><h3>${rows.length} campos</h3><p>Caminhos declarados pelas análises.</p></div><div class="module-card"><div class="eyebrow">POSSÍVEIS EQUIVALÊNCIAS</div><h3>${groups.length} grupos</h3><p>Candidatos por finalidade/caminho sugerido, ainda não aprovados.</p></div></div>`);
  if(groups.length){
    let blocks='';
    groups.forEach((g,i)=>{blocks+=`<div class="module-list-item"><div class="module-item-head"><h4>Grupo candidato ${i+1}</h4><span class="data-pill warn">Requer revisão</span></div><div class="module-inline">${g.map(x=>`<span class="data-pill">${escapeHtml(sourceAuditName(x.audit))}: ${escapeHtml(x.read.campoOriginal||'sem caminho')}</span>`).join('')}</div><p>${escapeHtml(g[0].read.finalidade||'Possível equivalência de campo sugerido')}</p></div>`;});
    host.insertAdjacentHTML('beforeend',sectionCard('Possíveis nomes diferentes, mesma finalidade',`<p>São apenas candidatos detectados nas auditorias. Você decide se apontam para o mesmo campo canônico.</p><div class="module-list">${blocks}</div>`,'COMPARAÇÃO / NÃO AUTOMÁTICA'));
  }
  const fields=screenFields();
  const table=`<div class="compare-scroll"><table class="compare-table"><thead><tr><th>Implementação</th><th>Campo original</th><th>Para que serve</th><th>Sugestão da IA</th><th>Campo canônico aprovado</th></tr></thead><tbody>${rows.map(x=>{
    const chosen=data.links[x.key]||'';
    return `<tr><td><strong>${escapeHtml(sourceAuditName(x.audit))}</strong></td><td><code>${escapeHtml(x.read.campoOriginal||'—')}</code><div class="report-status">${escapeHtml(x.read.tipoOriginal||'')}</div></td><td>${escapeHtml(x.read.finalidade||'—')}</td><td><code>${escapeHtml(x.read.campoCanonicoSugerido||'—')}</code></td><td><select class="canonical-picker" data-key="${escapeHtml(x.key)}" aria-label="Associar campo canônico"><option value="">Pendente · sem vínculo</option>${fields.map(f=>`<option value="${escapeHtml(f)}" ${f===chosen?'selected':''}>${escapeHtml(f)}</option>`).join('')}</select>${chosen?'<span class="data-pill ok">Aprovado manualmente</span>':'<span class="data-pill warn">Não confirmado</span>'}</td></tr>`;
  }).join('')}</tbody></table></div>`;
  host.insertAdjacentHTML('beforeend',sectionCard('Relações entre as leituras e a árvore mestre',table,'MAPEAMENTO EXPLÍCITO'));
  host.querySelectorAll('.canonical-picker').forEach(select=>select.addEventListener('change',()=>{
    checkpoint();if(select.value)data.links[select.dataset.key]=select.value;else delete data.links[select.dataset.key];
    changed(select.value?'Correspondência registrada. O modelo mestre não foi alterado.':'Correspondência removida.');
  }));
  host.insertAdjacentHTML('beforeend','<div class="module-note">Uma associação aqui documenta a equivalência. Ela não modifica o JSON da tela nem executa conversão em tempo real. A padronização será decidida durante a consolidação.</div>');
}
function renderAudit(host,id){
  const data=moduleData(),a=data.audits.find(x=>x.internalId===id);
  if(!a){host.innerHTML='<div class="module-empty"><h3>Auditoria não encontrada</h3><p>Esta sub-aba foi removida ou o projeto foi alterado.</p></div>';return;}
  const r=a.report,details=r.auditoria||{};
  host.innerHTML=moduleHeader('Esta é uma fotografia independente de uma implementação analisada. Aqui registramos o que ela realmente fazia, sem obrigar o módulo futuro a repetir suas escolhas.',`<button class="btn btn-secondary" id="downloadSingleAudit">↓ JSON original</button><button class="btn btn-danger-lite" id="deleteSingleAudit">Excluir esta sub-aba</button>`);
  getEl('downloadSingleAudit').onclick=()=>download(`auditoria_${mode}_${a.internalId}.json`,safeJson(r));
  getEl('deleteSingleAudit').onclick=()=>{if(!confirm('Excluir esta auditoria e seus vínculos de comparação? Outras auditorias e o contrato mestre serão mantidos.'))return;checkpoint();
    data.audits=data.audits.filter(x=>x.internalId!==id);Object.keys(data.links).filter(k=>k.startsWith(id+'::')).forEach(k=>delete data.links[k]);subview='compare';changed('Auditoria excluída.');};
  const metadata=`<div class="audit-summary"><strong>${escapeHtml(details.nome||a.fileName)}</strong><p>${escapeHtml(details.resumo||'Sem resumo informado.')}</p><div class="module-inline"><span class="data-pill">Origem: ${escapeHtml(details.origem||a.fileName)}</span><span class="data-pill">Versão: ${escapeHtml(details.versao||'não informada')}</span><span class="data-pill">Importado: ${escapeHtml(a.importedAt?.slice(0,10)||'')}</span></div>${details.limitesDaAnalise?`<p><strong>Limites:</strong> ${escapeHtml(details.limitesDaAnalise)}</p>`:''}<p><strong>Arquivos:</strong> ${escapeHtml(strings(details.arquivosAnalisados).join(' · ')||'Não informados')}</p></div>`;
  const functions=asArray(r.funcionalidades);
  const functionsHtml=functions.length?functions.map(f=>`<div class="audit-data-row"><h4>${escapeHtml(f.nome||f.id||'Funcionalidade não identificada')}</h4><span class="mono-path">${escapeHtml(f.id||'')}</span><p><strong>Objetivo:</strong> ${escapeHtml(f.objetivo||'Não informado')}</p><p><strong>Comportamento observado:</strong> ${escapeHtml(f.comportamentoObservado||'Não informado')}</p><strong>Passos</strong>${smallList(f.passos)}<strong>Entradas</strong>${smallList(f.entradas)}<strong>Saídas</strong>${smallList(f.saidas)}<details><summary>Evidências</summary>${smallList(f.evidencias)}</details></div>`).join(''):'<p>Nenhuma funcionalidade identificada na fonte.</p>';
  const reads=asArray(r.leiturasTela);
  const readsHtml=reads.length?reads.map((v,i)=>`<div class="audit-data-row"><h4><code class="mono-path">${escapeHtml(v.campoOriginal||'Campo não localizado')}</code><span class="data-pill ${v.confianca==='confirmado'?'ok':'warn'}">${escapeHtml(v.confianca||'não classificado')}</span></h4><p>${escapeHtml(v.finalidade||'Finalidade não informada')}</p><div class="module-inline"><span class="data-pill">${escapeHtml(v.tipoOriginal||'tipo não informado')}</span><span class="data-pill">Obrigatório: ${v.obrigatorio===true?'sim':v.obrigatorio===false?'não':'indeterminado'}</span>${v.campoCanonicoSugerido?`<span class="data-pill warn">Sugestão: ${escapeHtml(v.campoCanonicoSugerido)}</span>`:''}</div><p><strong>Como lê:</strong> ${escapeHtml(v.comoLido||'Não informado')}</p><details><summary>Condições, relações e evidência</summary><p><strong>Funcionalidades:</strong> ${escapeHtml(strings(v.funcionalidadesRef).join(', ')||'Não informadas')}</p>${smallList(v.condicoes)}<p><strong>Evidência:</strong> ${escapeHtml(v.evidencia||'Não informada')}</p></details></div>`).join(''):'<p>Nenhuma leitura de campo informada.</p>';
  const ops=asArray(r.resolucoes);
  const opsHtml=ops.length?ops.map(op=>`<div class="audit-data-row"><h4>${escapeHtml(op.nome||op.id||'Operação')} <span class="data-pill">${escapeHtml(op.categoria||'categoria não informada')}</span></h4><p>${escapeHtml(op.comoResolve||'Sem descrição de resolução')}</p><strong>Etapas</strong>${smallList(op.passos)}<strong>Campos lidos</strong>${smallList(op.camposEntradaRef)}<strong>Saídas</strong>${smallList(op.saidas)}<details><summary>Regras e evidências</summary>${smallList(op.regras)}${smallList(op.evidencias)}</details></div>`).join(''):'<p>Nenhuma operação descrita.</p>';
  const visual=r.representacaoTela||{};
  const visualHtml=`<p><strong>Como as telas aparecem:</strong> ${escapeHtml(visual.comoAparece||'Não descrito')}</p><p><strong>Estrutura observada:</strong> ${escapeHtml(visual.estruturaObservada||'Não descrita')}</p><strong>Componentes</strong>${smallList(visual.componentes)}<strong>Estados visuais</strong>${smallList(visual.estadosVisuais)}<strong>Observações</strong>${smallList(visual.observacoes)}`;
  host.insertAdjacentHTML('beforeend',`<div class="audit-layout"><aside class="module-card audit-aside"><div class="eyebrow">ORIGEM E ESCOPO</div><h3>${escapeHtml(sourceAuditName(a))}</h3><div class="module-inline"><span class="data-pill ok">${functions.length} funcionalidades</span><span class="data-pill">${reads.length} leituras</span><span class="data-pill">${ops.length} resoluções</span></div><div class="detail-divider"></div><div class="audit-section-nav"><button data-section="audit-info" class="active">Contexto</button><button data-section="audit-functions">Funcionalidades</button><button data-section="audit-reads">Campos da tela</button><button data-section="audit-ops">Resoluções</button><button data-section="audit-visual">Representação</button><button data-section="audit-gaps">Lacunas</button></div></aside><div class="module-list"><div id="audit-info">${sectionCard('Identidade desta implementação',metadata,'01 / CONTEXTO')}</div><div id="audit-functions">${sectionCard('O que esta implementação faz',functionsHtml,'02 / FUNCIONALIDADES OBSERVADAS')}</div><div id="audit-reads">${sectionCard('O que busca nas telas',readsHtml,'03 / CAMPOS ORIGINAIS')}</div><div id="audit-ops">${sectionCard('Como monta nós, relações, ações e outras operações',opsHtml,'04 / RESOLUÇÃO')}</div><div id="audit-visual">${sectionCard('Como representa a tela',visualHtml,'05 / APRESENTAÇÃO')}</div><div id="audit-gaps">${sectionCard('Lacunas e observações',`<strong>Lacunas</strong>${smallList(r.lacunas)}<strong>Observações</strong>${smallList(r.observacoes)}`,'06 / PENDÊNCIAS')}</div></div></div>`);
  host.querySelectorAll('.audit-section-nav button').forEach(btn=>btn.onclick=()=>{
    host.querySelectorAll('.audit-section-nav button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
    host.querySelector('#'+btn.dataset.section)?.scrollIntoView({behavior:'smooth',block:'start'});
  });
}
function exportModuleDefinition(){
  const data=moduleData();const correspondencias=[];
  data.audits.forEach(a=>asArray(a.report.leiturasTela).forEach((entry,i)=>{
    const canonical=data.links[getReadingKey(a,i,entry)];if(canonical)correspondencias.push({auditoriaId:a.internalId,origem:sourceAuditName(a),campoOriginal:entry.campoOriginal,campoCanonico:canonical,finalidade:entry.finalidade||''});
  }));
  const value={formato:'advogadoja.definicao-modulo.v1',modulo:mode,status:'em_construcao',decisoes:data.definition,funcionalidadesDesejadas:data.functions.map(({internalId,...rest})=>rest),correspondenciasAprovadas:correspondencias,auditoriasFonte:data.audits.map(a=>({id:a.internalId,nome:sourceAuditName(a),arquivo:a.fileName})),observacao:'Definição de requisitos para futuro motor; não é um motor executável.'};
  download(`definicao_modulo_${mode}.json`,safeJson(value));
}
function renderDefinition(host){
  const data=moduleData();
  host.innerHTML=moduleHeader('Aqui registramos o que queremos que o módulo faça. Somente correspondências aprovadas entram na exportação; sugestões das IAs permanecem nas auditorias.',`<button class="btn btn-primary" id="exportModuleDefinition">↓ Exportar definição</button>`)+
    `<div class="module-grid"><section class="module-card"><div class="eyebrow">DECISÕES DO NOSSO MODELO</div><h3>Definição e regras finais</h3><p>Registre escolhas de comportamento, organização, limitações e responsabilidades. Este texto pode evoluir durante a conversa.</p><textarea class="definition-editor" id="definitionNotes" placeholder="Ex.: Flow deve mostrar nós por jornada, permitir mover telas e resolver conexões exclusivamente pelos IDs explícitos.">${escapeHtml(data.definition)}</textarea><div class="edit-actions"><button id="saveDefinition" class="btn btn-primary">Salvar definição</button></div></section><section class="module-card"><div class="eyebrow">COBERTURA</div><h3>De onde vêm as decisões</h3><div class="module-list"><div class="module-list-item"><h4>${data.functions.length} funcionalidades desejadas</h4><p>Registradas manualmente para o módulo futuro.</p></div><div class="module-list-item"><h4>${data.audits.length} auditorias antigas</h4><p>Fontes de pesquisa independentes.</p></div><div class="module-list-item"><h4>${Object.keys(data.links).length} correspondências aprovadas</h4><p>Associações explícitas com campos do JSON mestre.</p></div></div></section></div>`;
  getEl('saveDefinition').onclick=()=>{checkpoint();data.definition=getEl('definitionNotes').value;changed('Definição do módulo salva.');};
  getEl('exportModuleDefinition').onclick=exportModuleDefinition;
}


function isContract(v){
  return v&&typeof v==='object'&&!Array.isArray(v)&&
    v.identidade&&typeof v.identidade.id==='string'&&v.identidade.id.trim()&&
    v.classificacao&&typeof v.classificacao==='object';
}
function normalizeContract(v){
  if(isContract(v))return v;
  const values=v&&typeof v==='object'&&!Array.isArray(v)?Object.values(v):[];
  if(values.length===1&&isContract(values[0]))return values[0];
  throw new Error('É necessário um JSON de tela com identidade.id e classificacao.');
}
function replaceModelWithContract(raw){
  const incoming=normalizeContract(raw);
  if(!confirm('Substituir o contrato editado pelo JSON importado? Exporte seu projeto para preservar alterações antes de continuar.'))return;
  checkpoint();
  project.tree=Object.entries(incoming).map(([key,value])=>makeNode(key,value));
  project.meta={};
  walkTree(project.tree,({node,path})=>{
    const cfg=guideFor(path);
    project.meta[node.uid]={description:cfg?.[0]||'',uses:cfg?structuredClone(cfg[1]):{}};
  });
  project.screen=incoming.identidade.id;
  mode='master';subview='overview';selectedUid=findPath('identidade.id')?.node.uid||project.tree[0]?.uid||null;
  expanded=new Set(project.tree.map(x=>x.uid));
  changed('Contrato importado. Os outros dados do projeto permanecem disponíveis.');
}
async function readContractFile(file){
  try{replaceModelWithContract(JSON.parse(await file.text()));}
  catch(err){toast('Não foi possível importar o contrato: '+err.message);}
}
async function bootstrap(){
  const notice=getEl('startupNotice');
  const picker=getEl('startupFile');
  picker.onchange=async()=>{
    if(!picker.files[0])return;
    try{
      INIT_MODEL=normalizeContract(JSON.parse(await picker.files[0].text()));
      notice.hidden=true;initializeProject();init();
    }catch(err){getEl('startupMessage').textContent='JSON inválido: '+err.message;}
    picker.value='';
  };
  try{
    const res=await fetch('./documento.json',{cache:'no-store'});
    if(!res.ok)throw new Error('HTTP '+res.status);
    INIT_MODEL=normalizeContract(await res.json());
    initializeProject();init();
  }catch(err){
    notice.hidden=false;
    getEl('startupMessage').textContent='O documento inicial não pôde ser carregado automaticamente. Abra por um servidor HTTP/GitHub Pages ou selecione documento.json abaixo.';
  }
}

function init(){
  getEl('importModelFile').onchange=async e=>{if(e.target.files[0])await readContractFile(e.target.files[0]);e.target.value='';};
  document.querySelectorAll('[data-flow-focus]').forEach(button=>button.onclick=()=>focusFlowField(button.dataset.flowFocus));
  getEl('treeSearch').addEventListener('input',e=>{searchTerm=e.target.value.trim().toLowerCase();renderTree();});
  getEl('expandAllBtn').onclick=()=>{const all=[];walkTree(project.tree,({node})=>{if(node.children)all.push(node.uid);});expanded=expanded.size?new Set():new Set(all);renderTree();};
  getEl('addSectionBtn').onclick=()=>showAddDialog(true);getEl('addFieldBtn').onclick=()=>showAddDialog(false);
  getEl('addForm').addEventListener('submit',addFieldSubmit);
  getEl('importSourceFile').onchange=async e=>{await readSources([...e.target.files]);e.target.value='';};
  getEl('importAuditFile').onchange=async e=>{await readAuditFiles([...e.target.files]);e.target.value='';};
  getEl('functionForm').addEventListener('submit',saveFunction);
  getEl('importProjectFile').onchange=async e=>{if(e.target.files[0])await readProject(e.target.files[0]);e.target.value='';};
  getEl('sourceConflict').onchange=()=>getEl('sourceError').hidden=true;
  getEl('incorporateBtn').onclick=incorporateSource;
  getEl('exportModelBtn').onclick=exportModel;getEl('exportProjectBtn').onclick=exportProject;getEl('exportUsageBtn').onclick=exportUsages;
  getEl('undoBtn').onclick=()=>{if(!history.length)return;project=JSON.parse(history.pop());ensureModuleData();selectedUid=findNode(selectedUid)?.node.uid||project.tree[0]?.uid||null;if(subview.startsWith('audit:')&&!moduleData()?.audits.some(a=>'audit:'+a.internalId===subview))subview='compare';save();renderAll();toast('Última alteração desfeita.');};
  getEl('resetBtn').onclick=()=>{if(!confirm('Restaurar o exemplo inicial? O modelo e todas as auditorias serão substituídos (use Exportar projeto para preservar).'))return;checkpoint();project=makeProject();ensureModuleData();mode='master';subview='overview';selectedUid=findPath('identidade.id')?.node.uid;expanded=new Set(project.tree.map(n=>n.uid));changed('Exemplo inicial restaurado.');};
  document.querySelectorAll('[data-close]').forEach(el=>el.onclick=()=>getEl(el.dataset.close).close());
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){e.preventDefault();getEl('undoBtn').click();}});
  renderAll();save();
}
if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',bootstrap);
