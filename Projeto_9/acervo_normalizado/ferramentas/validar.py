#!/usr/bin/env python3
"""Validador estrutural do padrão AdvogadoJá UI v1.

Uso: python VALIDADOR_CONTRATO_UI_V1.py EXEMPLO_CONTRATO_UI_CANONICO_V1.json

Este utilitário não prova paridade visual, compatibilidade de motor ou regras de negócio.
Dependência: apenas Python 3.10+.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

BLOCKS=("identidade","classificacao","estrutura","estados","variantes","interacoes","dados","mocks")
NO_ROOT=("navegacao","acoes","estadosVisuais","estadoVisual")
COND_OPERATORS={"igual","diferente","existe","nao_existe","maior","menor","em"}
VOID_HTML={"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"}

class Validator:
    def __init__(self):
        self.errors=[]
        self.warnings=[]

    def err(self,where,msg):self.errors.append(f"{where}: {msg}")
    def warn(self,where,msg):self.warnings.append(f"{where}: {msg}")

    def dict(self,where,value):
        if not isinstance(value,dict):self.err(where,"deve ser objeto");return {}
        return value

    def arr(self,where,value):
        if not isinstance(value,list):self.err(where,"deve ser lista");return []
        return value

    def nonempty(self,where,value):
        if not isinstance(value,str) or not value.strip():self.err(where,"deve ser string não vazia");return False
        return True

    def indexed_items(self,items,where):
        ids=set()
        for n,item in enumerate(self.arr(where,items)):
            p=f"{where}[{n}]"
            if not isinstance(item,dict):self.err(p,"deve ser objeto");continue
            if self.nonempty(p+'.id',item.get('id')):
                if item['id'] in ids:self.err(p,"ID duplicado")
                ids.add(item['id'])
        return ids

    def check_common(self,id_,kind,obj,where):
        x=self.dict(where,obj)
        if set(BLOCKS)!=set(x):
            self.err(where,f"blocos obrigatórios: {', '.join(BLOCKS)}; faltam {sorted(set(BLOCKS)-set(x))}; extras {sorted(set(x)-set(BLOCKS))}")
        ident=self.dict(where+'.identidade',x.get('identidade'))
        if ident.get('id')!=id_:self.err(where+'.identidade.id',"deve coincidir exatamente com chave do pacote")
        if ident.get('tipo')!=kind:self.err(where+'.identidade.tipo',f"deve ser {kind!r}")
        self.nonempty(where+'.identidade.nome',ident.get('nome'))
        cl=self.dict(where+'.classificacao',x.get('classificacao'))
        loc=self.dict(where+'.classificacao.localizacao',cl.get('localizacao'))
        caminho=loc.get('caminho')
        if self.nonempty(where+'.classificacao.localizacao.caminho',caminho):
            if caminho.startswith('/') or '..' in caminho.split('/') or not caminho.endswith('/documento.json'):
                self.err(where+'.classificacao.localizacao.caminho',"caminho relativo seguro terminando em /documento.json")
            prefix=('telas/' if kind=='tela' else 'componentes/')
            if not caminho.startswith(prefix):self.err(where+'.classificacao.localizacao.caminho',f"deve iniciar em {prefix!r}")
        self.dict(where+'.classificacao.escopo',cl.get('escopo'))
        self.arr(where+'.classificacao.jornadas',cl.get('jornadas'))
        self.dict(where+'.estrutura',x.get('estrutura'))
        self.dict(where+'.estados',x.get('estados'))
        self.arr(where+'.variantes',x.get('variantes'))
        self.arr(where+'.interacoes',x.get('interacoes'))
        d=self.dict(where+'.dados',x.get('dados'))
        if set(d)!={'fontes','operacoes'}:self.err(where+'.dados',"usar apenas fontes e operacoes, ambas listas")
        self.indexed_items(d.get('fontes'),where+'.dados.fontes')
        self.indexed_items(d.get('operacoes'),where+'.dados.operacoes')
        m=self.dict(where+'.mocks',x.get('mocks'))
        if set(m)!={'cenarios'}:self.err(where+'.mocks',"usar somente cenarios: []")
        self.indexed_items(m.get('cenarios'),where+'.mocks.cenarios')
        return x

    def css(self,css,where):
        x=self.dict(where,css)
        if set(x)!={'tokens','regras'}:self.err(where,"deve conter somente tokens: {} e regras: []")
        tokens=self.dict(where+'.tokens',x.get('tokens'))
        for k,v in tokens.items():
            if not isinstance(k,str) or not k.startswith('--'):self.err(where+'.tokens',f"token inválido: {k!r}")
            if not isinstance(v,str):self.err(where+f'.tokens[{k}]',"valor deve ser string CSS")
        rules=self.arr(where+'.regras',x.get('regras'))
        ids=set();last=None
        for i,r in enumerate(rules):
            p=f'{where}.regras[{i}]'
            if not isinstance(r,dict):self.err(p,'deve ser objeto');continue
            if set(r)!={'id','ordem','css'}:self.err(p,'campos exatos: id, ordem, css')
            idr=r.get('id');ordem=r.get('ordem')
            if self.nonempty(p+'.id',idr):
                if idr in ids:self.err(p,'id de regra duplicado')
                ids.add(idr)
            if isinstance(ordem,bool) or not isinstance(ordem,int):self.err(p+'.ordem','deve ser inteiro')
            elif last is not None and ordem<=last:self.err(p+'.ordem','ordem deve ser estritamente crescente')
            else:last=ordem
            css_text=r.get('css')
            if self.nonempty(p+'.css',css_text):
                if '<script' in css_text.lower():self.err(p+'.css','não pode conter HTML script')
        return x

    def cycle(self,items,where):
        marks={}
        def visit(k):
            if marks.get(k)==1:self.err(where,f"ciclo envolvendo {k}");return
            if marks.get(k)==2:return
            marks[k]=1
            p=items[k].get('paiRef') if isinstance(items[k],dict) else None
            if p in items:visit(p)
            marks[k]=2
        for k in items:visit(k)

    def nodes(self,comp,where):
        h=self.dict(where,comp.get('estrutura',{}).get('html'))
        if set(h)!={'raizRef','elementos','vinculos','colecoes','condicionais'}:
            self.err(where,'html do componente: raizRef, elementos, vinculos, colecoes, condicionais')
        elems=self.dict(where+'.elementos',h.get('elementos'))
        root=h.get('raizRef')
        if root not in elems:self.err(where+'.raizRef','raizRef deve existir em elementos')
        roots=[];sibling_orders={};children={k:0 for k in elems}
        for k,e in elems.items():
            p=f'{where}.elementos[{k}]'
            if not isinstance(e,dict):self.err(p,'deve ser objeto');continue
            if set(e)!={'tag','paiRef','ordem','atributos','texto'}:self.err(p,'campos exatos: tag, paiRef, ordem, atributos, texto')
            tag=e.get('tag');parent=e.get('paiRef')
            if not self.nonempty(p+'.tag',tag):continue
            if parent is None:roots.append(k)
            elif parent not in elems:self.err(p+'.paiRef',f'elemento pai não encontrado: {parent}')
            else:children[parent]=children.get(parent,0)+1
            order=e.get('ordem')
            if isinstance(order,bool) or not isinstance(order,int):self.err(p+'.ordem','deve ser inteiro')
            else:
                key=(parent,order)
                if key in sibling_orders:self.err(p+'.ordem',f'ordem repetida entre irmãos ({sibling_orders[key]})')
                sibling_orders[key]=k
            attrs=self.dict(p+'.atributos',e.get('atributos'))
            if tag=='#text':
                if attrs:self.err(p+'.atributos','nó #text não tem atributos')
            elif e.get('texto')!='':self.err(p+'.texto','texto de tag real deve ser string vazia; use nós #text')
            if not isinstance(e.get('texto'),str):self.err(p+'.texto','deve ser string')
            if tag in VOID_HTML and children.get(k,0):self.err(p,f'tag void {tag} não pode ter filhos')
        for k,e in elems.items():
            if isinstance(e,dict) and e.get('tag')=='#text' and children.get(k,0):self.err(where+f'.elementos[{k}]','nó #text não pode ter filhos')
            if isinstance(e,dict) and e.get('tag') in VOID_HTML and children.get(k,0):self.err(where+f'.elementos[{k}]','tag void não pode ter filhos')
        if roots!=[root]:self.err(where,f'deve haver uma única raiz {root!r}; encontradas {roots}')
        self.cycle(elems,where+'.elementos')
        ids=self.indexed_items(h.get('vinculos'),where+'.vinculos')
        for i,b in enumerate(self.arr(where+'.vinculos',h.get('vinculos'))):
            if not isinstance(b,dict):continue
            p=f'{where}.vinculos[{i}]';ref=b.get('elementoRef')
            if ref not in elems:self.err(p+'.elementoRef','não resolve elemento')
            if b.get('alvo') not in ('texto','atributo'):self.err(p+'.alvo','deve ser texto ou atributo')
            if b.get('alvo')=='texto' and ref in elems and elems[ref].get('tag')!='#text':self.err(p+'.alvo','texto deve apontar para #text')
            if b.get('alvo')=='atributo' and not b.get('atributo'):self.err(p,'alvo atributo precisa de atributo')
            if not isinstance(b.get('campo'),str) or not b['campo'].startswith('props.'):
                self.err(p+'.campo','deve iniciar em props.')
        self.indexed_items(h.get('colecoes'),where+'.colecoes')
        for i,b in enumerate(self.arr(where+'.colecoes',h.get('colecoes'))):
            if not isinstance(b,dict):continue
            p=f'{where}.colecoes[{i}]'
            for fld in ('containerRef','modeloRef'):
                if b.get(fld) not in elems:self.err(p+'.'+fld,'elemento inexistente')
            if not isinstance(b.get('fonte'),str) or not b['fonte'].startswith('props.'):
                self.err(p+'.fonte','deve iniciar em props.')
            self.nonempty(p+'.chave',b.get('chave'))
        self.indexed_items(h.get('condicionais'),where+'.condicionais')
        for i,b in enumerate(self.arr(where+'.condicionais',h.get('condicionais'))):
            if not isinstance(b,dict):continue
            p=f'{where}.condicionais[{i}]'
            if b.get('alvoRef') not in elems:self.err(p+'.alvoRef','elemento inexistente')
            self.when(b.get('quando'),p+'.quando')
            if b.get('acao') not in ('exibir','ocultar'):self.err(p+'.acao','deve ser exibir ou ocultar')
        return h,elems

    def when(self,when,where):
        w=self.dict(where,when)
        self.nonempty(where+'.fonte',w.get('fonte'))
        if w.get('operador') not in COND_OPERATORS:self.err(where+'.operador','operador não permitido')
        if w.get('operador') not in ('existe','nao_existe') and 'valor' not in w:self.err(where,'falta valor')

    def states(self,states,owner_kind,elements,instances,components,where):
        for d,desc in self.dict(where,states).items():
            p=where+'.'+d
            dim=self.dict(p,desc)
            self.nonempty(p+'.inicial',dim.get('inicial'))
            ops=self.dict(p+'.opcoes',dim.get('opcoes'))
            if dim.get('inicial') not in ops:self.err(p+'.inicial','inicial deve ser chave de opcoes')
            if not ops:self.err(p+'.opcoes','não pode estar vazio')
            for option,config in ops.items():
                cp=p+'.opcoes.'+option
                alvos=self.arr(cp+'.alvos',self.dict(cp,config).get('alvos'))
                for i,target in enumerate(alvos):
                    ap=f'{cp}.alvos[{i}]'
                    a=self.dict(ap,target);typ=a.get('tipo');ref=a.get('ref')
                    if owner_kind=='componente':
                        if typ!='elemento' or ref not in elements:self.err(ap,'alvo de componente deve ser elemento existente')
                        if 'instanciaRef' in a:self.err(ap,'componente não usa instanciaRef')
                    else:
                        if typ=='instancia':
                            if ref not in instances:self.err(ap,'instância não encontrada')
                        elif typ=='elemento':
                            parent=a.get('instanciaRef')
                            if parent not in instances:self.err(ap,'instanciaRef da tela não encontrada')
                            else:
                                comp=components.get(instances[parent].get('componenteRef'),{})
                                elems=comp.get('estrutura',{}).get('html',{}).get('elementos',{})
                                if ref not in elems:self.err(ap,'elemento não encontrado na instância')
                        else:self.err(ap,'alvo da Tela deve ser instancia ou elemento')
                    classes=self.dict(ap+'.classes',a.get('classes'))
                    for name,flag in classes.items():
                        if not isinstance(flag,bool):self.err(ap+f'.classes.{name}','valor deve ser booleano')
                    self.dict(ap+'.atributos',a.get('atributos'))

    def validate(self,bundle):
        b=self.dict('pacote',bundle)
        if set(b)!={'schema','schemaVersion','telas','componentes'}:self.err('pacote','campos: schema, schemaVersion, telas, componentes')
        if b.get('schema')!='advogadoja.ui.bundle':self.err('pacote.schema','deve ser advogadoja.ui.bundle')
        if b.get('schemaVersion')!='1.0.0':self.err('pacote.schemaVersion','deve ser 1.0.0')
        telas=self.dict('pacote.telas',b.get('telas'))
        comps=self.dict('pacote.componentes',b.get('componentes'))
        if not telas:self.err('pacote.telas','pelo menos uma tela no pacote de validação')
        nodes={};events={}
        for id_,obj in comps.items():
            p=f'componentes[{id_}]';x=self.check_common(id_,'componente',obj,p)
            struct=self.dict(p+'.estrutura',x.get('estrutura'))
            if set(struct)!={'html','css'}:self.err(p+'.estrutura','somente html e css')
            h,elems=self.nodes(x,p+'.estrutura.html');nodes[id_]=elems
            self.css(struct.get('css'),p+'.estrutura.css')
            eventIDs=self.indexed_items(x.get('interacoes'),p+'.interacoes');events[id_]=eventIDs
            for i,e in enumerate(x.get('interacoes',[]) if isinstance(x.get('interacoes'),list) else []):
                if not isinstance(e,dict):continue
                ep=f'{p}.interacoes[{i}]'
                if e.get('elementoRef') not in elems:self.err(ep+'.elementoRef','elemento não encontrado')
                self.nonempty(ep+'.evento',e.get('evento'))
                if set(e)!={'id','elementoRef','evento'}:self.err(ep,'campos exatos id, elementoRef, evento')
            self.states(x.get('estados'),'componente',elems,{},comps,p+'.estados')
            self.indexed_items(x.get('variantes'),p+'.variantes')
            for i,v in enumerate(x.get('variantes',[]) if isinstance(x.get('variantes'),list) else []):
                if isinstance(v,dict):
                    self.when(v.get('quando'),p+f'.variantes[{i}].quando')
        for id_,obj in telas.items():
            p=f'telas[{id_}]';x=self.check_common(id_,'tela',obj,p)
            struct=self.dict(p+'.estrutura',x.get('estrutura'))
            if set(struct)!={'html','css'}:self.err(p+'.estrutura','somente html e css')
            h=self.dict(p+'.estrutura.html',struct.get('html'))
            if set(h)!={'raizRef','composicao'}:self.err(p+'.estrutura.html','somente raizRef e composicao')
            self.css(struct.get('css'),p+'.estrutura.css')
            instances=self.dict(p+'.estrutura.html.composicao',h.get('composicao'))
            root=h.get('raizRef');roots=[];sibling={}
            if root not in instances:self.err(p+'.estrutura.html.raizRef','instância raiz não encontrada')
            for k,ins in instances.items():
                ip=p+f'.estrutura.html.composicao[{k}]'
                if not isinstance(ins,dict):self.err(ip,'deve ser objeto');continue
                if set(ins)!={'componenteRef','paiRef','alvoRef','ordem','props','estados'}:
                    self.err(ip,'campos exatos: componenteRef, paiRef, alvoRef, ordem, props, estados')
                cref=ins.get('componenteRef')
                if cref not in comps:self.err(ip+'.componenteRef',f'componente não encontrado: {cref}')
                parent=ins.get('paiRef');target=ins.get('alvoRef')
                if parent is None:
                    roots.append(k)
                    if target is not None:self.err(ip+'.alvoRef','raiz deve ser null')
                elif parent not in instances:self.err(ip+'.paiRef',f'instância pai não encontrada: {parent}')
                elif target not in nodes.get(instances[parent].get('componenteRef'),{}):
                    self.err(ip+'.alvoRef',f'elemento alvo não encontrado no componente da instância pai: {target}')
                order=ins.get('ordem')
                if isinstance(order,bool) or not isinstance(order,int):self.err(ip+'.ordem','deve ser inteiro')
                else:
                    pair=(parent,target,order)
                    if pair in sibling:self.err(ip+'.ordem',f'ordem repetida com {sibling[pair]}')
                    sibling[pair]=k
                props=self.dict(ip+'.props',ins.get('props'))
                overrides=self.dict(ip+'.estados',ins.get('estados'))
                if cref in comps:
                    cstates=comps[cref].get('estados',{})
                    for d,v in overrides.items():
                        op=cstates.get(d,{}).get('opcoes',{})
                        if v not in op:self.err(ip+f'.estados.{d}',f'opção {v!r} não existe em {cref}')
                    ch=comps[cref].get('estrutura',{}).get('html',{})
                    for n,link in enumerate(ch.get('vinculos',[])):
                        if not isinstance(link,dict):continue
                        f=link.get('campo','')
                        if f.startswith('props.'):
                            cur=props
                            for bit in f.split('.')[1:]:
                                if isinstance(cur,dict) and bit in cur:cur=cur[bit]
                                else:self.warn(ip+f'.props',f"valor de {f} não informado (vínculo {n})");break
            if roots!=[root]:self.err(p+'.estrutura.html.composicao',f'instância raiz deve ser única {root!r}, encontradas {roots}')
            self.cycle(instances,p+'.estrutura.html.composicao')
            self.states(x.get('estados'),'tela',{},instances,comps,p+'.estados')
            self.indexed_items(x.get('variantes'),p+'.variantes')
            self.indexed_items(x.get('interacoes'),p+'.interacoes')
            seen_links=set()
            for i,e in enumerate(x.get('interacoes',[]) if isinstance(x.get('interacoes'),list) else []):
                ep=p+f'.interacoes[{i}]'
                if not isinstance(e,dict):continue
                orig=self.dict(ep+'.origem',e.get('origem'))
                instid=orig.get('instanciaRef');ev=orig.get('eventoRef')
                if instid not in instances:self.err(ep+'.origem.instanciaRef','instância inexistente')
                else:
                    cref=instances[instid].get('componenteRef')
                    if ev not in events.get(cref,set()):self.err(ep+'.origem.eventoRef',f'evento não definido pelo componente {cref}')
                key=(instid,ev)
                if key in seen_links and 'quando' not in e:self.err(ep,'mesmo evento tem múltiplos efeitos sem condição explícita')
                seen_links.add(key)
                if 'quando' in e:self.when(e['quando'],ep+'.quando')
                eff=self.dict(ep+'.efeito',e.get('efeito'))
                typ=eff.get('tipo')
                if typ=='navegar':
                    if eff.get('destinoRef') not in telas:self.err(ep+'.efeito.destinoRef','tela de destino não está no pacote validado')
                    if set(eff)!={'tipo','destinoRef'}:self.err(ep+'.efeito','navegar só admite tipo e destinoRef')
                elif typ=='definir_estado':
                    dest=eff.get('instanciaRef');dim=eff.get('dimensao');val=eff.get('valor')
                    if dest not in instances:self.err(ep+'.efeito.instanciaRef','instância de estado inexistente')
                    else:
                        state=comps.get(instances[dest].get('componenteRef'),{}).get('estados',{})
                        if val not in state.get(dim,{}).get('opcoes',{}):self.err(ep+'.efeito','dimensão/valor de estado não declarados pelo componente')
                    if set(eff)!={'tipo','instanciaRef','dimensao','valor'}:self.err(ep+'.efeito','definir_estado: campos exatos tipo, instanciaRef, dimensao, valor')
                elif typ=='operacao':
                    ops={z.get('id') for z in x.get('dados',{}).get('operacoes',[]) if isinstance(z,dict)}
                    if eff.get('operacaoRef') not in ops:self.err(ep+'.efeito.operacaoRef','operação inexistente em dados.operacoes')
                else:self.err(ep+'.efeito.tipo',f'efeito não permitido: {typ!r}')
        return not self.errors


def main():
    if len(sys.argv)!=2:
        print('Uso: python VALIDADOR_CONTRATO_UI_V1.py <arquivo.json>',file=sys.stderr)
        return 2
    path=Path(sys.argv[1])
    try:bundle=json.loads(path.read_text(encoding='utf8'))
    except (OSError,UnicodeError,json.JSONDecodeError) as e:
        print(f'ERRO lendo {path}: {e}',file=sys.stderr);return 2
    val=Validator();ok=val.validate(bundle)
    for w in val.warnings:print('AVISO:',w)
    for err in val.errors:print('ERRO:',err)
    if ok:
        print(f'OK: {len(bundle.get("telas",{}))} Tela(s), {len(bundle.get("componentes",{}))} Componente(s); invariantes estruturais válidas.')
        print('Atenção: ainda é necessário testar CSS, renderização, acessibilidade e o funcionamento dos módulos.')
        return 0
    print(f'FALHA: {len(val.errors)} erro(s), {len(val.warnings)} aviso(s).',file=sys.stderr)
    return 1

if __name__=='__main__':raise SystemExit(main())
