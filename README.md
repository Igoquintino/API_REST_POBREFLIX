# 🎬 Pobreflix API - Backend de Streaming

Pobreflix é uma API desenvolvida em **Node.js** com **Express** e **PostgreSQL** para gerenciar um serviço de streaming simples. A API permite cadastro e autenticação de usuários, gerenciamento de catálogo de filmes/séries, controle de histórico de visualização e muito mais.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework para criação de APIs
- **PostgreSQL** - Banco de dados relacional
- **JWT (JSON Web Token)** - Autenticação segura
- **bcrypt** - Hash de senhas para segurança
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## 📦 Estrutura do Projeto

```
/API_REST_POBREFLIX
│── /config        # Configurações gerais (database, blacklist)
│── /node_modules  # Dependências do projeto
│── /src           # Código-fonte principal
│   │── /controllers   # Lógica das rotas
│   │── /middlewares   # Middleware de autenticação JWT
│   │── /models        # Manipulação do banco de dados
│   │── /routes        # Define as rotas da API
│   │── /utils         # Funções auxiliares (JWT, etc.)
│   │── server.js      # Arquivo principal para inicializar o servidor
│── .env           # Variáveis de ambiente (JWT_SECRET, DB_URI, etc.)
│── package.json   # Dependências e scripts do projeto
│── yarn.lock      # Gerenciamento de pacotes com Yarn
│── tabelas_pobreFlix.sql  # Script de criação das tabelas do banco de dados
```

---

## 📂 Banco de Dados
O arquivo `tabelas_pobreFlix.sql` contém a estrutura do banco de dados necessária para rodar a aplicação. Antes de iniciar o projeto, execute esse script no PostgreSQL para criar as tabelas.

```sh
psql -U seu_usuario -d pobreflix -f tabelas_pobreFlix.sql
```

---

## 🛠️ Instalação e Execução

### 1️⃣ Clonar o Repositório
```sh
git clone https://github.com/Igoquintino/API_REST_POBREFLIX.git
cd API_REST_POBREFLIX
```

### 2️⃣ Instalar Dependências
```sh
npm install
```

### 3️⃣ Configurar Banco de Dados
Crie um arquivo `.env` na raiz do projeto e adicione:
```sh
CONNECTION_STRING=postgres://usuario:senha@localhost:(5432 ou porta_que_escolheu)/nome_do_seu_banco
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=2h
PORT=3000
```
  
### 4️⃣ Executar a API
caso não tenha instalado para desenvolvimento o nodemon ou yarn, instale com  
```sh 
npm install --save-dev nodemon # Instalação local (dentro do projeto, recomendado para evitar conflitos)
```  
O Yarn é um gerenciador de pacotes para JavaScript, procure instalar por favor caso queira, para esse projeto ele ja vai configurado.  

agora sobre a exercução:
```sh
node ./src/server.js || npm run prod  # com node normal, sem reiniciar automaticamente  
npm run dev # Para exercutar e reexecutar a cada modificações usando o npm e nodemon   
yarn start # Para exercutar e reexecutar a cada modificações
```
O servidor rodará em: **http://localhost:3000**

---

## 🔥 Rotas Disponíveis

### 🟢 **GET (Listar Dados)**
- `GET /catalog` → Listar todos os filmes/séries (Usuário Autenticado)
- `GET /catalog/type/:content_type` → Buscar catálogo por tipo (Usuário Autenticado)
- `GET /catalog/:title` → Buscar catálogo por título (Usuário Autenticado)
- `GET /users` → Listar todos os usuários (Apenas Administrador)
- `GET /users/search` → Buscar usuário por ID, Nome ou Email (Administrador)
- `GET /history` → Listar histórico de consumo (Usuário Autenticado)
- `GET /history/:id` → Buscar histórico por ID (Administrador)
- `GET /logAccess` → Listar todos os acessos (Administrador)
- `GET /logAccess/:id` → Buscar acesso por ID (Administrador)

### 🟡 **POST (Criar Dados)**
- `POST /catalog/addCatalog` → Criar novo filme/série (Administrador)
- `POST /public/register` → Criar conta de usuário (Público)
- `POST /users/create` → Criar usuário (Administrador/Usuário Autenticado)
- `POST /consumption` → Registrar que um usuário assistiu um filme (Usuário Autenticado)
- `POST /auth/login` → Fazer login e obter token JWT (Público)
- `POST /auth/logout` → Fazer logout e invalidar o token (Usuário Autenticado)

### 🟠 **PATCH (Atualizar Dados)**
- `PATCH /catalog/:id` → Atualizar informações do catálogo (Administrador)
- `PATCH /users/:id` → Atualizar dados do usuário (Administrador/Usuário Autenticado)

### 🔴 **DELETE (Remover Dados)**
- `DELETE /catalog/:id` → Excluir conteúdo do catálogo (Administrador)
- `DELETE /users/:id` → Excluir usuário (Administrador)

---

## 🔐 Autenticação com JWT

- Após fazer login (`POST /auth/login`), o backend retorna um **token JWT**.
- Para acessar rotas protegidas, inclua o token no cabeçalho da requisição:

```http
Authorization: Bearer seu_token_aqui
```

---

## 🤝 Contribuição
Quer contribuir? Siga os passos:
1. Fork o repositório
2. Crie uma nova branch (`git checkout -b minha-feature`)
3. Commit suas mudanças (`git commit -m 'Adicionando uma nova feature'`)
4. Faça push (`git push origin minha-feature`)
5. Abra um Pull Request 🚀

---

## 📩 Contato
Se precisar de ajuda, entre em contato:
📧 **Email:** igocastro.15@gmail.com  
🐙 **GitHub:** [Igoquintino](https://github.com/Igoquintino)  

