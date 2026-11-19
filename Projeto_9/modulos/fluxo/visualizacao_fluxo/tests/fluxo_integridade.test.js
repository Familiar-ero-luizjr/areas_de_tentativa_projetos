const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(root+'/js/motor.js','utf8').replace(/loadOwnDocument\(\);\s*$/,`globalThis.AUDIT={normalize,portableDoc, getStats:(x)=>x.__editorProjection, setSource:(x)=>{JORNADAS_SOURCE=copy(x);LEGACY_REFERENCE={catalog:{entries:[]}}}, getEdges:(x)=>x.fluxo.conexoes, cardHtml:(x,k)=>{doc=x;return cardHtml(k,0)}, validationFor:(x)=>{doc=x;return validation()}, toJson:(x)=>JSON.stringify(x)};`);
const context={window:{addEventListener(){}},document:{},console,setTimeout,clearTimeout};vm.createContext(context);vm.runInContext(src,context,{timeout:120000});
const a=context.AUDIT,native=JSON.parse(fs.readFileSync(root+'/data/documento.json','utf8'));a.setSource(native);
const collect=()=>{const f=a.normalize(native);return f;};
const tr=(f)=>JSON.parse(JSON.stringify(a.portableDoc(f)));
let checks=0;function check(name,fn){fn();console.log('PASS',name);checks++}
check('110 screens 388 components 163 original relations, 119 visual 44 internal',()=>{
 const f=collect();const s=f.__editorProjection;assert.equal(Object.keys(native.telas).length,110);assert.equal(Object.keys(native.componentes).length,388);assert.equal(s.conexoes,119);assert.equal(s.saidasInternas,44);assert.equal(s.agrupadas,0);
 const originalIds=new Set(Object.values(native.telas).flatMap(x=>x.navegacao?.saidas||[]).map(x=>x.id));
 assert.equal(originalIds.size,163);
 const visuals=new Set(f.fluxo.conexoes.map(x=>x.id));assert.equal(visuals.size,119);
});
check('untouched native full roundtrip byte-equal by JSON.stringify',()=>{
 let f=collect();assert.equal(JSON.stringify(tr(f)),JSON.stringify(native));
});
check('same origin and destination different actions remain independent',()=>{
 const f=collect(),pair=f.fluxo.conexoes.filter(x=>x.de==='auth.sessao.entrar'&&x.para==='auth.cadastro.identificacao');
 assert.equal(pair.length,2);assert.notEqual(pair[0].id,pair[1].id);assert.notEqual(pair[0].saida,pair[1].saida);
 const unchanged={id:pair[1].id,action:pair[1].saida,orig:native.telas['auth.sessao.entrar'].navegacao.saidas.find(x=>x.id===pair[1].id)};
 pair[0].rotulo='Mudança localizada teste';pair[0].saida='evento.test';const out=tr(f);
 const relations=out.telas['auth.sessao.entrar'].navegacao.saidas;
 assert.equal(relations.find(x=>x.id===pair[0].id).rotulo,'Mudança localizada teste');
 assert.deepEqual(relations.find(x=>x.id===unchanged.id),unchanged.orig);
 const after=a.normalize(out);assert.equal(after.fluxo.conexoes.length,119);
});
check('removing one relation retains independent relation, internal and unrelated screens',()=>{
 const f=collect(),pair=f.fluxo.conexoes.filter(x=>x.de==='auth.sessao.entrar'&&x.para==='auth.cadastro.identificacao');
 const deleteId=pair[0].id;f.fluxo.conexoes=f.fluxo.conexoes.filter(x=>x.id!==deleteId);
 const out=tr(f), rels=out.telas['auth.sessao.entrar'].navegacao.saidas;
 assert.equal(rels.some(x=>x.id===deleteId),false);assert.equal(rels.some(x=>x.id===pair[1].id),true);
 assert.deepEqual(out.telas['advogado.home'],native.telas['advogado.home']);
 assert.equal(Object.keys(out.componentes).length,388);
 assert.equal(a.normalize(out).fluxo.conexoes.length,118);
 for(const t of Object.values(out.telas))for(const e of t.navegacao?.entradas||[])assert.notEqual(e.relacaoRef,deleteId);
});
check('editing destination syncs outgoing + inbound + branch path without touching other paths',()=>{
 const f=collect(),edge=f.fluxo.conexoes.find(x=>x.id==='relation.login.enviar.cliente');assert(edge);
 const old=edge.para;edge.para='auth.cadastro.identificacao';const out=tr(f);
 const r=out.telas[edge.de].navegacao.saidas.find(x=>x.id===edge.id);assert.equal(r.destinoRef,edge.para);assert.equal(r.destinoParticipacaoRef,null);
 assert.equal(out.telas[old].navegacao.entradas.some(x=>x.relacaoRef===edge.id),false);
 assert.equal(out.telas[edge.para].navegacao.entradas.some(x=>x.relacaoRef===edge.id),true);
 const path=out.telas[edge.de].navegacao.bifurcacoes.flatMap(x=>x.caminhos||[]).find(x=>x.relacaoRef===edge.id);
 assert.equal(path.destinoRef,edge.para);
 assert.equal(path.itens?.find(x=>x.relacaoRef===edge.id)?.telaRef,edge.para);
 assert.equal(a.normalize(out).fluxo.conexoes.find(x=>x.id===edge.id).para,edge.para);
});
check('new connection persists with stable id and proper reverse mirror',()=>{
 const f=collect();f.fluxo.conexoes.push({id:'cx.teste.nova',de:'advogado.home',para:'auth.sessao.entrar',saida:'acao.nova',tipo:'navegacao',rotulo:'Nova ação',quando:null,navegacao:'empilhar',referenciasOriginais:[]});
 const out=tr(f);const r=out.telas['advogado.home'].navegacao.saidas.find(x=>x.id==='cx.teste.nova');assert(r);assert.equal(r.acaoRef,'editor.navegacao');
 assert.equal(out.telas['auth.sessao.entrar'].navegacao.entradas.some(x=>x.relacaoRef==='cx.teste.nova'),true);
 assert.equal(a.normalize(out).fluxo.conexoes.length,120);
});
check('import legacy catalog refuses silent loss and explains unknown IDs',()=>{
 const x={catalogo:{telas:{'old.unknown':{navegacao:{saidas:[{id:'x'}]}}}}};assert.throws(()=>a.normalize(x),/IDs sem correspondencia: old.unknown/);
});
check('invalid duplicate relation id rejects instead of merging',()=>{
 const x=JSON.parse(JSON.stringify(native));x.telas['advogado.home'].navegacao.saidas[0].id=x.telas['auth.sessao.entrar'].navegacao.saidas[0].id;
 assert.throws(()=>a.normalize(x),/duplicado/);
});
check('internal states are visible in collapsed graph detail without artificial screens',()=>{
 const f=collect();const html=a.cardHtml(f,'advogado.home');assert(html.includes('estado(s)/processo(s) interno(s)'));assert(html.includes('advogado.home.estado.oab_pending_capabilities'));
});
check('baseline validation does not mistake 119 distinct relations for duplicates',()=>{
 const f=collect(),check=a.validationFor(f);assert(!check.errors.some(x=>/duplicado/.test(x)));
});
console.log('TOTAL TESTS',checks);
