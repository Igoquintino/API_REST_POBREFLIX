# 🔐 Atualização de Segurança no Projeto PobreFlix

Este documento descreve as atualizações implementadas no projeto **PobreFlix**, com foco em **segurança da informação**, **gestão de sessões** e **controle de acesso**, conforme boas práticas modernas para aplicações web.

---
## Link para documento detalhado  
🔗 **Documento geral parcial do Trabalho final:** [Acesse o documento aqui](<https://docs.google.com/document/d/1ShgHDFDKluyiXl6QKWq2UFKZcp7GHZX36TKPuNKE4Pg/edit?usp=sharing>) 


---

---

## 📌 Visão Geral

O **PobreFlix** agora conta com melhorias significativas nos seguintes aspectos:

- Autenticação com **JWT**
- Proteção de senhas com **bcrypt**
- **Middleware** de autenticação e autorização
- Controle de acesso baseado em papéis (**RBAC**)
- **Variáveis de ambiente** para dados sensíveis
- Registro e auditoria de **logs de acesso**
- **Validação de entrada** robusta
- **Criptografia** de dados com AES-GCM
- Uso de **API Keys** para dispositivos
- Nova lógica de **sessão ativa única por usuário**

---

## 🔑 Componentes de Segurança Implementados

### 1. JSON Web Tokens (JWT)

- **Localização**: `src/utils/auth.js`, `src/controllers/authController.js`, `src/middlewares/authMiddleware.js`
- **Aplicação**:
  - Geração de token no login
  - Verificação em rotas protegidas
  - Gerenciamento de sessão com **blacklist**

### 2. Hashing de Senhas com Bcrypt

- **Localização**: `src/models/userModel.js`, `src/controllers/authController.js`
- **Aplicação**:
  - Hash seguro com `bcrypt.hash(password, 10)`
  - Comparação segura no login (`bcrypt.compare`)

### 3. Middleware de Autenticação e Blacklist

- **Localização**: `src/middlewares/authMiddleware.js`
- **Aplicação**:
  - Verifica validade do JWT
  - Checa se token está em blacklist

### 4. RBAC – Controle de Acesso por Papéis

- **Usuários**:
  - `Administrator`
  - `Client`
- **Localização**: Diversos controladores e modelo `userModel.js`
- **Aplicação**:
  - Apenas administradores podem acessar funcionalidades sensíveis

### 5. Variáveis de Ambiente

- **Localização**: `.env`, `src/server.js`, `src/utils/auth.js`
- **Aplicação**:
  - Segredos como `JWT_SECRET`, `CONNECTION_STRING` são mantidos fora do código

### 6. Logs de Acesso e Auditoria

- **Localização**: `src/models/logModel.js`, `src/services/logService.js`
- **Aplicação**:
  - Registro de ações críticas como login/logout e registros de dispositivo

### 7. Validação de Entrada

- **Localização**: Controladores e modelos
- **Aplicação**:
  - Valida obrigatoriedade e formato dos dados para evitar dados inválidos ou ataques como SQL Injection

### 8. Criptografia AES-GCM

- **Localização**: `src/utils/cryptoHelper.js`, `src/middlewares/encryptionMiddleware.js`
- **Aplicação**:
  - Criptografia/descriptografia do corpo da requisição
  - Utiliza `crypto_key` única por dispositivo

### 9. API Key por Dispositivo

- **Localização**: `src/models/deviceModel.js`, `src/middlewares/apiKeyMiddleware.js`
- **Aplicação**:
  - Chave exclusiva gerada por dispositivo
  - Validação via header `X-API-Key`

---

## 🔒 Sessão Ativa Única por Usuário

### 🎯 Objetivo

Permitir **apenas uma sessão ativa por usuário**, encerrando automaticamente sessões anteriores ao novo login.

### 🛠️ Implementações Técnicas

#### 1. Alterações no Banco de Dados

- **Adição da coluna `user_id`** na tabela `sessao`
  - Permite associar a sessão a um usuário específico
- **Remoção do NOT NULL** da coluna `id_usuario` na tabela `log`
  - Permite registro de logs antes do login

#### 2. Fluxo da Sessão

| Etapa | Descrição |
|-------|-----------|
| **Registro de Dispositivo** | `POST /devices/register` gera `api_key` e `crypto_key` |
| **Middleware `requireApiKey`** | Verifica validade da `X-API-Key` |
| **Login (`authController.login`)** | Verifica senha, desativa sessões anteriores com `deviceModel.deactivateAllUserSessions(user.id)` e ativa a nova |
| **Middleware `authenticate`** | Verifica validade do JWT e se a `deviceApiKey` está ativa |
| **Logout (`POST /auth/logout`)** | Token é adicionado à blacklist e `api_key` desativada |

---

## 🧩 Tabelas Envolvidas

### `sessao`

- Campos: `api_key`, `crypto_key`, `ativa`, `data_expiracao`, `user_id`
- Finalidade: Gerencia sessões e dispositivos conectados

### `log`

- Campos: `id_usuario` (agora opcional), `ip`, `user_agent`, `operacao`, `status`
- Finalidade: Auditoria de ações críticas do sistema

---

## 🧠 Conceito Central

**"Uma sessão ativa por vez para cada usuário."**

- **api_key** única associada ao `user_id`
- **Desativação automática** de sessões anteriores
- **JWT** inclui a `deviceApiKey` da sessão ativa

---

## ✅ Conclusão

As melhorias implementadas fortalecem a **segurança do PobreFlix**, proporcionando:

- Autenticação robusta
- Sessão única e rastreável
- Criptografia de dados
- Validação rigorosa
- Auditoria completa

Essas práticas garantem **integridade**, **confidencialidade** e **disponibilidade**, alinhando-se aos princípios fundamentais da segurança da informação.