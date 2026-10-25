#!/usr/bin/env python3
"""Aplica evolução aditiva mínima; preserva IDs, posições e conexões."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
ss=list((root/'catalogo'/'telas').rglob('*.json'))
history={}; normalized=[]
for p in ss:
    screen=json.loads(p.read_text(encoding='utf-8'))
    sid=screen['identidade']['id']
    if 'migracaoProjeto1' in screen:
        history[sid]=screen.pop('migracaoProjeto1')
    c=screen['classificacao']; old=c.get('jornadas',[])
    c['jornadas']=list(dict.fromkeys('administrador' if j=='admin' else j for j in old))
    if c['jornadas']!=old: normalized.append(sid)
    p.write_text(json.dumps(screen,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
historyfile=root/'verificacao'/'historico_migracao_projeto1.json'
previous=json.loads(historyfile.read_text(encoding='utf-8')) if historyfile.exists() else {}
historyfile.write_text(json.dumps({'descricao':'Proveniência técnica arquivada; não é lida pelos motores; nenhum JSON de tela é replicado aqui.','porTela':{**previous.get('porTela',{}),**history}},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print({'screens':len(ss),'history':len(history),'normalized':normalized})
