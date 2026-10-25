#!/usr/bin/env node
'use strict';
/* Importação única de referência: depois de executada, nenhum motor lê o
 * Projeto_1. A informação passa a viver nos JSONs canônicos de cada tela. */
const fs=require('fs'),path=require('path');
const workspace=path.resolve(__dirname,'..');
const source='C:/DEV/area_advogado/areas_de_tentativa_projetos/Projeto_1/modelos/modelagem_banco_todas_telas.html';
const apply=process.argv.includes('--apply');
const aliases={
 'admin.assinaturas':'admin.assinaturas.assinaturas','admin.dashboard':'admin.dashboard.dashboard','admin.denuncias':'admin.denuncias.denuncias','admin.logs':'admin.logs.logs_operacionais','admin.oab':'admin.oab.validacao_oab','admin.perfis':'admin.perfis.moderacao_perfis'
};
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{const item=path.join(dir,entry.name);return entry.isDirectory()?files(item):entry.name.endsWith('.json')?[item]:[];});}
function modelData(){const html=fs.readFileSync(source,'utf8'),start='<script type="application/json" id="modelData">',i=html.indexOf(start),j=html.indexOf('</script>',i);if(i<0||j<0)throw Error('modelData não encontrado no Projeto 1.');return JSON.parse(html.slice(i+start.length,j));}
const data=modelData(),screenFiles=files(path.join(workspace,'catalogo','telas'));
const screens=screenFiles.map(file=>({file,json:JSON.parse(fs.readFileSync(file,'utf8'))}));
const byId=new Map(screens.map(record=>[record.json.identidade.id,record]));
function targetId(sourceId){return aliases[sourceId]||sourceId;}
function entity(id){const table=data.tables[id];if(!table)return null;return {id,nome:table.pt||table.label||id,dominio:table.group||'a_definir',campos:(table.cols||[]).map(([fieldId,tipo])=>({id:fieldId,tipo,acesso:'a_confirmar'}),),origemImportacao:{artefato:'Projeto_1/modelos/modelagem_banco_todas_telas.html',tabela:id}};}
function relation(from,to,cardinality,field){return {id:'rel-'+from+'-'+field+'-'+to,origem:{entidade:from},destino:{entidade:to},campoReferencia:field,cardinalidade:cardinality,origemImportacao:'Projeto_1/modelos/modelagem_banco_todas_telas.html'};}
const relations=(data.relations||[]).map(([from,to,cardinality,field])=>relation(from,to,cardinality,field));
const sourceScreenIds=Object.keys(data.screenMap||{}),mapped=[],unmatchedSource=[],unmappedCatalog=[];
for(const sourceId of sourceScreenIds){const destination=targetId(sourceId);if(!byId.has(destination)){unmatchedSource.push({sourceId,destination});continue;}const record=byId.get(destination),tableIds=data.screenMap[sourceId]||[];const entries=tableIds.map(entity).filter(Boolean),related=relations.filter(item=>tableIds.includes(item.origem.entidade)||tableIds.includes(item.destino.entidade));
 record.json.dados??={grupos:{},fontes:[]};record.json.dados.persistencia={entidades:entries,relacoes:related,contrato:'declarações canônicas da tela; Banco é projeção agregada destas declarações',origemImportacao:{artefato:'Projeto_1/modelos/modelagem_banco_todas_telas.html',screenKeyFonte:sourceId,statusCampos:'campos da entidade importados; operações por tela a confirmar nas jornadas'}};
 mapped.push({sourceId,destination,entidades:entries.map(item=>item.id)});
 if(apply)fs.writeFileSync(record.file,JSON.stringify(record.json,null,2)+'\n','utf8');
}
const mappedIds=new Set(mapped.map(item=>item.destination));
for(const record of screens)if(!mappedIds.has(record.json.identidade.id))unmappedCatalog.push(record.json.identidade.id);
const report={modo:apply?'apply':'inspect',fonte:'Projeto_1/modelos/modelagem_banco_todas_telas.html',tabelasFonte:Object.keys(data.tables||{}).length,relacoesFonte:(data.relations||[]).length,screenKeysFonte:sourceScreenIds.length,telasPreenchidas:mapped.length,fonteSemTelaNoCatalogo:unmatchedSource,telasCatalogoSemMapeamento:unmappedCatalog};
if(apply)fs.writeFileSync(path.join(workspace,'verificacao','relatorio_persistencia_projeto1.json'),JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify(report,null,2));
