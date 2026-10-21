#!/usr/bin/env python3
"""Compila uma pasta-fonte autônoma em um HTML autocontido.
Uso: python ferramentas/gerar_html.py exemplos/arvore-repositorio [--verificar]
Sem dependências de terceiros.
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

MODOS = {"arvore", "modulos", "aplicacao"}
ROOT = Path(__file__).resolve().parents[1]

class ErroProjeto(ValueError):
    pass


def carregar_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (ValueError, OSError) as exc:
        raise ErroProjeto(f"JSON inválido/ausente ({path}): {exc}") from exc


def resolver(projeto, relativo):
    if not isinstance(relativo, str) or not relativo or "\\" in relativo:
        raise ErroProjeto(f"Caminho inválido: {relativo!r}")
    p = (projeto / relativo).resolve()
    if not p.is_relative_to(projeto.resolve()) or not p.is_file():
        raise ErroProjeto(f"Arquivo fora do projeto ou ausente: {relativo}")
    return p


def validar_dados(manifesto, dados):
    if manifesto.get("modo") not in MODOS:
        raise ErroProjeto(f"modo deve ser um de {sorted(MODOS)}")
    if manifesto.get("schema") != "html.autocontido.projeto.v1":
        raise ErroProjeto("Schema do projeto não reconhecido")
    if dados.get("schema") != "html.autocontido.dados.v1":
        raise ErroProjeto("Schema dos dados não reconhecido")
    itens = dados.get("itens")
    if not isinstance(itens, list):
        raise ErroProjeto("dados.itens deve ser lista")
    mapa = {}
    for i, item in enumerate(itens):
        if not isinstance(item, dict):
            raise ErroProjeto(f"Item {i} não é objeto")
        uid = item.get("id")
        if not isinstance(uid, str) or not uid or uid.strip() != uid:
            raise ErroProjeto(f"ID inválido no item {i}")
        if uid in mapa:
            raise ErroProjeto(f"ID duplicado: {uid}")
        if not isinstance(item.get("titulo"), str) or not item["titulo"].strip():
            raise ErroProjeto(f"Item {uid}: título obrigatório")
        if not isinstance(item.get("parentId"), (str, type(None))):
            raise ErroProjeto(f"Item {uid}: parentId inválido")
        if "campos" in item and not isinstance(item["campos"], dict):
            raise ErroProjeto(f"Item {uid}: campos precisa ser um objeto")
        if "palavrasChave" in item and not (isinstance(item["palavrasChave"], list) and all(isinstance(x,str) for x in item["palavrasChave"])):
            raise ErroProjeto(f"Item {uid}: palavrasChave inválidas")
        mapa[uid] = item
    for uid, item in mapa.items():
        pai = item.get("parentId")
        if pai is not None and pai not in mapa:
            raise ErroProjeto(f"Item {uid} aponta para pai inexistente: {pai}")
        if pai == uid:
            raise ErroProjeto(f"Auto-referência em {uid}")
    # Validação linear: marca ancestralidade sem visitar várias vezes um ramo já verificado.
    verificados = set()
    for uid in mapa:
        caminho = set()
        atual = uid
        while atual is not None and atual not in verificados:
            if atual in caminho:
                raise ErroProjeto(f"Ciclo na hierarquia envolvendo {atual}")
            caminho.add(atual)
            atual = mapa[atual].get("parentId")
        verificados.update(caminho)
    return len(itens)


def localizar_externos(html):
    referencias = []
    # Recursos que tornariam o artefato não-autônomo.
    for rg in [r'<script\b[^>]*\bsrc\s*=',r'<link\b[^>]*\brel\s*=\s*["\']stylesheet',r'<iframe\b[^>]*\bsrc\s*=', r'@import\b']:
        if re.search(rg, html, re.I):
            referencias.append(rg)
    for rg in [r'\b(?:src|poster)\s*=\s*["\']https?://',r'url\(\s*["\']?https?://',r'\bfetch\s*\(\s*["\']https?://']:
        if re.search(rg,html,re.I):
            referencias.append(rg)
    return referencias


def escapar_json_bloco(dados):
    return (json.dumps(dados, ensure_ascii=False, separators=(",", ":"))
            .replace("&", "\\u0026").replace("<", "\\u003c").replace(">", "\\u003e")
            .replace("\u2028", "\\u2028").replace("\u2029", "\\u2029"))


def checar_js(js, manifest_path):
    node = shutil.which('node')
    if not node:
        print('  [aviso] Node.js não instalado; checagem de sintaxe JS pulada.', file=sys.stderr)
        return
    run = subprocess.run([node, '--check'], input=js, text=True, capture_output=True)
    # node --check sem - só usa stdin com argumento '-' em diferentes versões.
    if run.returncode != 0:
        proc=subprocess.run([node,'--check','-'],input=js,text=True,capture_output=True)
        if proc.returncode != 0:
            raise ErroProjeto(f"Sintaxe JavaScript inválida ({manifest_path}): {proc.stderr.strip()}")


def compilar(projeto):
    manifesto = carregar_json(resolver(projeto, 'projeto.json'))
    titulo = manifesto.get('titulo')
    slug = manifesto.get('id')
    if not isinstance(titulo,str) or not titulo.strip():
        raise ErroProjeto('projeto.json: titulo ausente')
    if not isinstance(slug,str) or not re.fullmatch(r'[a-z0-9][a-z0-9_-]*',slug):
        raise ErroProjeto('projeto.json: id deve ser slug estável, ex.: meu-modulo')
    dados = carregar_json(resolver(projeto, manifesto.get('dados', 'dados/conteudo.json')))
    n = validar_dados(manifesto,dados)
    folhas = manifesto.get('estilos',[])
    scripts = manifesto.get('comportamentos',[])
    if not isinstance(folhas,list) or not folhas or not isinstance(scripts,list) or not scripts:
        raise ErroProjeto('estilos e comportamentos devem ser listas não vazias, em ordem explícita')
    template = resolver(projeto, manifesto.get('interface','interface/estrutura.html')).read_text(encoding='utf-8')
    css = '\n\n'.join(f'/* @ARQUIVO: {nome} */\n'+resolver(projeto,nome).read_text(encoding='utf-8') for nome in folhas)
    js = '\n\n'.join(f'/* @ARQUIVO: {nome} */\n'+resolver(projeto,nome).read_text(encoding='utf-8') for nome in scripts)
    if re.search(r'</script',js,re.I) or re.search(r'</style',css,re.I):
        raise ErroProjeto('Código contém fechamento literal inseguro de tag script/style')
    checar_js(js, slug)
    payload = {'schema':dados['schema'], 'versao':dados.get('versao',1), 'projeto':{'id':slug,'titulo':titulo,'modo':manifesto['modo']}, 'itens':dados['itens']}
    replacements = {
      '{{TITULO}}': titulo.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;'),
      '{{ESTILOS}}': css,
      '{{DADOS_JSON}}': escapar_json_bloco(payload),
      '{{COMPORTAMENTOS}}': js,
    }
    for needle, value in replacements.items():
        quantidade = template.count(needle)
        if (needle == '{{TITULO}}' and quantidade < 1) or (needle != '{{TITULO}}' and quantidade != 1):
            raise ErroProjeto(f'O template contém quantidade inesperada de placeholders {needle}: {quantidade}')
        template = template.replace(needle,value)
    if localizar_externos(template):
        raise ErroProjeto('O HTML contém referência externa/arquivo obrigatório: '+', '.join(localizar_externos(template)))
    # Testes para garantir que os dados não foram omitidos ou alterados durante o escape.
    recuperado=re.search(r'<script\s+id="app-data"\s+type="application/json">(.*?)</script>',template,re.S)
    if not recuperado or json.loads(recuperado.group(1)) != payload:
        raise ErroProjeto('Falha ao embutir e revalidar o JSON de origem')
    return slug, template, n


def main():
    parser=argparse.ArgumentParser(description='Compila artefato autônomo HTML offline a partir de fontes locais')
    parser.add_argument('projeto',help='Pasta contendo projeto.json (ex.: exemplos/arvore-repositorio)')
    parser.add_argument('--verificar',action='store_true',help='Não escreve; compara com HTML anterior, se existir')
    args=parser.parse_args()
    projeto = Path(args.projeto)
    if not projeto.is_absolute(): projeto=ROOT/projeto
    projeto=projeto.resolve()
    if not projeto.is_dir():
        parser.error(f'Pasta não encontrada: {projeto}')
    try:
        slug,html,n=compilar(projeto)
        dest=projeto/'saida'/f'{slug}.html'
        if args.verificar:
            if not dest.is_file(): raise ErroProjeto('HTML de saída ainda não foi gerado')
            if dest.read_text('utf-8')!=html: raise ErroProjeto('Fonte e HTML de saída divergiram; execute gerar_html.py novamente')
            print(f'OK: build determinístico e atualizado: {dest}')
        else:
            dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_text(html,encoding='utf-8')
            print(f'GERADO: {dest} | {n} itens | {len(html):,} caracteres | modo={carregar_json(projeto/"projeto.json")["modo"]}')
    except ErroProjeto as e:
        print(f'ERRO: {e}',file=sys.stderr)
        sys.exit(1)

if __name__=='__main__':main()
