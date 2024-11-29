@echo off
echo Verificando se o Node.js está sendo executado...

cd "Caminho/diretorio/arquivo/js"

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: Node.js não está instalado ou não está no PATH.
    exit /b
)

echo Iniciando o script Node.js...

start /min "" node index.js

echo O script Node.js está em execução.

:loop
for /f "tokens=1-2 delims=:" %%h in ("%time%") do set horaAtual=%%h:%%i

if "%horaAtual%" geq "18:10" (
    echo Encerrando o script Node.js às %horaAtual%...
    taskkill /f /im node.exe >nul 2>&1
    exit /b
)

timeout /t 60 >nul
goto loop
