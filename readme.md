## 📄 Atualizações da Documentação de ECN e DVP

Este repositório contém as versões mais recentes e o histórico de alterações da documentação referente aos **ECN (Especificação de Cenário de Uso)** e **DVP (Documento de Visão do Projeto)**. O objetivo é garantir o acesso a informações precisas e atualizadas sobre as modificações nos planos de validação do software, assegurando entregas corretas conforme especificado.

---

### 🚀 Últimas Atualizações

**📅 27/05/2025 — Implementação das Regras de Negócio em Ambos os Documentos**

- **ECN:**
  - Atualizado documento explicativo de cenários de uso com a inclusão das regras de negócio descritas no DVP.  
    Exemplo de atualização:

    ```
    (1.2) Fazer Logout

    Como Usuário comum ou ADM  
    Eu posso fazer logout  

    Pré-condição:  
    Estar logado  

    Ocorre então:  
    - No menu superior, clicar em “Minha conta”  
    - Clicar em “Sair”  
    - A sessão do usuário deve ser encerrada [RN-AU-005]  
    - O usuário é redirecionado para a tela de boas-vindas do site  

    Contudo:  
    - Se houver erro ao encerrar a sessão no backend, o sistema exibirá uma mensagem de erro  
    - Se o usuário tentar acessar páginas restritas após o logout, será redirecionado para a tela de login  
    ```

  - Adicionado novo ECN **[Nome/Número do ECN]**: breve descrição do motivo da criação.

- **DVP:**
  - Revisado item **5. Necessidades e Funcionalidades**:  
    Foram removidos itens que se caracterizavam mais como tarefas do que funcionalidades, como:
    - Alerta de invasão
    - Sessões de usuários
    - Segurança contra scripts maliciosos
    - Verificação "não sou um robô"
    - Notificações de erro
    - Senhas difíceis
    - Encriptação de credenciais
    - Validação de e-mail
    - Layout responsivo

    Esses elementos estão implicitamente relacionados a outras funcionalidades já descritas.

  - Inclusão do item **6. Regras de Negócio**:  
    As regras foram definidas e associadas aos cenários descritos no documento de ECN.

---

### 🎯 O que você encontrará neste repositório:

- **Pasta `Docs/`:**
  - Documentos (PDFs) com DVP, ECN, diagrama de caso de uso, diagrama de sequencia .

---
