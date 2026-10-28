/* Modelos: documentação derivada dos schemas propostos, sem Store paralela.
 * A validação local é parcial (subconjunto de JSON Schema + validação da Store).
 */
'use strict';
const mdlTypes={
 tela:{name:'Tela',url:'contratos/tela.schema.proposto.json',hint:'Uma definição canônica por tela. IDs, estados, componentes, dados, ações e Flow.'},
 componente:{name:'Componente',url:'contratos/componente.schema.proposto.json',hint:'Peça visual reutilizável. Uma única definição, referenciada por instâncias.'},
 catalogo:{name:'Catálogo / pacote',url:'contratos/catalogo.pacote.schema.proposto.json',hint:'Intercâmbio de arquivos canônicos; não é um índice mestre persistido.'},
 jornada:{name:'Jornada (intercâmbio)',url:'contratos/jornada.intercambio.schema.proposto.json',hint:'Pacote de referências ou completo; não constitui uma Store própria.'}
};
const mdlState={type:'tela',docs:{},current:'',imported:false};
function mdlExample(kind){
 if(kind==='tela')return deepClone(emptyTemplate().catalogo.telas[0]);
 if(kind==='componente')return {schema:'advogadoja.componente.reutilizavel.v2-proposta',identidade:{id:'componente.exemplo.v01',nome:'Componente de exemplo',tipo:'componente',versao:'0.1.0'},classificacao:{escopo:'global',jornadas:['*'],localizacaoArvore:{secao:'Componentes',segmentos:['globais','exemplos'],chave:'exemplo_v01'}},estrutura:{formato:'arvore_elementos',arvore:[{id:'conteudo',tag:'div',filhos:['Exemplo ilustrativo']}]},estilos:{css:'.exemplo{padding:12px}'},interface:{propriedadesAceitas:[],eventosEmitidos:[]}};
 if(kind==='catalogo')return emptyTemplate();
 return {schema:'advogadoja.jornada.intercambio.v1',versao:'1.0.0',jornada:'exemplo',modo:'referencias',telas:[],componentes:[]};
}
function mdlFilledExample(kind){
 const doc=mdlExample(kind);
 if(kind==='tela'){
  doc.identidade.id='exemplo.confirmacao';doc.identidade.nome='Confirmar atendimento (ilustrativo)';
  doc.classificacao.escopo='cliente';doc.classificacao.jornadas=['cliente'];doc.classificacao.compartilhada=false;
  doc.classificacao.subjornadas=['atendimento'];doc.classificacao.localizacaoArvore.segmentos=['cliente'];
  doc.classificacao.localizacaoArvore.chave='confirmacao';
 }else if(kind==='componente'){
  doc.identidade.id='componente.aviso.v01';doc.identidade.nome='Aviso reutilizável (ilustrativo)';
  doc.estrutura.arvore=[{id:'aviso',tag:'div',atributos:{class:'aviso-exemplo'},filhos:['Mensagem informativa']}];
  doc.estilos.css='.aviso-exemplo{padding:12px;border-radius:8px}';
 }else if(kind==='jornada'){
  doc.jornada='cliente';doc.telas=[{id:'exemplo.confirmacao'}];
 }else if(kind==='catalogo'){
  doc.catalogo.telas=[mdlFilledExample('tela')];
 }
 return doc;
}
function mdlResolve(schema,root){
 if(!schema?.$ref)return schema||{};
 if(!schema.$ref.startsWith('#/'))return schema;
 return schema.$ref.slice(2).split('/').reduce((doc,key)=>doc?.[key.replace(/~1/g,'/').replace(/~0/g,'~')],root)||schema;
}
function mdlDescription(path){
 const known=[['identidade.id','Identificador único e estável, não deriva da ordem visual.'],['classificacao.jornadas','Determina em quais jornadas a tela aparece; * significa comum a todas.'],['componentes.instancias','Declara referências aos componentes reutilizáveis, sem copiá-los.'],['componentes.instancias[].ref','A Montagem procura esse ID no catálogo de componentes.'],['acoes.grupos','A área Relações descobre saídas declaradas; entradas são calculadas.'],['flow.editor','O Flow reconstrói sequências, ocorrências e bifurcações.'],['dados.persistencia','A aba Banco projeta necessidades de entidades e relações.'],['mocks','O Protótipo pode fornecer dados de demonstração, sem backend.'],['classificacao.localizacaoArvore','Organização de navegação; não é identidade de negócio.'],['telas','Arquivo de intercâmbio: referências no modo leve, documentos no modo completo.'],['modo','Define se a jornada leva apenas IDs ou cópias transportáveis dos JSONs.']];
 return known.find(([key])=>path===key||path.startsWith(key+'.')||path.startsWith(key+'['))?.[1]||'Campo descrito no contrato proposto. Consulte o tipo e suas restrições antes de editar.';
}
function mdlTreeChildren(schema,root,path='',depth=0){
 if(depth>8)return '';
 const node=mdlResolve(schema,root),props=node.properties||{},required=new Set(node.required||[]);
 return Object.entries(props).map(([key,def])=>{
  const child=mdlResolve(def,root),p=path?path+'.'+key:key;
  const req=required.has(key);
  const nested=mdlTreeChildren(child,root,p,depth+1);
  const t=child.type|| (child.const!==undefined?'const':child.$ref?'referência':'campo');
  return `<div class="mdl-tree-node" style="--depth:${depth}"><button data-mdl-path="${escapeHtml(p)}" class="mdl-tree-item"><span class="mdl-chevron">${nested?'▸':'·'}</span><b>${escapeHtml(key)}</b><span>${escapeHtml(t)}</span><small class="${req?'mdl-required':''}">${req?'obrigatório':'opcional'}</small></button><div class="mdl-tree-children" hidden>${nested}</div></div>`;
 }).join('');
}
function mdlSchemaPath(schema,root,path){
 let v=schema;
 for(const name of path.split('.').filter(Boolean)){
  v=mdlResolve(v,root).properties?.[name]||{};
 }
 return mdlResolve(v,root);
}
function mdlPartialValidate(value,source,root,path='',errors=[],depth=0){
 if(depth>12||errors.length>=40)return errors;
 const s=mdlResolve(source,root);
 if(s.const!==undefined&&canonical(s.const)!==canonical(value))errors.push(`${path||'raiz'}: valor esperado ${JSON.stringify(s.const)}`);
 if(s.enum&&!s.enum.some(x=>canonical(x)===canonical(value)))errors.push(`${path||'raiz'}: valor fora da enumeração`);
 const type=s.type;
 if(type){const types=Array.isArray(type)?type:[type];const match=types.some(k=>k==='object'?obj(value):k==='array'?Array.isArray(value):k==='null'?value===null:k==='integer'?Number.isInteger(value):typeof value===k);if(!match){errors.push(`${path||'raiz'}: tipo esperado ${types.join('|')}`);return errors;}}
 if(obj(value)){
  for(const k of s.required||[])if(!(k in value))errors.push(`${path||'raiz'}: campo obrigatório ausente: ${k}`);
  for(const [k,v] of Object.entries(value))if(s.properties?.[k])mdlPartialValidate(v,s.properties[k],root,path?path+'.'+k:k,errors,depth+1);
 }
 if(Array.isArray(value)){
  if(typeof s.minItems==='number'&&value.length<s.minItems)errors.push(`${path}: requer pelo menos ${s.minItems} item(ns)`);
  if(s.uniqueItems&&new Set(value.map(canonical)).size!==value.length)errors.push(`${path}: itens duplicados`);
  if(s.items)value.forEach((item,i)=>mdlPartialValidate(item,s.items,root,`${path}[${i}]`,errors,depth+1));
 }
 if(typeof value==='string'){
  if(s.minLength!==undefined&&value.length<s.minLength)errors.push(`${path}: texto muito curto`);
  if(s.pattern){try{if(!new RegExp(s.pattern).test(value))errors.push(`${path}: não corresponde ao padrão ${s.pattern}`);}catch(_){errors.push(`${path}: padrão inválido no schema`);}}
 }
 return errors;
}
function mdlValidate(){
 const result=$('mdlValidation');
 try{
  const data=JSON.parse($('mdlEditor').value),kind=mdlState.type,schema=mdlState.docs[kind];
  if(!schema)throw Error('O schema ainda não foi carregado.');
  const errs=mdlPartialValidate(data,schema,schema);
  if(!errs.length){
    if(kind==='tela')validateRecord('screens',data);
    else if(kind==='componente')validateRecord('components',data);
    else if(kind==='catalogo'){
      const normalized=normalizeInput(data);
      normalized.telas.forEach(x=>validateRecord('screens',x));
      normalized.componentes.forEach(x=>validateRecord('components',x));
    } else jornadaValidarPacote(data);
  }
  result.innerHTML=errs.length?`<b>${errs.length} inconsistência(s) detectada(s):</b><ul>${errs.slice(0,20).map(e=>'<li>'+escapeHtml(e)+'</li>').join('')}</ul>`:'<b>✓ Validação estrutural local aprovada.</b> Nenhum arquivo do catálogo foi alterado.';
  result.className='mdl-validation '+(errs.length?'mdl-error':'mdl-success');
 }catch(e){result.textContent='Não validado: '+e.message;result.className='mdl-validation mdl-error';}
}
async function mdlSelect(kind){
 if(!mdlTypes[kind])return;
 mdlState.type=kind;
 document.querySelectorAll('[data-mdl-type]').forEach(x=>x.classList.toggle('active',x.dataset.mdlType===kind));
 $('mdlHeading').textContent=mdlTypes[kind].name;
 $('mdlHint').textContent=mdlTypes[kind].hint;
 $('mdlValidation').textContent='Cole um JSON ou importe um arquivo para validar sem gravar na Store.';
 $('mdlValidation').className='mdl-validation';
 $('mdlEditor').value=JSON.stringify(mdlExample(kind),null,2);
 try{
  if(!mdlState.docs[kind]){
   const response=await fetch(mdlTypes[kind].url,{cache:'no-store'});
   if(!response.ok)throw Error(`Contrato não encontrado (${response.status})`);
   mdlState.docs[kind]=await response.json();
  }
  const schema=mdlState.docs[kind];
  $('mdlSchemaLabel').textContent=(schema.title||mdlTypes[kind].name)+' · esquema proposto';
  $('mdlTree').innerHTML=mdlTreeChildren(schema,schema)||'<div class="mdl-empty">Nenhum campo documentado no schema.</div>';
  mdlDetail('');
 }catch(e){$('mdlTree').textContent='Não foi possível carregar o modelo: '+e.message;$('mdlDetails').textContent='Falha na leitura do contrato proposto.';}
}
function mdlDetail(path){
 const root=mdlState.docs[mdlState.type];if(!root)return;
 const node=mdlSchemaPath(root,root,path);
 $('mdlDetails').innerHTML=`<b>${escapeHtml(path||'Raiz do documento')}</b><p>${escapeHtml(node.description||mdlDescription(path))}</p><dl><dt>Tipo</dt><dd>${escapeHtml(node.type||'objeto/campo')}</dd><dt>Valor padrão</dt><dd>${escapeHtml(node.default===undefined?'não declarado':JSON.stringify(node.default))}</dd><dt>Restrição</dt><dd>${escapeHtml(node.pattern||JSON.stringify(node.enum||node.const||'ver schema'))}</dd></dl>`;
}
function mdlWire(){
 const navigation=$('mdlTypeNav');if(!navigation)return;
 navigation.innerHTML=Object.entries(mdlTypes).map(([id,type])=>`<button type="button" class="mdl-type" data-mdl-type="${id}">${escapeHtml(type.name)}</button>`).join('');
 navigation.onclick=e=>{const b=e.target.closest('[data-mdl-type]');if(b)mdlSelect(b.dataset.mdlType);};
 $('mdlTree').onclick=e=>{const b=e.target.closest('[data-mdl-path]');if(!b)return;mdlDetail(b.dataset.mdlPath);const children=b.nextElementSibling;if(children?.classList.contains('mdl-tree-children')){children.hidden=!children.hidden;b.querySelector('.mdl-chevron').textContent=children.hidden?'▸':'▾';}};
 $('mdlEmpty').onclick=()=>{$('mdlEditor').value=JSON.stringify(mdlExample(mdlState.type),null,2);};
 $('mdlExample').onclick=()=>{$('mdlEditor').value=JSON.stringify(mdlFilledExample(mdlState.type),null,2);};
 $('mdlCheck').onclick=mdlValidate;
 $('mdlExport').onclick=()=>downloadText('advogadoja_modelo_'+mdlState.type+'.json',$('mdlEditor').value);
 $('mdlUpload').onclick=()=>$('mdlFile').click();
 $('mdlFile').onchange=async e=>{const f=e.target.files?.[0];if(f){try{$('mdlEditor').value=await f.text();mdlValidate();}catch(err){$('mdlValidation').textContent='Falha: '+err.message;}}e.target.value='';};
}
function mdlRender(){if(!mdlState.docs[mdlState.type])mdlSelect(mdlState.type);}
