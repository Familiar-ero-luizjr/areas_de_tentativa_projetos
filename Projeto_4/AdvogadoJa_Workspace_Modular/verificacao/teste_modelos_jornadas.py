#!/usr/bin/env python3
"""Teste de contrato das novas áreas (sem dependências externas)."""
from pathlib import Path
import json, re, subprocess
ROOT=Path(__file__).resolve().parents[1]
index=(ROOT/'index.html').read_text(encoding='utf-8')
for token in ('data-tab="modelos"','id="mdlTree"','id="mdlCheck"','id="jioImport"','id="jioExport"','jornadas/intercambio.js','modelos/modelos.js'):
    assert token in index, token
for rel in ('modelos/modelos.js','jornadas/intercambio.js'):
    subprocess.run(['node','--check',str(ROOT/rel)],check=True)
for rel in ('contratos/catalogo.pacote.schema.proposto.json','contratos/jornada.intercambio.schema.proposto.json'):
    doc=json.loads((ROOT/rel).read_text(encoding='utf-8'))
    assert doc['type']=='object' and doc['$schema'].endswith('/2020-12/schema')
for rel in ('app/bootstrap.js','app/interface.js'):
    body=(ROOT/rel).read_text(encoding='utf-8')
    assert ('mdlWire' if 'bootstrap' in rel else 'mdlRender') in body
print('OK: interfaces, scripts, schemas e integrações de Modelos/Jornadas')
