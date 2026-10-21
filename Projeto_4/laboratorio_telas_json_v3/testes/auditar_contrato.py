"""Audita o contrato V2 independentemente do navegador. Execute: python testes/auditar_contrato.py"""
import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
source=root/'dados/conteudo.json'
project=json.loads(source.read_text('utf-8'))
assert project['schema']=='advogadoja-laboratorio-telas-v2'
assert project['inicial'] in project['telas']
count=0
for screenid,screen in project['telas'].items():
    assert screen['id']==screenid
    assert all(isinstance(screen[x],dict) for x in ['estrutura','estilos','acoes','interacoes','dados','estados'])
    nodeids=set()
    def inspect(n):
        global count
        if isinstance(n,str) or (isinstance(n,dict) and ('ref' in n or 'partes' in n)):
            return
        assert isinstance(n,dict) and 'tag' in n and 'id' in n, (screenid,n)
        assert n['id'] not in nodeids, (screenid,n['id'])
        nodeids.add(n['id']);count+=1
        assert n['tag'] not in ('script','iframe','style','object','embed')
        for child in n.get('filhos',[]):inspect(child)
    for f in screen['estrutura']['fragmentos']:
        assert 'template' not in f and isinstance(f['arvore'],list)
        for node in f['arvore']:inspect(node)
    for nodeid,entry in screen['interacoes'].items():
        assert nodeid in nodeids, (screenid,nodeid)
        if 'acaoRef' in entry:assert entry['acaoRef'] in screen['acoes'],(screenid,entry['acaoRef'])
    print(f'{screenid}: {len(nodeids)} nós, {len(screen["acoes"])} ações, {len(screen["interacoes"])} interações')
assert count>250
print(f'CONTRATO V2 OK — {len(project["telas"])} telas, {count} nós DOM em JSON.')
