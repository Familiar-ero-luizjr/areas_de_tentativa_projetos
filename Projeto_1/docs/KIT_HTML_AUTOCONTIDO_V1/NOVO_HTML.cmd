@echo off
setlocal
cd /d "%~dp0"
if "%~2"=="" (
  echo Uso: NOVO_HTML.cmd ^<id-do-projeto^> ^<arvore^|modulos^|aplicacao^>
  echo Exemplo: NOVO_HTML.cmd meu-painel aplicacao
  exit /b 2
)
where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  py -3 "%~dp0ferramentas\novo_html.py" %*
) else (
  python "%~dp0ferramentas\novo_html.py" %*
)
exit /b %ERRORLEVEL%
