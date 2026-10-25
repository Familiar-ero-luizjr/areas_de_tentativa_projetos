/* Módulo de contrato totalmente isolado: não lê nem escreve model.screens/components. */
'use strict';
const ctState={doc:null,version:null,original:null,dirty:false,readOnly:false,area:'tela',campo:0,tab:'objetivos',jsonPending:false};
const ctId = id=>document.getElementById(id);
const ctEsc = value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctClone = obj=>JSON.parse(JSON.stringify(obj));
function ctValidate(doc){
 if(!doc || typeof doc!=='object'||Array.isArray(doc) ||doc.schema!=='advogadoja.modulo_contrato.v1') throw Error('Este JSON não é do módulo Contrato. Esperado: schema advogadoja.modulo_contrato.v1.');
 if(!doc.metadados||doc.metadados.id!=='advogadoja.workspace.contrato'||typeof doc.metadados.titulo!=='string'||typeof doc.metadados.versao!=='string') throw Error('metadados inválidos ou contrato diferente.');
 if(!Array.isArray(doc.objetivos)||!Array.isArray(doc.areas)||!Array.isArray(doc.decisoes)||!doc.controle||typeof doc.controle!=='object') throw Error('Documento incompleto: requer objetivos[], areas[], decisoes[] e controle.');
 if(doc.controle.aplicacaoAutomaticaNoCatalogo!==false) throw Error('controle.aplicacaoAutomaticaNoCatalogo deve permanecer false enquanto o contrato está em planejamento.');
 const ids=[];
 for(const o of doc.objetivos){if(!o||typeof o.id!=='string'||typeof o.titulo!=='string'||typeof o.descricao!=='string')throw Error('Objetivo inválido.');ids.push('objetivo:'+o.id)}
 for(const a of doc.areas){
  if(!a||!a.id||!a.titulo||typeof a.objetivo!=='string'||typeof a.fonte!=='string'||!Array.isArray(a.campos)||!Array.isArray(a.regras)||!Array.isArray(a.pendencias)||!Array.isArray(a.criteriosAceite))throw Error('Área incompleta: '+(a?.id||'sem ID'));
  ids.push('area:'+a.id);
  if(!['proposto','em_revisao','homologado'].includes(a.situacao))throw Error('Situação inválida na área '+a.id);
  const paths=new Set();for(const c of a.campos){if(!c||typeof c.campo!=='string'||!c.campo.trim()||typeof c.finalidade!=='string'||typeof c.regra!=='string'||!['obrigatorio','opcional','condicional'].includes(c.exigencia)||!['existente','proposto','em_revisao','pendente'].includes(c.situacao))throw Error('Campo inválido na área '+a.id);if(paths.has(c.campo))throw Error('Campo duplicado na área '+a.id+': '+c.campo);paths.add(c.campo)}
  for(const k of ['regras','pendencias','criteriosAceite']) if(a[k].some(x=>typeof x!=='string'))throw Error(k+' deve ser lista de textos em '+a.id);
 }
 for(const d of doc.decisoes){if(!d||!d.id||typeof d.assunto!=='string'||typeof d.decisao!=='string'||typeof d.impacto!=='string'||!['proposta','pendente','homologada'].includes(d.situacao))throw Error('Decisão inválida.');ids.push('decisao:'+d.id)}
 if(ids.some((id,i)=>ids.indexOf(id)!==i))throw Error('IDs duplicados em objetivos, áreas ou decisões.');
 return true;
}
function ctNotice(msg,kind=''){const el=ctId('ctMessage');if(el){el.textContent=msg;el.className='ct-message '+kind}}
function ctStatus(){const el=ctId('ctStatus');if(!el)return;el.textContent=ctState.readOnly?'Modo leitura (exportação disponível)':ctState.dirty?'Rascunho com alterações': 'Contrato salvo em data/';el.className='ct-status '+(ctState.dirty?'dirty':ctState.readOnly?'error':'saved');ctId('ctSaveBtn').disabled=ctState.readOnly||!ctState.doc||!ctState.dirty;}
function ctDirty(){ctState.dirty=true;ctStatus()}
function contratoRender(){if(!ctState.doc)return;ctStatus();const d=ctState.doc;
 ctId('ctMetrics').innerHTML=[['Objetivos',d.objetivos.length],['Áreas',d.areas.length],['Campos',d.areas.reduce((n,a)=>n+a.campos.length,0)],['Decisões',d.decisoes.length]].map(([n,v])=>`<div class="ct-metric"><strong>${v}</strong><span>${ctEsc(n)}</span></div>`).join('');
 for(const b of document.querySelectorAll('[data-ct-tab]'))b.classList.toggle('active',b.dataset.ctTab===ctState.tab);
 for(const [k,id] of [['objetivos','ctPanelObjetivos'],['areas','ctPanelAreas'],['decisoes','ctPanelDecisoes'],['json','ctPanelJson']])ctId(id).hidden=ctState.tab!==k;
 if(ctState.tab==='objetivos')ctRenderObjetivos();else if(ctState.tab==='areas')ctRenderAreas();else if(ctState.tab==='decisoes')ctRenderDecisoes();else if(!ctState.jsonPending)ctId('ctJson').value=JSON.stringify(d,null,2);
}
function ctRenderObjetivos(){ctId('ctObjetivos').innerHTML=ctState.doc.objetivos.map((o,i)=>`<div class="ct-card" data-ct-obj="${i}"><strong>${ctEsc(o.id)}</strong><label>Título</label><input class="ct-input" data-ct-obj-field="titulo" value="${ctEsc(o.titulo)}"><label>Descrição</label><textarea class="ct-textarea" data-ct-obj-field="descricao">${ctEsc(o.descricao)}</textarea><div class="ct-card-actions"><button class="btn sm ct-delete" data-ct-remove-obj="${i}">Remover</button></div></div>`).join('');}
function ctRenderDecisoes(){ctId('ctDecisoes').innerHTML=ctState.doc.decisoes.map((o,i)=>`<div class="ct-card" data-ct-decision="${i}"><strong>${ctEsc(o.id)}</strong><label>Assunto</label><input class="ct-input" data-ct-dec-field="assunto" value="${ctEsc(o.assunto)}"><label>Situação</label><select class="ct-select" data-ct-dec-field="situacao">${['proposta','pendente','homologada'].map(v=>`<option ${o.situacao===v?'selected':''} value="${v}">${v}</option>`).join('')}</select><label>Decisão / orientação</label><textarea class="ct-textarea" data-ct-dec-field="decisao">${ctEsc(o.decisao)}</textarea><label>Impacto</label><input class="ct-input" data-ct-dec-field="impacto" value="${ctEsc(o.impacto)}"><div class="ct-card-actions"><button class="btn sm ct-delete" data-ct-remove-dec="${i}">Remover</button></div></div>`).join('');}
function ctSelectedArea(){return ctState.doc?.areas.find(a=>a.id===ctState.area) || ctState.doc?.areas[0]}
function ctRenderAreas(){const areas=ctState.doc.areas,a=ctSelectedArea();if(!a)return;ctState.area=a.id;
 ctId('ctAreasNav').innerHTML=areas.map(x=>`<button class="ct-area-btn ${a.id===x.id?'active':''}" data-ct-area="${ctEsc(x.id)}">${ctEsc(x.titulo)}<span>${x.campos.length} campos · ${ctEsc(x.situacao)}</span></button>`).join('')+'<button class="btn sm" id="ctAddArea" type="button">+ Nova área</button>';
 ctId('ctAreaForm').innerHTML=`<h3>${ctEsc(a.titulo)}</h3><p>Edite a responsabilidade do módulo. O contrato não modifica a implementação existente.</p><div class="ct-grid"><div><label class="ct-input-label">Título</label><input class="ct-input" data-ct-area-field="titulo" value="${ctEsc(a.titulo)}"></div><div><label class="ct-input-label">Situação</label><select class="ct-select" data-ct-area-field="situacao">${['proposto','em_revisao','homologado'].map(x=>`<option ${x===a.situacao?'selected':''} value="${x}">${x}</option>`).join('')}</select></div></div><label class="ct-input-label">Objetivo</label><textarea class="ct-textarea" data-ct-area-field="objetivo">${ctEsc(a.objetivo)}</textarea><label class="ct-input-label">Fonte dos dados a que se refere</label><input class="ct-input" data-ct-area-field="fonte" value="${ctEsc(a.fonte)}">`;
 ctId('ctCampoLista').innerHTML=a.campos.map((c,i)=>`<button class="ct-field-pill ${ctState.campo===i?'active':''}" data-ct-field="${i}" title="${ctEsc(c.finalidade)}">${ctEsc(c.campo)}</button>`).join('');
 const c=a.campos[ctState.campo];ctId('ctCampoEditor').innerHTML=!c?'<span class="ct-small">Selecione ou adicione um campo.</span>':`<div class="ct-field-row"><div><label class="ct-input-label">Campo / caminho</label><input class="ct-input" data-ct-campo="campo" value="${ctEsc(c.campo)}"></div><div><label class="ct-input-label">Exigência</label><select class="ct-select" data-ct-campo="exigencia">${['obrigatorio','opcional','condicional'].map(v=>`<option ${c.exigencia===v?'selected':''} value="${v}">${v}</option>`).join('')}</select></div><div><label class="ct-input-label">Situação</label><select class="ct-select" data-ct-campo="situacao">${['existente','proposto','em_revisao','pendente'].map(v=>`<option ${c.situacao===v?'selected':''} value="${v}">${v}</option>`).join('')}</select></div></div><label class="ct-input-label">Finalidade</label><textarea class="ct-textarea" data-ct-campo="finalidade">${ctEsc(c.finalidade)}</textarea><label class="ct-input-label">Regra / observação</label><textarea class="ct-textarea" data-ct-campo="regra">${ctEsc(c.regra)}</textarea><div class="ct-controls"><button class="btn sm ct-delete" id="ctRemoveCampo">Remover este campo</button></div>`;
 const arrKeys=[['regras','Regras e invariantes'],['pendencias','Pendências de definição'],['criteriosAceite','Critérios de aceite']];ctId('ctAreaLists').innerHTML=`<div class="ct-section-head"><h3>Orientações por área</h3></div><div class="ct-list-grid">${arrKeys.map(([key,name])=>`<div><label class="ct-input-label">${name} · uma por linha</label><textarea class="ct-textarea rows" data-ct-list="${key}">${ctEsc(a[key].join('\n'))}</textarea></div>`).join('')}</div>`;
}
function ctAddArea(){
 const id=prompt('Identificador da nova área de contrato (ex.: notificacoes)');if(id===null)return;
 const normalized=String(id).trim().toLowerCase();
 if(!/^[a-z][a-z0-9_-]*$/.test(normalized)||ctState.doc.areas.some(a=>a.id===normalized)){ctNotice('ID de área inválido ou já utilizado.','error');return;}
 const name=prompt('Nome da nova área',normalized);if(name===null)return;
 ctState.doc.areas.push({id:normalized,titulo:String(name).trim()||normalized,situacao:'proposto',objetivo:'Descrever objetivo desta área.',fonte:'A definir',campos:[],regras:[],pendencias:[],criteriosAceite:[]});
 ctState.area=normalized;ctState.campo=0;ctDirty();contratoRender();
}
function ctAddObjective(){const ids=new Set(ctState.doc.objetivos.map(o=>o.id));let i=1;while(ids.has('O'+String(i).padStart(2,'0')))i++;ctState.doc.objetivos.push({id:'O'+String(i).padStart(2,'0'),titulo:'Novo objetivo',descricao:'Descrever o objetivo.'});ctDirty();contratoRender();}
function ctAddDecision(){const ids=new Set(ctState.doc.decisoes.map(o=>o.id));let i=1;while(ids.has('D'+String(i).padStart(2,'0')))i++;ctState.doc.decisoes.push({id:'D'+String(i).padStart(2,'0'),assunto:'Nova decisão',decisao:'Proposta a definir.',situacao:'pendente',impacto:''});ctDirty();contratoRender();}
function ctAddField(){const a=ctSelectedArea();let i=1;const ids=new Set(a.campos.map(c=>c.campo));while(ids.has('novo.campo_'+i))i++;a.campos.push({campo:'novo.campo_'+i,finalidade:'Definir finalidade',exigencia:'opcional',situacao:'proposto',regra:''});ctState.campo=a.campos.length-1;ctDirty();contratoRender();}
function ctNewTab(tab){if(ctState.tab==='json'&&ctState.jsonPending&&!confirm('Há uma edição não aplicada no código JSON. Descartá-la para mudar de seção?'))return;ctState.jsonPending=false;ctState.tab=tab;contratoRender();}
function ctApplyJSON(){try{const doc=JSON.parse(ctId('ctJson').value);ctValidate(doc);ctState.doc=ctClone(doc);ctState.area=doc.areas[0]?.id||'';ctState.campo=0;ctState.jsonPending=false;ctDirty();contratoRender();ctNotice('JSON exclusivo validado e aplicado ao rascunho; use Salvar no disco para persistir.','ok');}catch(e){ctNotice('Não aplicado: '+e.message,'error')}}
async function ctExport(){if(!ctState.doc)return;downloadText('ADVOGADOJA_CONTRATO_WORKSPACE.json',JSON.stringify(ctState.doc,null,2)+'\n');ctNotice('Exportado somente o documento deste módulo.','ok')}
async function ctImport(file){if(!file)return;try{const doc=JSON.parse(await file.text());ctValidate(doc);if(!confirm('Substituir o rascunho atual pelo JSON importado? Nenhuma tela ou componente do catálogo será alterado.'))return;ctState.doc=ctClone(doc);ctState.area=doc.areas[0]?.id||'';ctState.campo=0;ctState.jsonPending=false;ctDirty();contratoRender();ctNotice('Contrato importado para o módulo. Salve no disco para persistir; nenhuma tela foi alterada.','ok');}catch(e){ctNotice('Importação rejeitada: '+e.message,'error')}}
async function ctLoad(){
 let data,readonly=false;
 try{const r=await fetch('/api/contrato',{cache:'no-store'});if(!r.ok)throw Error('API não disponível');data=await r.json();if(!data.doc)throw Error('Resposta inesperada');ctState.version=data.version;}
 catch(e){readonly=true;try{const r=await fetch('modulo_contrato/data/contrato_workspace.json');if(!r.ok)throw Error('JSON não encontrado');data={doc:await r.json()};}catch(e2){ctNotice('Não foi possível abrir o JSON do módulo. Abra com python iniciar.py.','error');ctId('ctStatus').textContent='Sem dados';return;}}
 try{ctValidate(data.doc);ctState.doc=data.doc;ctState.original=ctClone(data.doc);ctState.dirty=false;ctState.readOnly=readonly;ctState.area=data.doc.areas[0]?.id||'';contratoRender();ctNotice(readonly?'Modo leitura: exporte ou inicie o servidor Python para salvar.':'Documento de contrato carregado separadamente do catálogo.','ok');}catch(e){ctNotice('Erro de validação do contrato salvo: '+e.message,'error')}
}
async function ctSave(){
 if(!ctState.doc || ctState.readOnly)return;
 if(ctState.tab==='json'&&ctState.jsonPending){ctNotice('Aplique ou descarte primeiro a edição do código JSON.','error');return;}
 try{ctValidate(ctState.doc);ctId('ctSaveBtn').disabled=true;const snapshot=ctClone(ctState.doc);const r=await fetch('/api/contrato/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({doc:snapshot,expected:ctState.version})});const out=await r.json();if(!r.ok)throw Error((r.status===409?'Conflito de versão: ':'')+(out.error||'Erro de gravação'));ctState.version=out.version;ctState.original=snapshot;ctState.dirty=JSON.stringify(snapshot)!==JSON.stringify(ctState.doc);ctStatus();ctNotice(ctState.dirty?'Versão anterior salva; existem edições posteriores ainda não gravadas.':'Contrato salvo exclusivamente em modulo_contrato/data/contrato_workspace.json.','ok');}
 catch(e){ctNotice('Não salvo: '+e.message,'error');ctStatus();}
}
function contratoModuloInit(){
 for(const button of document.querySelectorAll('[data-ct-tab]'))button.addEventListener('click',()=>ctNewTab(button.dataset.ctTab));
 ctId('ctImportBtn').onclick=()=>ctId('ctImportFile').click();ctId('ctImportFile').onchange=async e=>{await ctImport(e.target.files?.[0]);e.target.value='';};
 ctId('ctExportBtn').onclick=ctExport;ctId('ctSaveBtn').onclick=ctSave;
 ctId('ctAddObjetivo').onclick=ctAddObjective;ctId('ctAddDecisao').onclick=ctAddDecision;ctId('ctAddCampo').onclick=ctAddField;
 ctId('ctFormatJson').onclick=()=>{try{ctId('ctJson').value=JSON.stringify(JSON.parse(ctId('ctJson').value),null,2);ctNotice('JSON formatado. Ainda não aplicado.','ok')}catch(e){ctNotice('Erro JSON: '+e.message,'error')}};
 ctId('ctApplyJson').onclick=ctApplyJSON;ctId('ctRevertJson').onclick=()=>{ctState.jsonPending=false;ctId('ctJson').value=JSON.stringify(ctState.doc,null,2);ctNotice('Edição do código descartada.','ok')};ctId('ctJson').oninput=()=>{ctState.jsonPending=true;ctNotice('Edição do código pendente; valide e aplique antes de salvar.');};
 ctId('ctAreasNav').onclick=e=>{if(e.target.closest('#ctAddArea')){ctAddArea();return;}const b=e.target.closest('[data-ct-area]');if(!b)return;ctState.area=b.dataset.ctArea;ctState.campo=0;contratoRender();};
 ctId('ctCampoLista').onclick=e=>{const b=e.target.closest('[data-ct-field]');if(!b)return;ctState.campo=Number(b.dataset.ctField);contratoRender()};
 ctId('ctObjetivos').addEventListener('input',e=>{const f=e.target.dataset.ctObjField,c=e.target.closest('[data-ct-obj]');if(!f||!c)return;ctState.doc.objetivos[Number(c.dataset.ctObj)][f]=e.target.value;ctDirty()});
 ctId('ctObjetivos').addEventListener('click',e=>{const b=e.target.closest('[data-ct-remove-obj]');if(!b||!confirm('Remover este objetivo do rascunho?'))return;ctState.doc.objetivos.splice(Number(b.dataset.ctRemoveObj),1);ctDirty();contratoRender()});
 ctId('ctDecisoes').addEventListener('input',ctDecisionChange);ctId('ctDecisoes').addEventListener('change',ctDecisionChange);
 ctId('ctDecisoes').addEventListener('click',e=>{const b=e.target.closest('[data-ct-remove-dec]');if(!b||!confirm('Remover esta decisão?'))return;ctState.doc.decisoes.splice(Number(b.dataset.ctRemoveDec),1);ctDirty();contratoRender()});
 function ctDecisionChange(e){const field=e.target.dataset.ctDecField,p=e.target.closest('[data-ct-decision]');if(!field||!p)return;ctState.doc.decisoes[Number(p.dataset.ctDecision)][field]=e.target.value;ctDirty()}
 function areaChange(e){const field=e.target.dataset.ctAreaField;if(!field)return;ctSelectedArea()[field]=e.target.value;ctDirty();}
 ctId('ctAreaForm').addEventListener('input',areaChange);ctId('ctAreaForm').addEventListener('change',areaChange);
 function fieldChange(e){const key=e.target.dataset.ctCampo;if(!key)return;ctSelectedArea().campos[ctState.campo][key]=e.target.value;ctDirty()}
 ctId('ctCampoEditor').addEventListener('input',fieldChange);ctId('ctCampoEditor').addEventListener('change',fieldChange);
 ctId('ctCampoEditor').onclick=e=>{if(e.target.id!=='ctRemoveCampo'||!confirm('Remover a definição desse campo?'))return;ctSelectedArea().campos.splice(ctState.campo,1);ctState.campo=Math.min(ctState.campo,ctSelectedArea().campos.length-1);ctDirty();contratoRender()};
 ctId('ctAreaLists').addEventListener('input',e=>{const key=e.target.dataset.ctList;if(!key)return;ctSelectedArea()[key]=e.target.value.split('\n').map(x=>x.trim()).filter(Boolean);ctDirty()});
 window.addEventListener('beforeunload',e=>{if(ctState.dirty){e.preventDefault();e.returnValue='Contrato possui alterações não salvas.'}});
 ctLoad();
}
