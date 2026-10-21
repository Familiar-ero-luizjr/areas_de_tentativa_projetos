#!/usr/bin/env python3
"""Cria projeto HTML autônomo novo copiando a fonte-base, sem imports de outros projetos."""
import argparse,json,re,shutil,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]


def main():
    parser=argparse.ArgumentParser(description='Cria nova pasta-fonte autônoma para um HTML')
    parser.add_argument('id',help='slug, por exemplo fluxo-cadastro')
    parser.add_argument('modo',choices=['arvore','modulos','aplicacao'])
    parser.add_argument('--titulo',default=None,help='Título visível do HTML')
    args=parser.parse_args()
    if not re.fullmatch(r'[a-z0-9][a-z0-9_-]*',args.id):parser.error('Use slug minúsculo (letras, números, hífen ou sublinhado)')
    novo=ROOT/'projetos'/args.id
    if novo.exists():parser.error('Já existe; criação não sobrescreve fonte: '+str(novo))
    novo.parent.mkdir(parents=True,exist_ok=True)
    shutil.copytree(ROOT/'modelos/projeto_base',novo,ignore=shutil.ignore_patterns('saida'))
    meta=json.loads((novo/'projeto.json').read_text('utf-8'))
    meta['id']=args.id;meta['titulo']=args.titulo or args.id.replace('-',' ').replace('_',' ').title();meta['modo']=args.modo
    (novo/'projeto.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    dados={'schema':'html.autocontido.dados.v1','versao':1,'itens':[
      {'id':'inicio','parentId':None,'titulo':'EXEMPLO — substituir pelos seus dados', 'tipo':'exemplo',
       'descricao':'Registro demonstrativo criado pelo scaffold. Remova ou substitua antes de publicar.',
       'campos':{'status':'fictício, não usar como informação real'}}
    ]}
    (novo/'dados/conteudo.json').write_text(json.dumps(dados,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    proc=subprocess.run([sys.executable,str(ROOT/'ferramentas/gerar_html.py'),str(novo)])
    if proc.returncode:sys.exit(proc.returncode)
    print('\nFonte autônoma: '+str(novo))
    print('Edite dados/conteudo.json, estilos/tema.css, interface/estrutura.html e comportamentos/*.js')
    print('Recompile usando: CRIAR_HTML.cmd projetos\\'+args.id)

if __name__=='__main__':main()
