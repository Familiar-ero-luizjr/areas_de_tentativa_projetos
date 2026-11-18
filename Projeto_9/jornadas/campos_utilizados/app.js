/* AdvogadoJá — Home Advogado / consulta do contrato mínimo */
'use strict';
let doc=null, fields=[], refs=[], selection='', activeComponent='';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=String(txt);return e}
function clear(e){e.replaceChildren()}
function short(v){if(v===null)return 'null';if(typeof v==='string')return v;if(typeof v==='object')return JSON.stringify(v,null,2);return String(v)}
function f(group,label,path,value,desc){fields.push({group,label,path,value,desc})}
function ref(type,source,target,detail){refs.push({type,source,target,detail})}
function digest(d){doc=d; fields=[]; refs=[];selection='';activeComponent='';
 if(!d||!d.tela||!d.componentes)throw Error('O JSON precisa conter "tela" e "componentes".');
 const t=d.tela, id=t.identidade||{},cl=t.classificacao||{},s=t.estrutura||{},h=s.html||{},css=s.css||{},nav=t.navegacao||{};
 for(const [label,k,desc] of [['Schema','schema','Tipo do contrato'],['Versão','schemaVersion','Versão do schema']])if(t[k]!==undefined)f('Contrato',label,'tela.'+k,t[k],desc);
 for(const [label,k,desc] of [['ID da tela','id','Identificador único'],['Tipo','tipo','Tipo do item'],['Namespace','namespace','Domínio da tela'],['Nome exibido','nome','Nome da Home Advogado']])if(id[k]!==undefined)f('Identidade',label,'tela.identidade.'+k,id[k],desc);
 for(const [label,k,desc] of [['Escopo','escopo','Escopo da tela'],['Reutilizável','reutilizavel','Sinaliza reutilização']])if(k in cl)f('Classificação',label,'tela.classificacao.'+k,cl[k],desc);
 if(h.raizRef!==undefined)f('Estrutura', 'Raiz da composição','tela.estrutura.html.raizRef',h.raizRef,'Referência do nó principal da Home');
 for(const [key,v] of Object.entries(h.composicao||{})){const base='tela.estrutura.html.composicao.'+key;
  for(const [label,k] of [['Componente','componenteRef'],['Pai','paiRef'],['Slot','slot'],['Ordem','ordem']])if(k in v)f('Composição · '+key,label,base+'.'+k,v[k],'Campo explícito do bloco '+key);
  if(v.componenteRef)ref('Composição',key,v.componenteRef, 'slot: '+(v.slot??'—')+' · ordem: '+(v.ordem??'—'));
 }
 for(const [key,val] of Object.entries(css.tokens||{}))f('Estilo · tokens',key,'tela.estrutura.css.tokens.'+key,val,'Token de estilo presente no contrato');
 // CSS regras completas permanecem no JSON: a consulta mínima mostra contagem, sem promover cada regra a novo campo.
 if(css.regras)f('Estilo · regras','Quantidade de regras','tela.estrutura.css.regras',Object.keys(css.regras).length,'As regras CSS permanecem no contrato original');
 if(Array.isArray(nav.rotas))f('Navegação','Quantidade de rotas','tela.navegacao.rotas',nav.rotas.length,'Rotas explicitamente declaradas');
 for(let i=0;i<(nav.destinosDeclarados||[]).length;i++){const v=nav.destinosDeclarados[i],base='tela.navegacao.destinosDeclarados['+i+']';
  for(const [label,k] of [['Componente origem','componenteRef'],['Elemento origem','elementoRef'],['Destino','destinoRef']])if(k in v)f('Navegação · destino '+(i+1),label,base+'.'+k,v[k],'Destino explicitamente declarado');
  ref('Destino',v.elementoRef||v.componenteRef||'?',v.destinoRef||'?',v.componenteRef||'');
 }
 for(const [key,c] of Object.entries(d.componentes)){const ci=c.identidade||{},cc=c.classificacao||{},ch=c.estrutura?.html||{};
  f('Componentes · contrato',ci.nome||key,'componentes.'+key+'.identidade.id',ci.id||key,'Componente explicitamente declarado no contrato');
  if(ch.raizRef)ref('Raiz do componente',key,ch.raizRef,'');
 }
 $('#sourceLabel').textContent='Contrato mínimo · schema '+(t.schemaVersion||'—');
 $('#context-strip').textContent='Tela: '+(id.id||'—')+' · '+(id.nome||'—')+' · '+Object.keys(d.componentes).length+' componentes · sem dados de outras telas';
 $('#field-count').textContent=fields.length;$('#relation-count').textContent=refs.length;$('#stat-fields').textContent=fields.length;$('#stat-rel').textContent=refs.length;$('#stat-components').textContent=Object.keys(d.componentes).length;
 $('#field-search').value='';$('#component-search').value='';$('#rel-search').value='';renderFields();renderRefs();renderSummary();renderComponents();
}
function renderFields(){const q=$('#field-search').value.toLowerCase().trim(),tree=$('#field-tree');clear(tree);
 const filtered=fields.filter(v=>(v.label+' '+v.path+' '+short(v.value)+' '+v.group).toLowerCase().includes(q));
 const groups=new Map();for(const x of filtered){if(!groups.has(x.group))groups.set(x.group,[]);groups.get(x.group).push(x)}
 for(const [group,items] of groups){const section=el('div','f-group'),title=el('div','f-groupname',group+' ('+items.length+')');section.append(title);
 for(const x of items){const b=el('button','f-row'+(x.path===selection?' active':''));b.type='button';b.title=x.path;b.append(el('span','left',x.label),el('small','',typeof x.value==='object'?'JSON':String(x.value).slice(0,30)));b.addEventListener('click',()=>{selection=x.path;renderFields();renderDetail(x)});section.append(b)}tree.append(section)}
 if(!filtered.length)tree.append(el('p','empty','Nenhum campo encontrado.'));
 if(!selection||!fields.some(x=>x.path===selection)){const first=filtered[0];if(first){selection=first.path;renderDetail(first)}}
}
function renderDetail(x){const area=$('#field-details');clear(area);if(!x)return;
 area.append(el('div','mini',x.group),el('div','detail-title',x.label),el('p','detail-desc',x.desc||'Campo declarado no JSON mínimo.'));
 area.append(el('div','divider'),el('div','label','CAMINHO NO JSON'),el('div','path',x.path),el('div','label','VALOR DECLARADO'),el('pre','sample',short(x.value)));
 const actions=el('div','detail-actions'),copy=el('button','button-import','Copiar caminho');copy.onclick=()=>navigator.clipboard?.writeText(x.path);actions.append(copy);area.append(actions);
}
function renderRefs(){const q=$('#rel-search').value.toLowerCase(),area=$('#relations');clear(area);
 for(const x of refs.filter(r=>(r.type+' '+r.source+' '+r.target+' '+r.detail).toLowerCase().includes(q))){const row=el('div','relation'),a=el('div');a.style.flex='1';a.append(el('strong','',x.source),el('small','',x.type+(x.detail?' · '+x.detail:'')));row.append(a,el('span','arrow','→'),el('strong','',x.target));area.append(row)}if(!area.children.length)area.append(el('p','empty','Nenhuma referência encontrada.'))}
function renderSummary(){const area=$('#summary');clear(area);const comp=doc.tela.estrutura?.html?.composicao||{};const counts=[['Campos documentados',fields.length],['Blocos de composição',Object.keys(comp).length],['Componentes',Object.keys(doc.componentes).length],['Destinos declarados',(doc.tela.navegacao?.destinosDeclarados||[]).length],['Tokens CSS',Object.keys(doc.tela.estrutura?.css?.tokens||{}).length],['Regras CSS',Object.keys(doc.tela.estrutura?.css?.regras||{}).length]];
 for(const [name,count] of counts){const box=el('div','summarycard');box.append(el('strong','',count),el('span','',name));area.append(box)}}
function renderComponents(){const q=$('#component-search').value.toLowerCase(),area=$('#component-list');clear(area);
 const entries=Object.entries(doc.componentes).filter(([k,c])=>(k+' '+(c.identidade?.nome||'')).toLowerCase().includes(q));
 for(const [key,c] of entries){const n=Object.keys(c.estrutura?.html?.elementos||{}).length,b=el('button','component-item');b.append(el('span','',c.identidade?.nome||key),el('span','counttag',n+' elementos'));b.onclick=()=>{activeComponent=key;renderComponentDetail(key)};area.append(b)}
 if(!area.children.length)area.append(el('p','empty','Nenhum componente encontrado.'));
 if(!activeComponent||!doc.componentes[activeComponent]){if(entries.length){activeComponent=entries[0][0];renderComponentDetail(activeComponent)}}
}
function renderComponentDetail(key){const area=$('#component-detail');clear(area);const c=doc.componentes[key];if(!c)return;const h=c.estrutura?.html||{},css=c.estrutura?.css||{};area.append(el('div','mini',c.classificacao?.categoria||'componente'),el('div','detail-title',c.identidade?.nome||key),el('div','label','ID DO COMPONENTE'),el('div','path',key),el('div','label','RAIZ DA ESTRUTURA'),el('div','path',h.raizRef||'Não declarada'));
 for(const [label,val] of [['Elementos HTML',Object.keys(h.elementos||{}).length],['Regras CSS',Object.keys(css.regras||{}).length],['Reutilizável',c.classificacao?.reutilizavel??'não informado']]){const row=el('div','record');row.append(el('strong','',label),el('span','muted-small',val));area.append(row)}
 const list=Object.entries(h.elementos||{});area.append(el('div','label','ELEMENTOS DECLARADOS ('+list.length+')'));
 const section=el('div','field-scroll');section.style.height='240px';for(const [name,v] of list){const item=el('div','record');item.append(el('strong','',name+' · <'+(v.tag||'?')+'>'),el('code','',v.paiRef||'raiz'));section.append(item)}area.append(section)
}
$$('[data-mode]').forEach(b=>b.onclick=()=>{const mode=b.dataset.mode;$$('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));$('#pane-fields').classList.toggle('active',mode==='fields');$('#pane-components').classList.toggle('active',mode==='components');$('#heading').textContent=mode==='fields'?'Home Advogado · Campos mínimos':'Home Advogado · Componentes';$('#crumb-last').textContent=mode==='fields'?'Campos mínimos':'Componentes'});
$$('[data-tab]').forEach(b=>b.onclick=()=>{$$('[data-tab]').forEach(x=>x.classList.toggle('active',b===x));for(const key of ['fields','relations','overview'])$('#fieldtab-'+key).classList.toggle('hidden',b.dataset.tab!==key)});
$('#field-search').oninput=renderFields;$('#rel-search').oninput=renderRefs;$('#component-search').oninput=renderComponents;
$('#btn-import').onclick=()=>$('#file-input').click();$('#file-input').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{digest(JSON.parse(await file.text()))}catch(err){alert('JSON inválido: '+err.message)}e.target.value=''};
// Em file:// o Chrome bloqueia fetch() de JSON. Importação manual funciona sem servidor.
fetch('./dados.json').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(digest).catch(err=>{const area=$('#field-details');clear(area);area.append(el('div','detail-title','Carregue o arquivo dados.json'),el('p','detail-desc','O navegador bloqueou a leitura automática do JSON local. Clique em “Importar JSON” e selecione dados.json; ou abra iniciar.bat para carregar automaticamente.'));$('#context-strip').textContent='Aguardando dados.json · '+err.message});
