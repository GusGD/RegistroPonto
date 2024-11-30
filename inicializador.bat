@echo off
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: Node.js não está instalado ou não está no PATH.
    pause
    exit /b
)

cd /d "Caminho/diretorio/arquivo/js"

start /min "" cmd /c "node index.js"

exit /b
