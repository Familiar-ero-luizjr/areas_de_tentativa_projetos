(()=>{'use strict';
// Compatibility bridge for the eleven existing persistence proposals; not a second page catalog.
const legacy=Object.freeze({splash:'auth.inicializacao.splash',welcome:'auth.inicializacao.boas_vindas',login:'auth.sessao.entrar',account_type:'auth.cadastro.tipo_conta',identification:'auth.cadastro.identificacao',contact:'auth.cadastro.contato',address:'auth.cadastro.endereco',security:'auth.cadastro.seguranca',consents:'auth.cadastro.consentimentos',registration_review:'auth.cadastro.revisao',registration_complete:'auth.cadastro.concluido'});
let ctx,model,docs,chosen='',state=0;
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
const canonical=id=>own(model.pages,id)?id:Object.keys(legacy).find(k=>legacy[k]===id&&own(model.pages,k));
function mappings(id){return P.telas.filter(t=>t.id===id||t.id===legacy[id])}
function mapping(id){return mappings(id).find(t=>t.id===id)||mappings(id)[0]}
const jsonText=x=>JSON.stringify(x,null,2)??'—';
function node(tag,txt){const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;return n}
function block(title,obj){return `<details class="data-detail"><summary>${E(title)}</summary><pre>${E(jsonText(obj))}</pre></details>`}
function renderPage(){
 model=ctx.servicos.obterDados('contrato_aplicacao');docs=ctx.servicos.obterDados('documentos_telas');
 if(!model?.pages||!model?.layouts||!model?.components){ctx.container.textContent='Contrato da aplicação indisponível. Verifique dados/contrato_aplicacao.json.';return}
 const ids=Object.keys(model.pages),id=canonical(selected)||canonical(chosen)||ids[0];if(!id){ctx.container.textContent='Nenhuma página no contrato.';return}
 if(chosen!==id){chosen=id;state=0}selected=mapping(id)?.id||id;
 const p=model.pages[id],m=mapping(id),data=p.data||{},fields=arr(data.fields),names=docs?.journeyPresentation||{};
 if(!arr(p.states).some(s=>s.id===state))state=p.states?.find(s=>s.id===0)?.id??p.states?.[0]?.id??0;
 const classification=arr(p.classification?.journeys).flatMap(j=>arr(j.subjourneys).map(s=>`${names.journeyNames?.[j.id]||j.id} / ${names.subjourneyNames?.[s.id]||s.id}`));
 const unmapped=P.telas.filter(t=>!canonical(t.id));
 ctx.container.innerHTML=heading('Telas e dados','Páginas e dados declarados no contrato atual. Os vínculos com o banco são propostas de modelagem, independentes do protótipo.')+`<div class="screenlayout"><div class="screenlist" id="dataScreenList"><p><b>${ids.length} páginas</b></p>${ids.map((k,i)=>`<button type="button" data-page="${E(k)}" class="${k===id?'active':''}">${String(i+1).padStart(2,'0')} · ${E(model.pages[k].identity.name)}</button>`).join('')}</div><div class="data-page"><div class="toolbar"><b>${E(p.identity.name)}</b><small>${E(id)}</small><span>${E(p.classification?.profileRef||'')}</span></div><p class="data-context">${E(classification.join(' · '))}</p><div class="screenbody"><div><label class="data-state">Estado<select id="dataState">${arr(p.states).map(s=>`<option value="${E(s.id)}" ${s.id===state?'selected':''}>${E(s.id+' · '+s.name)}</option>`).join('')}</select></label><div class="phone" id="dataPreview"></div><small>Visualização pelo contrato JSON. Simulação sem persistência de negócio.</small></div><div class="data-info"><h2>Dados declarados na página</h2>${table(['Campo / binding','Tipo','Obrigatório'],fields.map(f=>[E(f.binding||f.id),E(f.type),f.required?'Sim':'Não']))}${block('Valores iniciais · data.values',data.values||{})}${block('Dados locais · data.local',data.local||{})}${block('Fontes · data.sources',arr(data.sources))}${block('Operações · data.operations',arr(data.operations))}${block('Mocks da página',arr(p.mocks))}<h2 class="data-map-title">Mapeamento de persistência</h2><p class="data-context">${m?'Proposta existente · '+E(m.id):'Não há mapeamento aprovado para esta página.'} Não é derivado automaticamente dos campos do protótipo.</p><button type="button" class="primary" id="dataAddItem">+ Informação</button>${['Entrada','Saída'].map(dir=>`<h3>${dir==='Entrada'?'Entradas':'Saídas'}</h3>${table(['Informação','Destino / origem','Operação',''],arr(m?.itens).map((x,i)=>[x,i]).filter(([x])=>x.direcao===dir).map(([x,i])=>[E(x.nome)+(x.observacao?`<br><small>${E(x.observacao)}</small>`:''),E(x.tabela?name('tabelas',x.tabela)+(x.campo?'.'+x.campo:''):'Sem vínculo'),E(x.operacao),`<button type="button" data-item="${i}">Editar</button>`]))}`).join('')}${mappings(id).length>1?'<p class="notice">Existem dois registros de mapeamento para esta página. O ID canônico tem precedência; ambos foram preservados na fonte.</p>':''}</div></div>${unmapped.length?block('Mapeamentos sem página correspondente (preservados)',unmapped):''}</div></div>`;
 ctx.container.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{chosen='';selected=b.dataset.page;renderPage()});
 ctx.container.querySelector('#dataState').onchange=e=>{state=Number(e.target.value);showPreview(p)};
 ctx.container.querySelector('#dataAddItem').onclick=()=>editMapping(-1);
 ctx.container.querySelectorAll('[data-item]').forEach(b=>b.onclick=()=>editMapping(Number(b.dataset.item)));
 showPreview(p);
}
function showPreview(p){const frame=node('iframe');frame.title='Visualização de '+p.identity.name;frame.__tjData={model,...docs};const url=new URL('modulos/telas_e_jornadas/telas/index.html',document.baseURI);url.search=new URLSearchParams({page:p.identity.id,state:String(state),preview:'1'});frame.src=url.href;ctx.container.querySelector('#dataPreview').replaceChildren(frame)}
function editMapping(i){const id=chosen,p=model.pages[id],existing=mapping(id),x=existing?.itens?.[i]||{};
 showModal('Entrada ou saída de informação',`<form id="dataMapForm">${select('direcao','Direção',x.direcao||'Entrada',[['Entrada','Entrada'],['Saída','Saída']])}${input('nome','Informação',x.nome)}${select('tabela','Tabela / coleção',x.tabela,opts('tabelas'))}${select('campo','Campo (opcional)',x.campo,fieldOpts(x.tabela))}${select('operacao','Operação',x.operacao||'A definir',['A definir','Temporário','Consultar','Inserir','Atualizar','Excluir','Autenticação externa'].map(v=>[v,v]))}${text('observacao','Observação',x.observacao)}<button class="primary" type="submit">Salvar</button> ${i>=0?'<button type="button" id="dataRemoveItem" class="danger">Excluir</button>':''}</form>`);
 const f=$('dataMapForm');f.elements.tabela.onchange=()=>f.elements.campo.innerHTML=options(fieldOpts(get(f,'tabela')),'');
 f.onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(['direcao','nome','tabela','campo','operacao','observacao'].map(k=>[k,get(f,k)]));if(!v.nome.trim())return alert('Informe a informação.');let m=mapping(id);if(!m){m={id,nome:p.identity.name,jornada:'',itens:[],visual:[],descricao:'Mapeamento de persistência em análise'};P.telas.push(m)}if(i<0)m.itens.push(v);else m.itens[i]=v;selected=m.id;modal.close();save()};
 const del=$('dataRemoveItem');if(del)del.onclick=()=>{if(confirm('Excluir este vínculo? A página do contrato será preservada.')){existing.itens.splice(i,1);modal.close();save()}};
}
registrarModulo('telas_e_dados',{iniciar(c){ctx=c;chosen='';state=0},atualizar(c){ctx=c;renderPage()},destruir(){ctx=null;model=null;docs=null;chosen=''}});
})();
