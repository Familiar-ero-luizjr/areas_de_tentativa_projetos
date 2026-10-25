#!/usr/bin/env python3
"""Servidor local, sem dependências, com catálogo como única fonte persistente.
Iniciar: python iniciar.py  (abre http://127.0.0.1:8765)
"""
from __future__ import annotations
import hashlib, json, os, pathlib, re, sys, tempfile, threading, webbrowser
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlsplit
from functools import partial

ROOT = pathlib.Path(__file__).resolve().parent
CATALOG = ROOT / 'catalogo'
CONTRATO_PATH = ROOT / 'modulo_contrato' / 'data' / 'contrato_workspace.json'
CONTRATO_SCHEMA = 'advogadoja.modulo_contrato.v1'
ID_PATTERN = re.compile(r'^[a-z][a-z0-9_.-]+$')
WRITE_LOCK = threading.RLock()

def hash_content(doc):
    return hashlib.sha256(json.dumps(doc, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')).hexdigest()

def safe_part(text):
    p = re.sub(r'[^a-zA-Z0-9_.-]', '_', str(text or '').strip())
    if p in ('', '.', '..'):
        raise ValueError('Parte de caminho inválida')
    return p

def record_path(kind, doc):
    section = 'telas' if kind == 'screen' else 'componentes'
    loc = doc.get('classificacao', {}).get('localizacaoArvore', {})
    parts = [safe_part(s) for s in loc.get('segmentos', [])]
    leaf = safe_part(loc.get('chave') or doc['identidade']['id'].split('.')[-1]) + '.json'
    result = (CATALOG / section / pathlib.Path(*parts) / leaf).resolve()
    if not result.is_relative_to((CATALOG / section).resolve()):
        raise ValueError('Caminho de saída fora do catálogo')
    return result

def validate(kind, doc):
    if not isinstance(doc, dict): raise ValueError('Registro deve ser objeto JSON')
    ident = doc.get('identidade') or {}
    iid = ident.get('id')
    if not isinstance(iid, str) or not ID_PATTERN.fullmatch(iid):
        raise ValueError('identidade.id inválido')
    if ident.get('tipo') != ('tela' if kind == 'screen' else 'componente'):
        raise ValueError('identidade.tipo incorreto')
    if kind == 'screen':
        if not isinstance(doc.get('componentes', {}).get('instancias'), list):
            raise ValueError('componentes.instancias deve ser lista')
        ed = doc.get('flow', {}).get('editor', {})
        if not isinstance(ed.get('occurrences'), list) or not isinstance(ed.get('branches'), list):
            raise ValueError('flow.editor.occurrences/branches necessários')
    else:
        if not isinstance(doc.get('estrutura'), dict): raise ValueError('estrutura é necessária')
    return iid

def scan_records():
    out = {'screens': {}, 'components': {}, 'versions': {}}
    paths = {}
    for kind, sub, bucket in [('screen', 'telas', 'screens'), ('component', 'componentes', 'components')]:
        for path in sorted((CATALOG / sub).rglob('*.json')):
            doc = json.loads(path.read_text(encoding='utf-8'))
            iid = validate(kind, doc)
            key = f'{kind}:{iid}'
            if key in paths: raise ValueError(f'ID duplicado em {path.relative_to(CATALOG)} e {paths[key].relative_to(CATALOG)}')
            out[bucket][iid] = doc
            out['versions'][key] = hash_content(doc)
            paths[key] = path
    return out, paths

def validate_contrato(doc):
    """Valida exclusivamente o documento evolutivo; nunca importa a Store."""
    if not isinstance(doc, dict) or doc.get('schema') != CONTRATO_SCHEMA:
        raise ValueError('JSON não pertence ao módulo Contrato; schema inválido')
    meta=doc.get('metadados')
    if not isinstance(meta, dict) or meta.get('id') != 'advogadoja.workspace.contrato' or not isinstance(meta.get('titulo'),str) or not isinstance(meta.get('versao'),str):
        raise ValueError('Metadados do contrato inválidos')
    for key in ('objetivos', 'areas', 'decisoes'):
        if not isinstance(doc.get(key), list): raise ValueError(key+' precisa ser lista')
    ctrl=doc.get('controle')
    if not isinstance(ctrl,dict) or ctrl.get('aplicacaoAutomaticaNoCatalogo') is not False:
        raise ValueError('Contrato de planejamento não pode aplicar alterações automaticamente no catálogo')
    seen=set()
    def uid(prefix,value):
        if not isinstance(value,str) or not value.strip() or len(value)>120: raise ValueError('ID inválido no contrato')
        key=prefix+':'+value
        if key in seen: raise ValueError('ID duplicado no contrato: '+key)
        seen.add(key)
    for o in doc['objetivos']:
        if not isinstance(o,dict) or not isinstance(o.get('titulo'),str) or not isinstance(o.get('descricao'),str):raise ValueError('Objetivo inválido')
        uid('objetivo',o.get('id'))
    for a in doc['areas']:
        if not isinstance(a,dict) or not isinstance(a.get('titulo'),str) or not isinstance(a.get('objetivo'),str) or not isinstance(a.get('fonte'),str):raise ValueError('Área inválida')
        uid('area',a.get('id'))
        if a.get('situacao') not in ('proposto','em_revisao','homologado'): raise ValueError('Situação inválida em área')
        for key in ('campos','regras','pendencias','criteriosAceite'):
            if not isinstance(a.get(key),list):raise ValueError('Área requer lista '+key)
        fields=set()
        for c in a['campos']:
            if not isinstance(c,dict) or not isinstance(c.get('campo'),str) or not c['campo'].strip() or not isinstance(c.get('finalidade'),str) or not isinstance(c.get('regra'),str) or c.get('exigencia') not in ('obrigatorio','opcional','condicional') or c.get('situacao') not in ('existente','proposto','em_revisao','pendente'):
                raise ValueError('Campo inválido na área '+a['id'])
            if c['campo'] in fields:raise ValueError('Campo duplicado na área '+a['id'])
            fields.add(c['campo'])
        for key in ('regras','pendencias','criteriosAceite'):
            if any(not isinstance(v,str) for v in a[key]):raise ValueError('Lista '+key+' inválida em '+a['id'])
    for d in doc['decisoes']:
        if not isinstance(d,dict) or not isinstance(d.get('assunto'),str) or not isinstance(d.get('decisao'),str) or not isinstance(d.get('impacto'),str) or d.get('situacao') not in ('proposta','pendente','homologada'):
            raise ValueError('Decisão inválida')
        uid('decisao',d.get('id'))
    return doc

def read_contrato():
    doc = validate_contrato(json.loads(CONTRATO_PATH.read_text(encoding='utf-8')))
    return doc, hash_content(doc)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, fmt, *args):
        sys.stderr.write('Workspace: ' + fmt % args + '\n')
    def _json(self, code, payload):
        content = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(content)))
        self.end_headers(); self.wfile.write(content)
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/api/catalogo':
            with WRITE_LOCK:
                try: self._json(200, scan_records()[0])
                except Exception as exc: self._json(500, {'error': str(exc)})
            return
        if path == '/api/contrato':
            with WRITE_LOCK:
                try:
                    doc,version=read_contrato()
                    self._json(200, {'doc':doc, 'version':version})
                except Exception as exc: self._json(500, {'error':str(exc)})
            return
        # Don't expose server code or internal metadata by URL
        if path.endswith('.py') or path.startswith('/.') or '/.' in path:
            self.send_error(403); return
        if path == '/': self.path = '/index.html'
        return super().do_GET()
    def do_POST(self):
        if urlsplit(self.path).path == '/api/contrato/sync':
            try:
                n=int(self.headers.get('Content-Length','0'))
                if n<2 or n>1_000_000: raise ValueError('Tamanho do contrato inválido')
                payload=json.loads(self.rfile.read(n))
                doc=validate_contrato(payload.get('doc'))
                expected=payload.get('expected')
                with WRITE_LOCK:
                    old_doc,version=read_contrato()
                    if expected != version:
                        self._json(409, {'error':'Conflito de versão: o contrato mudou no disco. Exporte seu rascunho e recarregue antes de mesclar.'});return
                    CONTRATO_PATH.parent.mkdir(parents=True,exist_ok=True)
                    with tempfile.NamedTemporaryFile(mode='w',encoding='utf-8',dir=CONTRATO_PATH.parent,delete=False,suffix='.tmp') as tmp:
                        json.dump(doc,tmp,ensure_ascii=False,indent=2)
                        tmp.write('\n')
                        tmp_path=pathlib.Path(tmp.name)
                    os.replace(tmp_path, CONTRATO_PATH)
                    self._json(200,{'ok':True, 'version':hash_content(doc)})
            except Exception as exc:self._json(400,{'error':str(exc)})
            return
        if urlsplit(self.path).path != '/api/catalogo/sync':
            self._json(404, {'error':'Rota desconhecida'}); return
        try:
            n = int(self.headers.get('Content-Length', '0'))
            if n > 8_000_000: raise ValueError('Payload muito grande')
            payload = json.loads(self.rfile.read(n))
            changes = payload.get('changes')
            if not isinstance(changes, list) or len(changes) > 300: raise ValueError('changes inválido')
            with WRITE_LOCK:
                snapshot, old_paths = scan_records()
                updates = []
                filenames = set()
                for change in changes:
                    kind, doc, expected = change.get('kind'), change.get('doc'), change.get('expected')
                    if kind not in ('screen','component'): raise ValueError('kind inválido')
                    iid = validate(kind, doc); key=f'{kind}:{iid}'
                    actual=snapshot['versions'].get(key)
                    if actual != expected:
                        self._json(409, {'error':f'Conflito no registro {key}. Outro editor ou arquivo alterou sua versão no disco; recarregue antes de sobrescrever.', 'id':key});return
                    new_path=record_path(kind,doc)
                    if new_path in filenames: raise ValueError('Destino duplicado no lote: '+str(new_path))
                    filenames.add(new_path)
                    if new_path.exists() and new_path != old_paths.get(key):
                        raise ValueError('Caminho já ocupado por outro registro: '+str(new_path))
                    updates.append((key, doc, new_path, old_paths.get(key)))
                # Validate all before writing; temporary files and os.replace for each JSON
                written={}
                for key,doc,path,old_path in updates:
                    if hash_content(doc) == snapshot['versions'].get(key) and path == old_path:
                        written[key]=hash_content(doc);continue
                    path.parent.mkdir(parents=True,exist_ok=True)
                    with tempfile.NamedTemporaryFile(mode='w',encoding='utf-8',dir=path.parent,delete=False,suffix='.tmp') as tmp:
                        json.dump(doc,tmp,ensure_ascii=False,indent=2); tmp.write('\n');tmp_path=pathlib.Path(tmp.name)
                    os.replace(tmp_path,path)
                    if old_path and old_path != path: old_path.unlink()
                    written[key]=hash_content(doc)
                self._json(200, {'ok':True,'versions':written,'saved':len(written)})
        except Exception as exc:
            self._json(400, {'error':str(exc)})

if __name__ == '__main__':
    import argparse
    p = argparse.ArgumentParser();p.add_argument('--port',type=int,default=8765);p.add_argument('--no-browser',action='store_true');a=p.parse_args()
    srv=ThreadingHTTPServer(('127.0.0.1',a.port), Handler)
    url=f'http://127.0.0.1:{a.port}/'
    print('AdvogadoJá Workspace modular:',url,flush=True)
    if not a.no_browser: threading.Timer(.65,lambda:webbrowser.open(url)).start()
    try:srv.serve_forever()
    except KeyboardInterrupt: pass
