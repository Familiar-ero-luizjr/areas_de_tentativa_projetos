#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
os.chdir(Path(__file__).parent)
print('Abra: http://localhost:8765')
ThreadingHTTPServer(('127.0.0.1',8765),SimpleHTTPRequestHandler).serve_forever()
