import {iniciar,$,esc,pre,option,aviso} from './ui.js';
import {montarTela} from './montagem.js';
import {projetar,resolverTransicao} from './motor.js';
import {baixar,stringify} from './catalogo.js';
let c,telaId='app.splash',participacaoId='part.splash.inicio',estado='inicial',mock='',historico=[],mode='experiencia',perspectiva='modular',sequencias=[],relacoesLocais=[],eventos=[],intervalo=1500,timer=null,seqAtual='',dadosTemporarios={};
const registrar=(tipo,valor)=>{eventos.unshift({tipo,valor,hora:new Date().toLocaleTimeString('pt-BR')});eventos=eventos.slice(0,120)};
const parar=()=>{if(timer!==null){clearTimeout(timer);timer=null}};
function abrir(t,p){parar();registrar('tela',t);if(!c.telas[t]){aviso('Tela ausente: '+t);return}historico.push({telaId,participacaoId,estado,mock});telaId=t;participacaoId=p||c.telas[t].navegacao?.participacoes?.[0]?.id||'';estado=c.telas[t].estados?.fallbackSeguro||'padrao';mock='';render()}
function executar(id){registrar('acao',id);const t=c.telas[telaId],m=t.mocks?.cenarios?.find(x=>x.id===mock),resultado=resolverTransicao(c,{telaId,participacaoId,acaoId:id,dados:{...(m?.dados||{}),...dadosTemporarios},estado});if(resultado.destino?.telaId){abrir(resultado.destino.telaId,resultado.destino.participacaoId);return}if(resultado.efeito?.tipo==='estado'){estado=resultado.efeito.estado;render();return}if(resultado.semCorrespondencia?.estado){estado=resultado.semCorrespondencia.estado;render();aviso(resultado.erro);return}if(resultado.efeito?.tipo==='permanecer'){aviso('Permanecer na tela atual');return}aviso(resultado.erro||'Ação simulada sem destino')}
function render(){const t=c.telas[telaId];if(!t){telaId='app.splash';return render()}
 const parts=t.navegacao?.participacoes||[],states=t.estados?.possiveis||[],mocks=t.mocks?.cenarios||[];
 $('main').innerHTML=`<div class="section-head"><div><h2>Laboratório Modular V2 · experiência simulada</h2><p class="sub">Lê o Catálogo ativo e usa motor e resolvedor próprios desta pasta; ações e estados continuam declarados nos contratos.</p></div><div class="row"><button id="back" class="btn" ${historico.length?'':'disabled'}>← Voltar</button><button id="restart" class="btn">Recomeçar</button></div></div><div class="lab-perspectives"><strong>Laboratório Modular V2</strong><span class="tag">Percursos, sequências, relações e apresentação · Catálogo ativo</span></div><div class="lab-tabs" style="margin-bottom:15px">${[["experiencia","◉ Experiência"],["sequencias","⇄ Sequências"],["relacoes","⌁ Relações"],["percurso","☷ Percurso"],["configuracao","⚙ Apresentação"],["motor","{ } Motor / JSON"]].map(([id,n])=>`<button class="btn ${mode===id?'primary':''}" data-mode="${id}">${n}</button>`).join('')}</div><div class="cols"><div class="panel"><label class="label">Tela</label><select class="form-control" id="telaSel">${Object.values(c.telas).map(s=>option(s.identidade.id,s.identidade.nome,telaId)).join('')}</select><label class="label">Participação</label><select class="form-control" id="partSel">${parts.map(p=>option(p.id,p.id,participacaoId)).join('')}</select><label class="label">Estado</label><select class="form-control" id="estadoSel">${states.map(s=>option(s.id,s.nome||s.id,estado)).join('')}</select><label class="label">Mock</label><select class="form-control" id="mockSel">${option('','Sem mock',mock)}${mocks.map(m=>option(m.id,m.nome||m.id,mock)).join('')}</select><div class="notice" style="margin-top:15px">Este protótipo não chama autenticação, APIs ou banco reais. O resultado do login depende do cenário mock selecionado.</div></div><section class="panel" id="protoBody"></section></div>`;
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{parar();mode=b.dataset.mode;render()});$('telaSel').onchange=e=>{telaId=e.target.value;participacaoId=c.telas[telaId].navegacao?.participacoes?.[0]?.id;estado=c.telas[telaId].estados?.fallbackSeguro;mock='';render()};$('partSel').onchange=e=>{participacaoId=e.target.value;render()};$('estadoSel').onchange=e=>{estado=e.target.value;render()};$('mockSel').onchange=e=>{mock=e.target.value;render()};$('back').onclick=()=>{const prev=historico.pop();if(prev)({telaId,participacaoId,estado,mock}=prev);render()};$('restart').onclick=()=>{historico=[];telaId='app.splash';participacaoId='part.splash.inicio';estado='inicial';mock='';render()};
 const proj=projetar(c,telaId,participacaoId,estado,mock);if(mode==='motor'){$('protoBody').innerHTML=pre(proj);return}if(mode==='cenarios'){$('protoBody').innerHTML=`<h3>Estados e cenários</h3><p>Estado atual: <b>${esc(estado)}</b> · Mock: <b>${esc(mock||'nenhum')}</b></p>${pre({estados:t.estados,mocks:t.mocks,variantesAplicaveis:proj.variantes})}`;return}
 if(!['experiencia','cenarios','motor'].includes(mode)){renderExtra(proj);return}
 $('protoBody').innerHTML=`<div class="row between"><h3>${esc(t.identidade.nome)}</h3><span class="tag">${esc(participacaoId)}</span></div><div class="shadow-wrap" id="screen"></div><h3 style="margin-top:17px">Ações declaradas</h3><div class="row" id="actions">${(t.acoes?.itens||[]).map(a=>`<button class="btn" data-act="${esc(a.id)}">${esc(a.evento||a.id)}</button>`).join('')||'<span class="small">Sem ação</span>'}</div><div class="small" style="margin-top:12px">Variantes ativas: ${esc(proj.variantes.map(v=>v.id).join(', ')||'nenhuma')}</div>`;
 try{const v=montarTela(c,telaId,{participacaoId,estado,dados:proj.contexto,callback:acao=>{if(acao)executar(acao);else aviso('Evento do componente sem ação vinculada')}});$('screen').append(v.host)}catch(e){aviso(e.message)}
 $('actions').onclick=e=>{const b=e.target.closest('[data-act]');if(b)executar(b.dataset.act)};
}

const telas=()=>Object.values(c.telas);
const relacoesCanonicas=()=>telas().flatMap(t=>(t.acoes?.itens||[]).flatMap(a=>[...(a.destino?[a.destino]:[]),...(a.rotas||[]).map(r=>r.destino)].filter(Boolean).map(d=>({origem:t.identidade.id,destino:d.telaId,evento:a.evento,acao:a.id}))));
const bloco=(nome,html)=>'<h3>'+esc(nome)+'</h3>'+html;
const linha=(a,b)=>'<div class="lab-line"><strong>'+esc(a)+'</strong><span>'+esc(b)+'</span></div>';
const btn=(id,label)=>'<button type="button" class="btn" data-local="'+id+'">'+label+'</button>';
function mostrarMotor(){mode='motor';render()}
function renderExtra(proj){
 const body=$('protoBody'),t=c.telas[telaId];
 let html='';
 if(mode==='configuracao'){
  html=bloco('Execução HTML',linha('Origem','Catálogo ativo')+linha('Telas',telas().length)+linha('Perspectiva',perspectiva)+'<label class="label" for="velocidade">Intervalo da execução (ms)</label><input class="form-control" id="velocidade" type="number" min="600" max="10000" step="100" value="'+intervalo+'"><div class="row">'+btn('inicio','Iniciar Splash')+btn('cliente','Abrir Home Cliente')+btn('advogado','Abrir Home Advogado')+btn('auto','▶ Auto')+btn('tela-cheia','⛶ Apresentar')+'</div>');
 }else if(mode==='dados'){
  const dados={...(t.mocks?.cenarios?.find(x=>x.id===mock)?.dados||{}),...dadosTemporarios};
  html=bloco('Dados e preenchimento simulados','<p class="small">Edita dados temporários para avaliar estados e decisões. A fonte dos cenários é o próprio JSON da tela; não há dados históricos copiados.</p><textarea id="dadosJson" rows="10" class="form-control">'+esc(JSON.stringify(dados,null,2))+'</textarea><div class="row">'+btn('aplicar-dados','Aplicar dados')+btn('preencher','✦ Preencher com cenário da tela')+btn('limpar-dados','Limpar alterações')+'</div>'+bloco('Cenários declarados',pre(t.mocks?.cenarios||[])));
 }else if(mode==='estados'){
  html=bloco('Estados declarados',(t.estados?.possiveis||[]).map(s=>'<button class="btn '+(estado===s.id?'primary':'')+'" data-state="'+esc(s.id)+'">'+esc(s.nome||s.id)+'</button> ').join('')+bloco('Variantes aplicáveis',pre(proj.variantes)));
 }else if(mode==='eventos'){
  html=bloco('Ações e eventos de tela','<p class="small">Nenhuma ação é inventada. Cada botão executa o resolvedor do contrato.</p>'+(t.acoes?.itens||[]).map(a=>'<button class="btn" data-act2="'+esc(a.id)+'">'+esc(a.evento||a.id)+'</button> ').join('')+bloco('Eventos registrados',pre(eventos.slice(0,30))));
 }else if(mode==='telas'){
  html=bloco('Inventário canônico',telas().map(s=>'<button class="lab-screen" data-screen="'+esc(s.identidade.id)+'"><strong>'+esc(s.identidade.nome)+'</strong><small>'+esc(s.identidade.id)+'</small></button>').join(''));
 }else if(mode==='sequencias'){
  const seq=sequencias.find(x=>x.id===seqAtual);
  html=bloco('Sequências para apresentação','<p class="small">Ordem de apresentação local, não navegação canônica.</p><div class="row">'+sequencias.map(s=>'<button class="btn '+(s.id===seqAtual?'primary':'')+'" data-seq="'+esc(s.id)+'">'+esc(s.nome)+'</button>').join('')+'</div><label class="label">ID<input class="form-control" id="seqId" value="'+esc(seq?.id||'')+'"></label><label class="label">Nome<input class="form-control" id="seqNome" value="'+esc(seq?.nome||'')+'"></label><label class="label">Telas (IDs separados por linha)<textarea rows="7" class="form-control" id="seqEtapas">'+esc(seq?.etapas?.join('\n')||'')+'</textarea></label><div class="row">'+btn('nova-seq','Nova')+btn('salvar-seq','Salvar')+btn('executar-seq','▶ Executar')+btn('excluir-seq','Excluir')+'</div>');
 }else if(mode==='relacoes'){
  const rel=relacoesCanonicas();
  html=bloco('Relações canônicas (ações)',rel.map(x=>linha(x.origem+' → '+x.destino,x.evento)).join('')||'<p>Sem relações.</p>')+bloco('Notas de ligação de laboratório',relacoesLocais.map(x=>linha(x.origem+' → '+x.destino,'Simulação não canônica')).join('')+'<div class="row"><label>Origem<select class="form-control" id="relOrig">'+telas().map(x=>option(x.identidade.id,x.identidade.nome)).join('')+'</select></label><label>Destino<select class="form-control" id="relDest">'+telas().map(x=>option(x.identidade.id,x.identidade.nome)).join('')+'</select></label></div>'+btn('nota-rel','Adicionar nota local')+'<p class="notice">Notas não alteram o contrato da tela; edição real de rotas pertence ao Flow/Catálogo.</p>');
 }else if(mode==='percurso'){
  html=bloco('Telas visitadas','<ol>'+historico.map(h=>'<li>'+esc(h.telaId)+'</li>').join('')+'<li><strong>'+esc(telaId)+'</strong> (atual)</li></ol>')+bloco('Rastreio',pre(eventos));
 }
 body.innerHTML='<div class="lab-subpanel">'+html+'</div><div class="lab-tools">'+btn('exportar','↓ Exportar sessão')+btn('importar','↑ Importar sessão')+btn('motor','Inspecionar motor / JSON')+'</div><input hidden type="file" id="sessaoFile" accept=".json,application/json">';
 body.querySelectorAll('[data-local]').forEach(b=>b.onclick=()=>acaoLocal(b.dataset.local));
 body.querySelectorAll('[data-state]').forEach(b=>b.onclick=()=>{estado=b.dataset.state;registrar('estado',estado);render()});
 body.querySelectorAll('[data-act2]').forEach(b=>b.onclick=()=>executar(b.dataset.act2));
 body.querySelectorAll('[data-screen]').forEach(b=>b.onclick=()=>{abrir(b.dataset.screen);mode='experiencia';render()});
 body.querySelectorAll('[data-seq]').forEach(b=>b.onclick=()=>{seqAtual=b.dataset.seq;render()});
 $('sessaoFile').onchange=importarSessao;
 if($('velocidade'))$('velocidade').onchange=e=>{intervalo=Math.max(600,Math.min(10000,Number(e.target.value)||1500));registrar('intervalo',intervalo)};
}
function seqEditor(){const id=$('seqId')?.value.trim(),nome=$('seqNome')?.value.trim(),etapas=$('seqEtapas')?.value.split(/[\n,]/).map(x=>x.trim()).filter(Boolean)||[];if(!id||!nome||!etapas.length||etapas.some(x=>!c.telas[x])){aviso('Sequência inválida: use apenas telas ativas.');return null}return {id,nome,etapas,intervalo}}
function tocarSequencia(seq){parar();if(!seq?.etapas?.length)return;mode='experiencia';abrir(seq.etapas[0]);let i=1;const next=()=>{if(i>=seq.etapas.length){timer=null;return}timer=setTimeout(()=>{const destino=seq.etapas[i++];abrir(destino);next()},intervalo)};next();aviso('Execução editorial; não altera rotas JSON.')}
function auto(){parar();let visited=new Set();const next=()=>{if(visited.has(telaId)){aviso('Auto pausado: ciclo de navegação');return}visited.add(telaId);const acts=(c.telas[telaId].acoes?.itens||[]).filter(a=>a.destino||a.rotas?.length);if(acts.length!==1){aviso('Auto pausado: escolha de ação ou fim da rota.');return}timer=setTimeout(()=>{const old=telaId;executar(acts[0].id);if(telaId!==old)next();else parar()},intervalo)};next()}
function acaoLocal(action){
 if(action==='motor')return mostrarMotor();
 if(action==='inicio'||action==='cliente'||action==='advogado'){parar();historico=[];abrir(action==='inicio'?'app.splash':action+'.home');mode='experiencia';render();return}
 if(action==='auto')return auto();
 if(action==='tela-cheia'){const el=$('screen')||$('main');if(!document.fullscreenElement)el.requestFullscreen?.().catch(()=>aviso('Tela cheia indisponível'));else document.exitFullscreen?.();return}
 if(action==='aplicar-dados'){try{const obj=JSON.parse($('dadosJson').value);if(!obj||Array.isArray(obj)||typeof obj!=='object')throw Error('Use objeto JSON');dadosTemporarios=obj;registrar('dados','Aplicados para simulação');render()}catch(e){aviso(e.message)}return}
 if(action==='preencher'){const x=c.telas[telaId].mocks?.cenarios?.find(x=>x.id===mock)||c.telas[telaId].mocks?.cenarios?.[0];if(!x)return aviso('Tela sem cenário');mock=x.id;dadosTemporarios={...x.dados,...dadosTemporarios};render();return}
 if(action==='limpar-dados'){dadosTemporarios={};render();return}
 if(action==='nova-seq'){seqAtual='';render();return}
 if(action==='salvar-seq'){const s=seqEditor();if(!s)return;sequencias=sequencias.filter(x=>x.id!==s.id);sequencias.push(s);seqAtual=s.id;render();return}
 if(action==='excluir-seq'){sequencias=sequencias.filter(x=>x.id!==seqAtual);seqAtual='';render();return}
 if(action==='executar-seq'){const s=seqEditor()||sequencias.find(x=>x.id===seqAtual);if(s)tocarSequencia(s);return}
 if(action==='nota-rel'){relacoesLocais.push({origem:$('relOrig').value,destino:$('relDest').value});render();return}
 if(action==='exportar'){baixar('prototipo_modular_sessao_v6.json',stringify({schema:'advogadoja.prototipo.sessao.v1',perspectiva,sequencias,relacoesLocais,intervalo,nota:'Somente sessão de laboratório'}));return}
 if(action==='importar'){$('sessaoFile').click();return}
}
async function importarSessao(e){const f=e.target.files?.[0];if(!f)return;try{if(f.size>1e6)throw Error('Arquivo maior que 1 MB');const x=JSON.parse(await f.text());if(x.schema!=='advogadoja.prototipo.sessao.v1'||!Array.isArray(x.sequencias)||!Array.isArray(x.relacoesLocais))throw Error('Formato inválido');if(x.sequencias.some(s=>!Array.isArray(s.etapas)||s.etapas.some(id=>!c.telas[id])))throw Error('Referências a telas ausentes');sequencias=x.sequencias;relacoesLocais=x.relacoesLocais.filter(r=>c.telas[r.origem]&&c.telas[r.destino]).slice(0,100);intervalo=Math.max(600,Math.min(1e4,Number(x.intervalo)||1500));seqAtual=sequencias[0]?.id||'';registrar('importacao','Sessão carregada sem afetar catálogo');render()}catch(err){aviso(err.message)}}

iniciar(async data=>{c=data;sequencias=[{id:'abertura',nome:'Abertura declarada',etapas:['app.splash','app.boas_vindas','auth.entrar'],intervalo:1500}];seqAtual='abertura';render()});
