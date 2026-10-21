/* ===================================================================
  ADVOGADO JÁ | PLANEJAMENTO V1 · MOTOR DE DADOS
  01 Contratos e estado | 02 CSV | 03 Leitura/validação | 04 UI
  05 Edição | 06 Importação/exportação | 07 Inicialização
  ATENÇÃO: o navegador não grava arquivos no GitHub.
  Fonte JSON: ./planejamento.json | Fonte CSV: ./registros.csv
=================================================================== */
(() => {
  'use strict';
  // 01 | CONTRATOS E ESTADO
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cols = ['id','tipo','titulo','descricao','jornada','etapa_id','artefatos','status','prioridade','origem','criado_em','atualizado_em','observacoes'];
  const typeLabels = {decisao:'Decisão',proposta:'Proposta',pergunta:'Pergunta',ideia:'Ideia',requisito:'Requisito',risco:'Risco',referencia:'Referência'};
  const statusLabels = {confirmado:'Confirmado',proposto:'Proposto',a_analisar:'A analisar',em_entrevista:'Em entrevista',em_execucao:'Em execução',concluido:'Concluído',descartado:'Descartado'};
  const stepLabels = {nao_iniciado:'Não iniciado',em_andamento:'Em andamento',concluido:'Concluído',bloqueado:'Bloqueado'};
  const priorityLabels = {critica:'Crítica',alta:'Alta',media:'Média',baixa:'Baixa'};
  const journeyLabels = {geral:'Geral',cliente:'Cliente',advogado:'Advogado',administrador:'Administrador'};
  const state = {plan:null,records:[],loadedPlan:false,loadedCsv:false,dirtyPlan:false,dirtyCsv:false,view:'visao',visible:40,editingId:null};
  const nowDate = () => new Date().toISOString().slice(0,10);
  const allSteps = () => (state.plan?.fases || []).flatMap(p => p.etapas || []);
  const isUnsaved = () => state.dirtyPlan || state.dirtyCsv;
  const getStep = id => allSteps().find(s => s.id === id);
  const defaultRecord = () => Object.fromEntries(cols.map(k => [k,'']));
  // 02 | CSV ROBUSTO: citação dupla, quebras de linha e BOM
  function detectDelimiter(line) {
    let quoted = false, semi = 0, comma = 0;
    for (let i=0; i<line.length; i++) { if (line[i]==='"') { if(quoted && line[i+1]==='"') i++; else quoted=!quoted; } else if(!quoted && line[i]===';') semi++; else if(!quoted && line[i]===',') comma++; }
    return semi >= comma ? ';' : ',';
  }
  function parseCsv(input) {
    const source = String(input).replace(/^\uFEFF/,'');
    const delim = detectDelimiter(source.split(/\r?\n/)[0] || '');
    const rows=[]; let row=[],cell='',quotes=false;
    for(let i=0;i<source.length;i++) {
      const c=source[i];
      if(c==='"') {if(quotes && source[i+1]==='"'){cell+='"';i++;} else quotes=!quotes;}
      else if(c===delim && !quotes){row.push(cell);cell='';}
      else if((c==='\n'||c==='\r')&&!quotes){if(c==='\r'&&source[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()!==''))rows.push(row);row=[];cell='';}
      else cell+=c;
    }
    if(quotes)throw Error('CSV possui aspas não fechadas.');
    row.push(cell);if(row.some(v=>v.trim()!==''))rows.push(row);
    if(!rows.length)throw Error('CSV vazio.');
    const headers=rows.shift().map(x=>x.trim().replace(/^\uFEFF/,''));
    const missing=cols.filter(x=>!headers.includes(x));
    if(missing.length)throw Error('CSV sem as colunas obrigatórias: '+missing.join(', '));
    return rows.map((vals,n)=>{
      const r=defaultRecord();headers.forEach((key,i)=>{if(cols.includes(key))r[key]=vals[i]??'';});
      if(!r.id||!r.titulo)throw Error(`CSV linha ${n+2}: ID ou título ausente.`);
      return r;
    });
  }
  function csvCell(val){const s=String(val??'');return /[;"\n\r]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
  function makeCsv(records){return '\uFEFF'+[cols.join(';'),...records.map(r=>cols.map(c=>csvCell(r[c])).join(';'))].join('\r\n')+'\r\n';}
  // 03 | VALIDAÇÃO: formatos, unicidade e ligações
  function validatePlan(plan){
    if(!plan||plan.schema!=='advogadoja.planejamento.v1'||!Array.isArray(plan.fases)||!Array.isArray(plan.jornadas)) throw Error('JSON de planejamento incompatível: esperado schema advogadoja.planejamento.v1.');
    if(!plan.fases.length)throw Error('O JSON precisa conter fases.');
    const ids = new Set();
    for(const p of plan.fases){if(!p.id||!Array.isArray(p.etapas))throw Error('Fase incompleta: '+(p.id||'?'));
      for(const s of p.etapas){if(!s.id||!s.titulo||!Object.hasOwn(stepLabels,s.status))throw Error('Etapa inválida: '+(s.id||'?'));if(ids.has(s.id))throw Error('ID de etapa duplicado: '+s.id);ids.add(s.id);}
    }
    const js=new Set();for(const j of plan.jornadas){if(!j.id||!j.nome||js.has(j.id))throw Error('Jornada inválida/duplicada: '+(j.id||'?'));js.add(j.id);}
    return plan;
  }
  function validateRecords(records,plan=state.plan){
    if(!Array.isArray(records))throw Error('Registros devem estar em uma lista.');
    const ids=new Set(),stepIds=new Set((plan?.fases||[]).flatMap(p=>p.etapas.map(s=>s.id)));
    for(const r of records){if(!r||!r.id||!r.titulo||!r.descricao)throw Error('Registro sem ID, título ou descrição: '+(r?.id||'?'));
      if(ids.has(r.id))throw Error('ID de registro duplicado: '+r.id);ids.add(r.id);
      if(!Object.hasOwn(typeLabels,r.tipo))throw Error('Tipo inválido em '+r.id+': '+r.tipo);
      if(!Object.hasOwn(statusLabels,r.status))throw Error('Estado inválido em '+r.id+': '+r.status);
      if(!Object.hasOwn(priorityLabels,r.prioridade))throw Error('Prioridade inválida em '+r.id);
      if(!Object.hasOwn(journeyLabels,r.jornada))throw Error('Jornada inválida em '+r.id);
      if(plan && r.etapa_id && !stepIds.has(r.etapa_id))throw Error('Etapa '+r.etapa_id+' não existe no planejamento ('+r.id+').');
    }
    return records.map(r=>Object.fromEntries(cols.map(c=>[c,String(r[c]??'')])));
  }
  function notify(text,kind='info'){$('banner').textContent=text;$('banner').className='banner'+(kind==='error'?' error':'');}
  function clearNotice(){$('banner').classList.add('hidden');}
  function setStatus(){const badge=$('fileStatus');badge.className='file-status'+(isUnsaved()?' dirty':state.loadedPlan&&state.loadedCsv?' ok':' warn');
    badge.innerHTML='<span class="status-dot"></span> '+(isUnsaved()?'Edições não exportadas':state.loadedPlan&&state.loadedCsv?'Arquivos carregados':'Importação necessária');
    $('sourceDetails').textContent=`JSON: ${state.loadedPlan?'lido':'não carregado'} · CSV: ${state.loadedCsv?'lido':'não carregado'}${isUnsaved()?' · existem alterações em memória':''}`;
  }
  async function loadFiles(force=false){
    if(force&&isUnsaved()&&!confirm('Há alterações não exportadas. Descartá-las e recarregar os arquivos do servidor?'))return;
    clearNotice();let msgs=[];
    try {const res=await fetch('planejamento.json',{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);const plan=validatePlan(await res.json());state.plan=plan;state.loadedPlan=true;state.dirtyPlan=false;}
    catch(e){state.loadedPlan=false;state.plan=null;msgs.push('Não foi possível ler planejamento.json ('+e.message+').');}
    try {const res=await fetch('registros.csv',{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);const rec=parseCsv(await res.text());state.records=validateRecords(rec,state.plan);state.loadedCsv=true;state.dirtyCsv=false;}
    catch(e){state.loadedCsv=false;state.records=[];msgs.push('Não foi possível ler registros.csv ('+e.message+').');}
    if(msgs.length)notify(msgs.join(' ')+' Use Importar JSON / CSV ou execute por HTTP.','error');
    renderAll();
  }
  // 04 | RENDERIZAÇÃO: todas as visões usam exatamente o estado validado
  function metric(id,value){$(id).textContent=String(value);}
  function renderMetrics(){const steps=allSteps();metric('metricSteps',steps.length);metric('metricRecords',state.records.length);metric('metricDecisions',state.records.filter(x=>x.status==='confirmado').length);metric('metricPending',state.records.filter(x=>['a_analisar','em_entrevista','proposto'].includes(x.status)).length);$('recordsPill').textContent=state.records.length;
    $('metricStepsSub').textContent=steps.filter(x=>x.status==='concluido').length+' etapas concluídas';$('metricRecordsSub').textContent=state.records.filter(x=>x.tipo==='ideia').length+' ideias capturadas';}
  function renderJourneys(){$('journeys').innerHTML=(state.plan?.jornadas||[]).slice().sort((a,b)=>a.ordem-b.ordem).map(j=>`<div class="journey-card"><div class="journey-top"><span class="journey-num">${esc(j.ordem)}</span><h3>${esc(j.nome)}</h3><span class="muted-chip">${esc(j.status||'planejada')}</span></div><p>${esc(j.nota||'')}</p></div>`).join('')||'<div class="empty-state">Carregue o JSON para exibir as jornadas.</div>';}
  function renderOverview(){const phases=state.plan?.fases||[];
    $('phasesOverview').innerHTML=phases.map(p=>{const done=p.etapas.filter(x=>x.status==='concluido').length,n=p.etapas.length;return `<div class="mini-phase"><div class="mini-head"><strong>${esc(p.id)} · ${esc(p.titulo)}</strong><span>${done}/${n} concluídas</span></div><div class="progress"><div style="width:${n?Math.round(done/n*100):0}%"></div></div></div>`}).join('')||'<p>Nenhuma fase carregada.</p>';
    const pend=state.records.filter(r=>['a_analisar','em_entrevista','proposto'].includes(r.status)).slice(0,6);
    $('pendingOverview').innerHTML=pend.map(r=>`<div class="pending-entry"><b>${esc(r.titulo)}</b><span>${esc(r.id)} · ${esc(statusLabels[r.status])} · ${esc(journeyLabels[r.jornada]||r.jornada)}</span></div>`).join('')||'<p>Não há pendências nos registros carregados.</p>';
  }
  function stepOption(value,label,current){return `<option value="${esc(value)}" ${current===value?'selected':''}>${esc(label)}</option>`;}
  function renderSteps(){const filter=$('stepFilter').value;
    $('phases').innerHTML=(state.plan?.fases||[]).map((p,i)=>{
      const items=p.etapas.filter(s=>!filter||s.status===filter);
      if(!items.length)return '';
      return `<details class="phase-block" ${i===0||filter?'open':''}><summary><div class="phase-head"><strong>${esc(p.id)} · ${esc(p.titulo)}</strong><small>${esc(p.objetivo)}</small></div><div class="phase-meta">${p.etapas.filter(s=>s.status==='concluido').length}/${p.etapas.length} concluídas</div></summary><div class="phase-body">${items.map(s=>`<div class="step-row"><span class="step-id">${esc(s.id)}</span><div class="step-content"><strong>${esc(s.titulo)}</strong>${s.observacoes?`<small style="display:block;color:#68819b;margin-top:4px">${esc(s.observacoes)}</small>`:''}</div><select class="step-status" data-step="${esc(s.id)}" aria-label="Estado da etapa ${esc(s.id)}">${Object.entries(stepLabels).map(([v,l])=>stepOption(v,l,s.status)).join('')}</select></div>`).join('')}</div></details>`;
    }).join('')||'<div class="empty-state">Nenhuma etapa corresponde ao filtro.</div>';
  }
  function fillSelect(id,choices){const current=$(id).value;$(id).innerHTML='<option value="">Todos</option>'+Object.entries(choices).map(([k,v])=>`<option value="${esc(k)}">${esc(v)}</option>`).join('');$(id).value=current;}
  function filteredRecords(){const q=$('recordSearch').value.trim().toLocaleLowerCase('pt-BR'),j=$('journeyFilter').value,t=$('typeFilter').value,s=$('statusFilter').value;
    return state.records.filter(r=>(!j||r.jornada===j)&&(!t||r.tipo===t)&&(!s||r.status===s)&&(!q||[r.id,r.titulo,r.descricao,r.etapa_id,r.artefatos,r.observacoes,r.origem].join(' ').toLocaleLowerCase('pt-BR').includes(q)));
  }
  function renderRecords(){const recs=filteredRecords();$('registerSummary').textContent=`${recs.length} registro(s) encontrados · ${state.records.length} no total`;
    $('registerList').innerHTML=recs.slice(0,state.visible).map(r=>`<article class="record-card"><div class="record-top"><span class="record-id">${esc(r.id)}</span><span class="chip">${esc(typeLabels[r.tipo]||r.tipo)}</span><span class="chip ${esc(r.status)}">${esc(statusLabels[r.status]||r.status)}</span></div><h3>${esc(r.titulo)}</h3><p>${esc(r.descricao)}</p>${r.observacoes?`<p><strong>Observações: </strong>${esc(r.observacoes)}</p>`:''}<div class="record-foot"><span class="meta">${esc(journeyLabels[r.jornada]||r.jornada)} · ${esc(r.etapa_id||'Sem etapa')} · ${esc(priorityLabels[r.prioridade]||r.prioridade)}</span><div class="record-actions"><button type="button" class="small-btn" data-edit="${esc(r.id)}">Editar</button><button type="button" class="small-btn" data-remove="${esc(r.id)}" title="Marca como descartado, preservando o histórico">Descartar</button></div></div></article>`).join('')||'<div class="empty-state">Nenhum registro encontrado. Ajuste os filtros ou crie um novo registro.</div>';
    $('showMore').classList.toggle('hidden',recs.length<=state.visible);
  }
  function renderRules(){$('rules').innerHTML=(state.plan?.regras||[]).map(r=>'<div>'+esc(r)+'</div>').join('')||'<p>Regras carregadas do JSON.</p>';}
  function renderAll(){renderMetrics();renderJourneys();renderOverview();renderSteps();renderRecords();renderRules();setStatus();}
  function switchView(view){state.view=view;document.querySelectorAll('.view-tab').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-selected',String(b.dataset.view===view));});document.querySelectorAll('.view').forEach(e=>e.classList.toggle('active',e.dataset.viewPanel===view));}
  // 05 | EDIÇÃO: não gravar em disco sem exportação explícita
  function nextId(){let max=0;for(const r of state.records){const m=/^REG-(\d+)$/.exec(r.id);if(m)max=Math.max(max,Number(m[1]));}return 'REG-'+String(max+1).padStart(4,'0');}
  function formOptions(id,dict){$(id).innerHTML=Object.entries(dict).map(([k,v])=>`<option value="${esc(k)}">${esc(v)}</option>`).join('');}
  function openEditor(id=null){if(!state.loadedCsv){notify('Importe registros.csv antes de editar.','error');return;}
    state.editingId=id;const record=id?state.records.find(r=>r.id===id):null;if(id&&!record){notify('Registro não encontrado.','error');return;}
    const r=record||{...defaultRecord(),id:nextId(),tipo:'ideia',jornada:'geral',status:'a_analisar',prioridade:'media',origem:'Conversa com usuário',criado_em:nowDate(),atualizado_em:nowDate()};
    $('dialogTitle').textContent=record?'Editar '+r.id:'Novo registro';const form=$('recordForm');for(const k of cols){const el=form.elements.namedItem(k);if(el)el.value=r[k]||'';}
    $('recordDialog').showModal();setTimeout(()=>form.elements.namedItem('titulo').focus(),0);
  }
  function saveEditor(ev){ev.preventDefault();const form=$('recordForm'),data=defaultRecord();for(const k of cols){const el=form.elements.namedItem(k);if(el)data[k]=el.value.trim();}
    if(!data.titulo||!data.descricao){alert('Preencha título e descrição.');return;}
    if(data.status==='confirmado'&&data.tipo!=='pergunta'&&!(state.editingId&&state.records.find(r=>r.id===state.editingId)?.status==='confirmado')){
      if(!confirm('Você está marcando como CONFIRMADO. Existe uma decisão explícita do usuário que justifica isso?'))return;
    }
    const before=state.records.slice();data.criado_em=before.find(r=>r.id===data.id)?.criado_em||nowDate();data.atualizado_em=nowDate();
    const next=state.editingId?before.map(r=>r.id===data.id?data:r):[...before,data];
    try{state.records=validateRecords(next);}catch(e){alert(e.message);return;}
    state.dirtyCsv=true;$('recordDialog').close();renderAll();switchView('registros');notify('Registro salvo em memória. Exporte o CSV para que esta mudança não se perca.');
  }
  function discardRecord(id){const r=state.records.find(x=>x.id===id);if(!r)return;if(!confirm('Marcar '+id+' como Descartado? O registro será preservado para auditoria.'))return;r.status='descartado';r.atualizado_em=nowDate();state.dirtyCsv=true;renderAll();notify(id+' marcado como descartado. Exporte o CSV para salvar.');}
  // 06 | IMPORTAÇÃO / EXPORTAÇÃO: o formato original é mantido
  function download(name,content,mime){const blob=new Blob([content],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);}
  function exportJson(){if(!state.plan)return notify('Carregue ou importe planejamento.json antes de exportar.','error');download('planejamento.json',JSON.stringify({...state.plan,atualizado_em:nowDate()},null,2)+'\n','application/json;charset=utf-8');state.dirtyPlan=false;setStatus();notify('JSON exportado. Substitua planejamento/planejamento.json no repositório para persistir.');}
  function exportCsv(){if(!state.loadedCsv)return notify('Carregue ou importe registros.csv antes de exportar.','error');download('registros.csv',makeCsv(state.records),'text/csv;charset=utf-8');state.dirtyCsv=false;setStatus();notify('CSV exportado. Substitua planejamento/registros.csv no repositório para persistir.');}
  function exportSnapshot(){if(!state.plan||!state.loadedCsv)return notify('Carregue JSON e CSV antes de exportar o snapshot.','error');const snap={schema:'advogadoja.planejamento.snapshot.v1',exportado_em:new Date().toISOString(),planejamento:state.plan,registros:state.records};download('snapshot-planejamento.json',JSON.stringify(snap,null,2)+'\n','application/json;charset=utf-8');notify('Snapshot completo exportado. Ele é backup/intercâmbio, não substitui diretamente planejamento.json.');}
  async function importJsonFile(file){try{const raw=JSON.parse(await file.text());let plan,records=null;
      if(raw.schema==='advogadoja.planejamento.snapshot.v1'){plan=validatePlan(raw.planejamento);records=validateRecords(raw.registros,plan);}
      else plan=validatePlan(raw);
      if(!confirm(records?'Importar snapshot? Isso substituirá o JSON e todos os registros CSV na memória.':'Importar planejamento.json? Isso substituirá as etapas e jornadas na memória.'))return;
      if(records===null&&state.loadedCsv)validateRecords(state.records,plan);
      state.plan=plan;state.loadedPlan=true;state.dirtyPlan=true;
      if(records!==null){state.records=records;state.loadedCsv=true;state.dirtyCsv=true;}
      renderAll();notify(records?'Snapshot importado. Exporte JSON e CSV para manter os dois arquivos sincronizados.':'JSON importado. Exporte planejamento.json para salvar no repositório.');
    }catch(e){notify('Falha na importação JSON: '+e.message,'error');}
  }
  async function importCsvFile(file){try{const recs=validateRecords(parseCsv(await file.text()));if(!confirm('Substituir os '+state.records.length+' registros atuais por '+recs.length+' registros do CSV? Faça exportação primeiro se precisar preservar a versão atual.'))return;state.records=recs;state.loadedCsv=true;state.dirtyCsv=true;renderAll();notify('CSV importado. Exporte registros.csv para persistir no GitHub.');}catch(e){notify('Falha na importação CSV: '+e.message,'error');}}
  // 07 | EVENTOS E INICIALIZAÇÃO
  $('refresh').addEventListener('click',()=>loadFiles(true));
  $('importJson').addEventListener('click',()=>$('jsonPicker').click());$('importCsv').addEventListener('click',()=>$('csvPicker').click());
  $('jsonPicker').addEventListener('change',e=>{if(e.target.files[0])importJsonFile(e.target.files[0]);e.target.value='';});
  $('csvPicker').addEventListener('change',e=>{if(e.target.files[0])importCsvFile(e.target.files[0]);e.target.value='';});
  $('exportJson').addEventListener('click',exportJson);$('exportCsv').addEventListener('click',exportCsv);$('exportSnapshot').addEventListener('click',exportSnapshot);
  document.querySelectorAll('.view-tab').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
  document.querySelectorAll('[data-switch]').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.switch)));
  $('stepFilter').addEventListener('change',renderSteps);
  $('phases').addEventListener('change',e=>{const id=e.target.dataset.step,s=getStep(id);if(!s||!Object.hasOwn(stepLabels,e.target.value))return;s.status=e.target.value;state.dirtyPlan=true;renderAll();switchView('roteiro');notify('Estado de '+id+' alterado em memória. Exporte planejamento.json para salvar.');});
  const recordControls=['recordSearch','journeyFilter','typeFilter','statusFilter'];recordControls.forEach(id=>$(id).addEventListener('input',()=>{state.visible=40;renderRecords();}));
  $('showMore').addEventListener('click',()=>{state.visible+=40;renderRecords();});
  $('registerList').addEventListener('click',e=>{const ed=e.target.closest('[data-edit]'),rm=e.target.closest('[data-remove]');if(ed)openEditor(ed.dataset.edit);if(rm)discardRecord(rm.dataset.remove);});
  $('addRecord').addEventListener('click',()=>openEditor());$('addRecordTop').addEventListener('click',()=>openEditor());
  $('closeDialog').addEventListener('click',()=>$('recordDialog').close());$('cancelDialog').addEventListener('click',()=>$('recordDialog').close());$('recordForm').addEventListener('submit',saveEditor);
  window.addEventListener('beforeunload',e=>{if(isUnsaved()){e.preventDefault();e.returnValue='';}});
  formOptions('fieldTipo',typeLabels);formOptions('fieldStatus',statusLabels);formOptions('fieldPriority',priorityLabels);fillSelect('typeFilter',typeLabels);fillSelect('statusFilter',statusLabels);
  // Atualiza lista de etapas no seletor após qualquer carregamento.
  const origRender=renderAll;renderAll=function(){origRender();const chosen=$('fieldEtapa').value;$('fieldEtapa').innerHTML='<option value="">Sem etapa específica</option>'+allSteps().map(s=>`<option value="${esc(s.id)}">${esc(s.id)} · ${esc(s.titulo)}</option>`).join('');$('fieldEtapa').value=chosen;};
  loadFiles();
})();
