#!/usr/bin/env python3
"""Auditoria sem dependências: python verificacao/auditar_catalogo.py"""
from __future__ import annotations
import json,pathlib,collections,sys
root=pathlib.Path(__file__).resolve().parents[1]
telas=[json.loads(p.read_text(encoding='utf8')) for p in (root/'catalogo/telas').rglob('*.json')]
componentes=[json.loads(p.read_text(encoding='utf8')) for p in (root/'catalogo/componentes').rglob('*.json')]
ids=[t['identidade']['id'] for t in telas]; cids=[c['identidade']['id'] for c in componentes]
errors=[];warnings=[]
if len(ids)!=len(set(ids)):errors.append('IDs de tela repetidos')
if len(cids)!=len(set(cids)):errors.append('IDs de componente repetidos')
occ=[];branches=[];rels=[];seqmap=collections.defaultdict(list);roots=[];referenced=[]
for t in telas:
 tid=t['identidade']['id'];flow=t.get('flow',{}).get('editor',{})
 if not isinstance(t.get('dados',{}).get('persistencia'),dict):errors.append('Persistência ausente: '+tid)
 elif not isinstance(t['dados']['persistencia'].get('entidades'),list) or not isinstance(t['dados']['persistencia'].get('relacoes'),list):errors.append('Persistência inválida: '+tid)
 if flow.get('entrypoint'):roots.append((tid,flow.get('rootSequenceId')))
 for o in flow.get('occurrences',[]):occ.append((tid,o));seqmap[o.get('sequenceId')].append(o.get('id'))
 for b in flow.get('branches',[]):
  branches.append((tid,b));seqmap[b.get('sequenceId')].append(b.get('id'))
  for x in b['paths']:referenced.append(x.get('sequenceId'))
 for g in t.get('acoes',{}).get('grupos',[]):
  if g.get('origem')=='flow_v3':rels.extend((tid,x) for x in g.get('acoes',[]))
 for i in t.get('componentes',{}).get('instancias',[]):
  if i.get('ref') not in cids:warnings.append(f'Componente ausente: {tid} -> {i.get("ref")}')
for target in referenced:
 if target not in seqmap:warnings.append('Caminho editorial sem nós: '+str(target))
for _,x in rels:
 if x.get('destino') not in ids:warnings.append('Saída legada sem tela: '+x.get('destino',''))
all_occ_ids=[x.get('id') for _,x in occ]; all_bids=[x.get('id') for _,x in branches]
if len(set(all_occ_ids))!=len(all_occ_ids):errors.append('IDs de ocorrência duplicados')
if len(set(all_bids))!=len(all_bids):errors.append('IDs de bifurcação duplicados')
if len(roots)!=1:errors.append('Quantidade de entrypoints: '+str(roots))
orphan=[t['identidade']['id'] for t in telas if not t.get('flow',{}).get('editor',{}).get('occurrences',[])]
expected={'telas':79,'componentes':234,'ocorrencias':197,'bifurcacoes':33,'caminhos':114,'saidas_legadas':408}
values={'telas':len(telas),'componentes':len(componentes),'ocorrencias':len(occ),'bifurcacoes':len(branches),'caminhos':sum(len(b['paths']) for _,b in branches),'saidas_legadas':len(rels)}
for key,value in expected.items():
 if values[key]!=value:warnings.append(f'Contagem histórica mudou para {key}: {values[key]} (base {value}). Confirmar mudança no contrato.')
print('AUDITORIA CANÔNICA:',values,'roots',roots,'sem_uso_editorial',orphan,'warnings',len(warnings),'errors',len(errors))
for x in errors:print('ERRO:',x)
for x in warnings[:30]:print('ATENÇÃO:',x)
if errors:sys.exit(2)
