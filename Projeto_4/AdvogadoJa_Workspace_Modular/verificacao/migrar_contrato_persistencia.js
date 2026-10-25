#!/usr/bin/env node
'use strict';
/* Evolui cada tela para o contrato V4. Não infere entidades nem campos: a
 * persistência nasce das decisões registradas nas jornadas. */
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..','catalogo','telas');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{const file=path.join(dir,entry.name);return entry.isDirectory()?files(file):entry.name.endsWith('.json')?[file]:[];});}
let changed=0;
for(const file of files(root)){
 const screen=JSON.parse(fs.readFileSync(file,'utf8'));
 screen.dados??={grupos:{},fontes:[]};
 screen.dados.persistencia??={entidades:[],relacoes:[],contrato:'declarações de dados exigidas pela tela; Banco é projeção agregada destas declarações'};
 screen.dados.persistencia.entidades??=[];
 screen.dados.persistencia.relacoes??=[];
 if(screen.schema==='advogadoja.tela.modular.v3-proposta')screen.schema='advogadoja.tela.modular.v4-proposta';
 fs.writeFileSync(file,JSON.stringify(screen,null,2)+'\n','utf8');changed++;
}
console.log(JSON.stringify({telasMigradas:changed,contrato:'dados.persistencia'},null,2));
