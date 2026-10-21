import json,pathlib
root=pathlib.Path(__file__).resolve().parent
cfg=json.loads((root/'projeto.json').read_text('utf8'))
html=(root/cfg['fontes']['estrutura']).read_text('utf8')
data=(root/cfg['fontes']['dados']).read_text('utf8').replace('</script>','<\\/script>').replace('<!--','<\\!--')
css=(root/cfg['fontes']['css']).read_text('utf8').replace('</style>','<\\/style>')
js='\n\n'.join((root/x).read_text('utf8') for x in cfg['fontes']['scripts']).replace('</script>','<\\/script>')
html=html.replace('/*__CSS__*/',css).replace('/*__DATA__*/',data).replace('/*__JS__*/',js)
out=root/cfg['saida'];out.parent.mkdir(exist_ok=True,parents=True);out.write_text(html,'utf8')
print(out, out.stat().st_size)
