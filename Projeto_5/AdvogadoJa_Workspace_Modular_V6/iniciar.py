#!/usr/bin/env python3
"""Servidor local do Workspace V6: leitura estática e escrita controlada do catálogo ativo.
Execução: python iniciar.py  [porta padrão 8765]. Escuta exclusivamente em 127.0.0.1.
"""
from __future__ import annotations
import http.server, json, pathlib, shutil, tempfile, threading, re, os, sys, uuid
ROOT=pathlib.Path(__file__).resolve().parent
CAT=ROOT/'catalogo'
LOCK=threading.RLock()
RE_ID=re.compile(r'^[a-z0-9][a-z0-9._-]{1,125}$')
ALLOWED={'telas','componentes'}

def load_json(path):
    return json.loads(path.read_text(encoding='utf-8'))

def validar(registros, indice):
    telas,comps={},{}
    for tipo,arr in [('telas',telas),('componentes',comps)]:
        for entry in indice[tipo]:
            if entry['id'] not in registros[tipo]: raise ValueError('Índice incompleto: '+entry['id'])
            o=registros[tipo][entry['id']]
            if o.get('identidade',{}).get('id')!=entry['id']: raise ValueError('Identidade divergente: '+entry['id'])
            if tipo=='telas' and 'flow' in o: raise ValueError('A seção flow é proibida no novo contrato: '+entry['id'])
            arr[entry['id']]=o
    parts={}
    for sid,t in telas.items():
        for part in t.get('navegacao',{}).get('participacoes',[]):
            pid=part.get('id')
            if not pid or pid in parts: raise ValueError('Participação ausente ou duplicada: '+str(pid))
            parts[pid]=sid
        for i in t.get('componentes',{}).get('instancias',[]):
            if i.get('ref') not in comps: raise ValueError(f'Componente não encontrado: {sid} → {i.get("ref")}')
    for sid,t in telas.items():
        for a in t.get('acoes',{}).get('itens',[]):
            destinos=[a.get('destino')]+[r.get('destino') for r in a.get('rotas',[])]
            for d in destinos:
                if not d: continue
                if d.get('tipo')!='tela': continue
                if d.get('telaId') not in telas: raise ValueError(f'Destino de tela ausente: {sid} → {d.get("telaId")}')
                if d.get('participacaoId') and parts.get(d['participacaoId'])!=d['telaId']: raise ValueError(f'Participação de destino inválida: {sid} → {d.get("participacaoId")}')

def aplicar_lote(itens):
    if not isinstance(itens,list) or not 1<=len(itens)<=300: raise ValueError('Lote vazio ou acima do limite')
    with LOCK:
        indice=load_json(CAT/'indice.json')
        registros={'telas':{},'componentes':{}}
        for tipo in ALLOWED:
            for e in indice[tipo]: registros[tipo][e['id']]=load_json(CAT/e['arquivo'])
        for item in itens:
            tipo=item.get('tipo');id=item.get('id');obj=item.get('registro')
            if tipo not in ALLOWED or not isinstance(id,str) or not RE_ID.fullmatch(id): raise ValueError('Tipo ou ID inválido')
            if not isinstance(obj,dict) or obj.get('identidade',{}).get('id')!=id: raise ValueError('Identidade divergente de '+id)
            if tipo=='telas' and 'flow' in obj: raise ValueError('flow não faz parte do contrato novo')
            if id not in registros[tipo]: indice[tipo].append({'id':id,'nome':obj['identidade'].get('nome',id),'arquivo':tipo+'/'+id+'.json'})
            else:
                for e in indice[tipo]:
                    if e['id']==id:e['nome']=obj['identidade'].get('nome',id)
            registros[tipo][id]=obj
        validar(registros,indice)
        # Preparar conjunto completo fora do catálogo em uso; substituir diretório com rollback.
        work=pathlib.Path(tempfile.mkdtemp(prefix='.v6_preparacao_',dir=str(ROOT)))
        stage=work/'catalogo';shutil.copytree(CAT,stage)
        try:
            for tipo in ALLOWED:
                for e in indice[tipo]:
                    p=stage/e['arquivo'];p.parent.mkdir(parents=True,exist_ok=True)
                    p.write_text(json.dumps(registros[tipo][e['id']],ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
            (stage/'indice.json').write_text(json.dumps(indice,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
            backup=ROOT/('.catalogo_backup_'+uuid.uuid4().hex)
            CAT.rename(backup)
            try:stage.rename(CAT)
            except Exception:backup.rename(CAT);raise
            shutil.rmtree(backup)
        finally:shutil.rmtree(work,ignore_errors=True)
        return {'ok':True,'gravados':len(itens),'telas':len(registros['telas']),'componentes':len(registros['componentes'])}

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_POST(self):
        if self.path not in ('/api/catalogo/salvar','/api/catalogo/lote'):
            self.respond(404,{'erro':'Endpoint desconhecido'});return
        try:
            n=int(self.headers.get('Content-Length','0'))
            if not 0<n<3_000_000:self.respond(413,{'erro':'Payload acima do limite'});return
            obj=json.loads(self.rfile.read(n));itens=obj.get('itens') if self.path.endswith('lote') else [obj]
            res=aplicar_lote(itens);self.respond(200,res)
        except (ValueError,TypeError,KeyError,json.JSONDecodeError) as e:self.respond(400,{'erro':str(e)})
        except Exception as e:self.respond(500,{'erro':f'Falha na gravação: {e}'})
    def respond(self,status,obj):
        body=json.dumps(obj,ensure_ascii=False).encode('utf8')
        self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Content-Length',str(len(body)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(body)
    def end_headers(self):
        self.send_header('X-Content-Type-Options','nosniff')
        super().end_headers()

if __name__=='__main__':
    port=int(sys.argv[1]) if len(sys.argv)>1 else 8765
    print(f'Workspace V6: http://localhost:{port} (Ctrl+C para encerrar)')
    http.server.ThreadingHTTPServer(('127.0.0.1',port),Handler).serve_forever()
