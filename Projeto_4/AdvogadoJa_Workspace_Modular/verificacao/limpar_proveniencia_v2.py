#!/usr/bin/env python3
"""Separa informações históricas do contrato funcional; conserva rastreabilidade em verificacao/."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
proveniencia={};original_versions={}
for folder,kind in [('telas','tela'),('componentes','componente')]:
 for p in (root/'catalogo'/folder).rglob('*.json'):
  obj=json.loads(p.read_text(encoding='utf-8'));id=obj['identidade']['id'];modified=False
  if 'proveniencia' in obj:
   proveniencia[id]=obj.pop('proveniencia');modified=True
  versao=obj['identidade'].get('versao')
  if versao and re.fullmatch(r'\d+\.\d+\.\d+[-+][\w.-]+',versao):
   original_versions[id]={'tipo':kind,'versaoAnterior':versao}
   obj['identidade']['versao']=versao.split('-',1)[0].split('+',1)[0]
   modified=True
  if modified:p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
origins_path=root/'verificacao'/'historico_componentes_importados.json'
origins_old=json.loads(origins_path.read_text(encoding='utf-8')).get('porComponente',{}) if origins_path.exists() else {}
origins_path.write_text(json.dumps({'descricao':'Proveniência técnica externa aos contratos; motores não leem esta informação.','porComponente':{**origins_old,**proveniencia}},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
versions_path=root/'verificacao'/'historico_versoes_legadas.json'
versions_old=json.loads(versions_path.read_text(encoding='utf-8')).get('porRegistro',{}) if versions_path.exists() else {}
versions_path.write_text(json.dumps({'descricao':'Sufixos importado/migrado/proposta retirados de identidade.versao, sem homologar contratos em rascunho.','porRegistro':{**versions_old,**original_versions}},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print({'componentesComProveniencia':len(proveniencia),'versoesAnteriores':len(original_versions)})
