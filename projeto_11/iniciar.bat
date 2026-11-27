@echo off
cd /d "%~dp0"
where py >nul 2>nul
if errorlevel 1 (python -m http.server 8000) else (py -m http.server 8000)
pause
