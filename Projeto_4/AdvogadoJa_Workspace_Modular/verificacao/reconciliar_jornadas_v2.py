#!/usr/bin/env python3
"""Concilia classificacao.jornadas com variantes JÁ instanciadas no próprio JSON.
Não lê caminhos legados, não inventa telas, não modifica IDs nem Flow.
"""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
changed=[]
for p in (root/'catalogo/telas').rglob('*.json'):
 t=json.loads(p.read_text(encoding='utf-8'))
 current=t['classificacao']['jornadas']
 if '*' in current: continue
 declared={j for i in t['componentes']['instancias'] for j in i.get('aplicaA',{}).get('jornadas',[]) if j!='*'}
 merged=list(dict.fromkeys(current+sorted(declared)))
 if merged==current:continue
 t['classificacao']['jornadas']=merged
 t['classificacao']['compartilhada']=len(merged)>1
 changed.append({'tela':t['identidade']['id'],'anteriores':current,'declaradasPelasInstancias':sorted(declared),'atuais':merged})
 p.write_text(json.dumps(t,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
manifest={'criterio':'Union da participação original com aplicaA.jornadas das instâncias da MESMA tela. Apenas variantes já existentes, sem inferir de nome ou de rota.','alteradas':changed}
report_path=root/'verificacao'/'relatorio_conciliacao_jornadas_v2.json'
if changed or not report_path.exists():
 report_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Telas com jornada conciliada:',len(changed))
