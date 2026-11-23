#!/usr/bin/env python3
"""Validação estrutural da biblioteca de referência V10. Requer jsonschema."""
import json, pathlib, hashlib, sys
from jsonschema import Draft202012Validator
root=pathlib.Path(__file__).resolve().parent
schema=json.loads((root/'SCHEMA_TELA_V10.json').read_text())
components=json.loads((root/'componentes/catalogo.json').read_text())
validator=Draft202012Validator(schema)
alljs=set();ids=set();issues=[];routeids=set();known_states=set();catalog=json.loads((root/'jornadas.json').read_text());known_journey={x['id'] for x in catalog['jornadas']+catalog['subjornadas']}
for file in sorted((root/'telas').rglob('documento.json')):
 doc=json.loads(file.read_text());screen=doc['identidade']['id']
 if screen in ids:issues.append('Tela duplicada '+screen)
 ids.add(screen)
 for err in validator.iter_errors(doc):issues.append(screen+': '+err.message)
 insts=doc['estrutura']['html']['composicao']
 for inst in insts.values():
  if inst['componenteRef'] not in components:issues.append(screen+': componente ausente '+inst['componenteRef'])
 for dim in doc['estados'].values():
  known_states.add(dim['id'])
  for opt in dim['opcoes'].values():
   for target in opt.get('alvos',[]):
    if target['tipo']=='instancia' and target.get('ref') not in insts:issues.append(screen+': alvo de instância não encontrado '+str(target.get('ref')))
    if target['tipo']=='elemento':
     inst=insts.get(target.get('instanciaRef'))
     if not inst:issues.append(screen+': alvo de elemento com instância inexistente '+str(target.get('instanciaRef')))
     elif target.get('ref') not in components[inst['componenteRef']]['estrutura']['html']['elementos']:issues.append(screen+': elemento do alvo não encontrado '+str(target.get('ref')))
 for r in doc['navegacao']['rotas']:
  if r['id'] in routeids:issues.append(screen+': rota duplicada '+r['id'])
  routeids.add(r['id'])
  if r['origem']['instanciaRef'] not in insts:issues.append(screen+': rota com origem ausente '+r['id'])
 for ref in doc['classificacao']['jornadaRefs']+doc['classificacao']['subjornadaRefs']:
  if ref not in known_journey:issues.append(screen+': jornada ausente '+ref)
 for ref in doc['estrutura']['css'].get('folhasRefs',[]):
  if ref not in components:issues.append(screen+': folha de estilos ausente '+ref)
 js=file.parent/'motor.js'
 if not js.exists():issues.append(screen+': motor.js ausente')
 else:alljs.add(hashlib.sha256(js.read_bytes()).hexdigest())
 if doc['classificacao']['localizacao']['caminho']!='telas/'+screen.replace('.','/')+'/documento.json':issues.append(screen+': caminho divergente')
for sub in catalog['subjornadas']:
 for ref in sub.get('rotaRefs',[]):
  if ref not in routeids:issues.append('Subjornada '+sub['id']+' referencia rota ausente '+ref)
print(f'Telas: {len(ids)} | Rotas: {len(routeids)} | Motores distintos: {len(alljs)} | Erros: {len(issues)}')
for err in issues:print('ERRO',err)
sys.exit(1 if issues else 0)
