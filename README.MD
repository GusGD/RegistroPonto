# Registro de Ponto automático

# 1. Clonar o Repositório

Faça o clone do repositório em seu ambiente local:
`git clone <URL_DO_REPOSITORIO>`

# 2. Instalar Dependências

Após clonar o repositório, entre na pasta do projeto e instale as dependências necessárias. Você pode escolher entre usar npm ou yarn:

Usando npm: `npm install`

Usando yarn: `yarn add`

#3. Crie um arquivo .env, usando como exemplo o `.env-example` e preencha com suas informações.

#4. Iniciar o Projeto
Para iniciar o projeto, execute o comando abaixo no terminal dentro da pasta do projeto:
`npm run start index.js`

# 5. Configurar Execução Automática no Windows

Localize o arquivo `inicializador.bat` incluído no repositório e altere o `cd /d "Caminho/diretorio/arquivo/js"` para o caminho da pasta do arquivo do index.js

Copie o arquivo para o seguinte caminho:
`C:\Users\<SEU_USUÁRIO>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`
