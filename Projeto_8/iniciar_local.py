#!/usr/bin/env python3
"""Executa os arquivos locais do Projeto 8 sem serviços externos nem dependências Python."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, webbrowser
os.chdir(Path(__file__).resolve().parent)
s=ThreadingHTTPServer(('127.0.0.1',8768),SimpleHTTPRequestHandler)
print('Abrir no navegador: http://127.0.0.1:8768/');print('Ctrl+C encerra o servidor.')
try:s.serve_forever()
except KeyboardInterrupt:pass
