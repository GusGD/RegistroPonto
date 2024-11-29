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

echo Aguardando interrupção. Pressione Ctrl+C para parar...

:loop
timeout /t 60 >nul
goto loop
