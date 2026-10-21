@echo off
setlocal
cd /d "%~dp0"
if "%~1"=="" (
  echo Uso: CRIAR_HTML.cmd ^<pasta_do_projeto^> [--verificar]
  echo Exemplo: CRIAR_HTML.cmd exemplos\arvore-repositorio
  exit /b 2
)
where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  py -3 "%~dp0ferramentas\gerar_html.py" %*
) else (
  python "%~dp0ferramentas\gerar_html.py" %*
)
exit /b %ERRORLEVEL%
