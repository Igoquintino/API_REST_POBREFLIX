# Documentação da API

## Req_GET

### Todos usuarios
**Método:** `GET`

**URL:** `localhost:3000/users`

**Exemplo de Resposta:** 
```json
"{[
    {
        "id": 17,
        "name": "IgoAdmin",
        "email": "igo@example.com",
        "password": "$2b$10$46imQ7MO4AYbonM41KqjauKPIqLMV5uMN2Qng2wAiZ0rvNI56bZsu",
        "user_type": "Administrator"
    },
    {
        "id": 34,
        "name": "NovoAdmim110",
        "email": "admin4312@email.com",
        "password": "$2b$10$6IxK/iQY6uzrr1JLPfxgIOYk1bbnxHuQWGclWbp9R0Zbam2SrGOB2",
        "user_type": "Administrator"
    },
    {
        "id": 39,
        "name": "client",
        "email": "client@email.com",
        "password": "$2b$10$9c8qemuAQGPpVSbbsAIaPuHS1.JWb1pV2rIwJsPXI4Dsu5hMcZG06",
        "user_type": "Client"
    }
]}"
```

### Todos catálogos
**Método:** `GET`

**URL:** `localhost:3000/catalog`

**Exemplo de Resposta:** 
```json
"[
    {
        "id": 2,
        "title": "O Filme Exemplo",
        "description": "Um emocionante filme de ação cheio de suspense e aventura.",
        "genre": "Ação",
        "content_type": "filme",
        "video_url": "https://www.example.com/video_url",
        "created_at": "2025-01-20T21:06:06.974Z"
    },
    {
        "id": 3,
        "title": "A Origem",
        "description": "Um ladrão que invade os sonhos das pessoas para roubar segredos corporativos enfrenta um último trabalho.",
        "genre": "Ficção Científica",
        "content_type": "filme",
        "video_url": "https://superflixapi.link/filme/tt1375666",
        "created_at": "2025-01-21T14:49:29.890Z"
    },
    {
        "id": 7,
        "title": "Jerry e Marge Tiram a Sorte Grande",
        "description": "A verdadeira história sobre o casal Jerry e Marge Selbee, que ganham na loteria e usam o dinheiro para reviver sua pequena cidade.",
        "genre": "comédia",
        "content_type": "filme",
        "video_url": "https://superflixapi.link/filme/tt8323668",
        "created_at": "2025-01-23T21:24:02.174Z"
    },
    {
        "id": 8,
        "title": "novo",
        "description": "A verdadeira história sobre o casal Jerry e Marge Selbee, que ganham na loteria e usam o dinheiro para reviver sua pequena cidade.",
        "genre": "drama",
        "content_type": "filme",
        "video_url": "https://superflixapi.link/filme/tt8323668",
        "created_at": "2025-01-24T15:47:12.246Z"
    },
    {
        "id": 9,
        "title": "Últimos Dias no Deserto",
        "description": "Um capítulo imaginado dos quarenta dias de jejum e oração de Jesus no deserto. Quando Jesus emerge do deserto, ele luta com o Diabo sobre o destino de uma família em crise.",
        "genre": "Drama",
        "content_type": "filme",
        "video_url": "https://superflixapi.link/filme/tt3513054",
        "created_at": "2025-01-30T17:05:55.620Z"
    }
]"
```

### Usuario por ID, Nome ou email
**Método:** `GET`

**URL:** `localhost:3000/users/search?id=34`

**Exemplo de Resposta:** 
```json
"{[
    {
        "id": 34,
        "name": "NovoAdmim110",
        "email": "admin4312@email.com",
        "password": "$2b$10$6IxK/iQY6uzrr1JLPfxgIOYk1bbnxHuQWGclWbp9R0Zbam2SrGOB2",
        "user_type": "Administrator"
    }
]}"
```

### Conteúdo por Title
**Método:** `GET`

**URL:** `localhost:3000/catalog/A%20Origem`

**Exemplo de Resposta:** 
```json
"[
    {
        "id": 3,
        "title": "A Origem",
        "description": "Um ladrão que invade os sonhos das pessoas para roubar segredos corporativos enfrenta um último trabalho.",
        "genre": "Ficção Científica",
        "content_type": "filme",
        "video_url": "https://superflixapi.link/filme/tt1375666",
        "created_at": "2025-01-21T14:49:29.890Z"
    }
]"
```

### Todos Histórico
**Método:** `GET`

**URL:** `localhost:3000/history`

**Exemplo de Resposta:** 
```json
"{[
    {
        "id": 3,
        "user_id": 17,
        "catalog_id": 3,
        "watched_at": "2025-01-30T19:30:52.373Z"
    },
    {
        "id": 4,
        "user_id": 17,
        "catalog_id": 3,
        "watched_at": "2025-01-30T19:51:27.873Z"
    },
    {
        "id": 5,
        "user_id": 17,
        "catalog_id": 3,
        "watched_at": "2025-01-30T19:51:33.940Z"
    },
    {
        "id": 8,
        "user_id": 17,
        "catalog_id": 3,
        "watched_at": "2025-01-30T19:56:34.811Z"
    }
]}"
```

### Historico pelo Id do usuario
**Método:** `GET`

**URL:** `localhost:3000/history/17`

**Exemplo de Resposta:** 
```json
"{[
    {
        "id": 3,
        "user_id": 17,
        "catalog_id": 3,
        "watched_at": "2025-01-30T19:30:52.373Z"
    },
    {
        "id": 4,
        "user_id": 17,
        "catalog_id": 3,
        "watched_at": "2025-01-30T19:51:27.873Z"
    },
    {
        "id": 5,
        "user_id": 17,
        "catalog_id": 3,
        "watched_at": "2025-01-30T19:51:33.940Z"
    },
    {
        "id": 8,
        "user_id": 17,
        "catalog_id": 3,
        "watched_at": "2025-01-30T19:56:34.811Z"
    }
]}"
```

### Todos catálogo por Tipo
**Método:** `GET`

**URL:** `localhost:3000/catalog/type/filme`

**Exemplo de Resposta:** 
```json
"[
    {
        "id": 2,
        "title": "O Filme Exemplo",
        "description": "Um emocionante filme de ação cheio de suspense e aventura.",
        "genre": "Ação",
        "content_type": "filme",
        "video_url": "https://www.example.com/video_url",
        "created_at": "2025-01-20T21:06:06.974Z"
    },
    {
        "id": 3,
        "title": "A Origem",
        "description": "Um ladrão que invade os sonhos das pessoas para roubar segredos corporativos enfrenta um último trabalho.",
        "genre": "Ficção Científica",
        "content_type": "filme",
        "video_url": "https://superflixapi.link/filme/tt1375666",
        "created_at": "2025-01-21T14:49:29.890Z"
    },
    {
        "id": 7,
        "title": "Jerry e Marge Tiram a Sorte Grande",
        "description": "A verdadeira história sobre o casal Jerry e Marge Selbee, que ganham na loteria e usam o dinheiro para reviver sua pequena cidade.",
        "genre": "comédia",
        "content_type": "filme",
        "video_url": "https://superflixapi.link/filme/tt8323668",
        "created_at": "2025-01-23T21:24:02.174Z"
    },
    {
        "id": 8,
        "title": "novo",
        "description": "A verdadeira história sobre o casal Jerry e Marge Selbee, que ganham na loteria e usam o dinheiro para reviver sua pequena cidade.",
        "genre": "drama",
        "content_type": "filme",
        "video_url": "https://superflixapi.link/filme/tt8323668",
        "created_at": "2025-01-24T15:47:12.246Z"
    },
    {
        "id": 9,
        "title": "Últimos Dias no Deserto",
        "description": "Um capítulo imaginado dos quarenta dias de jejum e oração de Jesus no deserto. Quando Jesus emerge do deserto, ele luta com o Diabo sobre o destino de uma família em crise.",
        "genre": "Drama",
        "content_type": "filme",
        "video_url": "https://superflixapi.link/filme/tt3513054",
        "created_at": "2025-01-30T17:05:55.620Z"
    }
]"
```

### pegar todos o registro da api
**Método:** `GET`

**URL:** `localhost:3000/api/external-api/usage`

**Exemplo de Resposta:** 
```json
"{[
    {
        "id": 1,
        "source": "superflixapi",
        "catalog_id": 2,
        "synced_at": "2025-02-02T17:48:38.819Z"
    },
    {
        "id": 2,
        "source": "superflixapi",
        "catalog_id": 2,
        "synced_at": "2025-02-02T17:49:29.217Z"
    },
    {
        "id": 3,
        "source": "superflixapi",
        "catalog_id": 2,
        "synced_at": "2025-02-02T18:02:28.810Z"
    }
]}"
```

## Req_POST

### Postar usuarios / ADM
**Método:** `POST`

**URL:** `localhost:3000/users/create`

**Body:** 
```json
"{
    "name": "AdmNew",
    "email": "AdmNew@email.com",
    "password": "aplicativos2!",
    "user_type": "Administrator"
}"
```

**Exemplo de Resposta:** 
```json
"{{
    "id": 41,
    "name": "AdmNew",
    "email": "AdmNew@email.com",
    "user_type": "Administrator"
}}"
```

### Postar usuarios / USER e não autenticados
**Método:** `POST`

**URL:** `localhost:3000/users/register`

**Body:** 
```json
"{
    {
    "name": "NewClient",
    "email": "NewCliet@email.com",
    "password": "aplicativos2!",
    "user_type": "Client"
}
}"
```

**Exemplo de Resposta:** 
```json
"{{
    "message": "Usuário cadastrado com sucesso!",
    "user": {
        "id": 42,
        "name": "NewClient",
        "email": "NewCliet@email.com",
        "user_type": "Client"
    }
}}"
```

### postar catálogo
**Método:** `POST`

**URL:** `localhost:3000/catalog/addCatalog`

**Body:** 
```json
"{
    "title": "Männerhort",
    "description": "Três homens têm problemas diferentes com suas parceiras. Para não serem perturbados, eles criaram um lugar secreto dentro de uma sala de caldeiras apenas para homens. O Männerhort.",
    "genre": "Comédia, Drama",
    "content_type": "filme",
    "video_url": "https://superflixapi.link/filme/1142364"
}"
```

**Exemplo de Resposta:** 
```json
"{
    "id": 23,
    "title": "Männerhort",
    "description": "Três homens têm problemas diferentes com suas parceiras. Para não serem perturbados, eles criaram um lugar secreto dentro de uma sala de caldeiras apenas para homens. O Männerhort.",
    "genre": "Comédia, Drama",
    "content_type": "filme",
    "video_url": "https://superflixapi.link/filme/1142364",
    "created_at": "2025-02-03T18:19:52.859Z"
}"
```

### assistir um filme
**Método:** `POST`

**URL:** `localhost:3000/consumption`

**Body:** 
```json
"{
    "catalogId": 3
}"
```

**Exemplo de Resposta:** 
```json
"{
    "id": 1,
    "catalog_id": 3,
    "views": 6,
    "updated_at": "2025-02-03T18:21:00.009Z"
}"
```

### Login ADM
**Método:** `POST`

**URL:** `localhost:3000/auth/login`

**Body:** 
```json
"{
    "email": "igo@example.com",
    "password": "aplicativos2!"
}"
```

**Exemplo de Resposta:** 
```json
"{
    "message": "Login bem-sucedido!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3LCJ1c2VyVHlwZSI6IkFkbWluaXN0cmF0b3IiLCJpYXQiOjE3Mzg2MDUwNTksImV4cCI6MTczODYwODY1OX0.F-ps5LIlQceF25ZgoVlX4WX4n7nn3YKkq1DUFrUiVek",
    "user": {
        "id": 17,
        "name": "IgoAdmin",
        "email": "igo@example.com",
        "user_type": "Administrator"
    }
}"
```

### Login USER
**Método:** `POST`

**URL:** `localhost:3000/auth/login`

**Body:** 
```json
"{
    "email": "client@email.com",
    "password": "aplicativos2!"
}"
```

**Exemplo de Resposta:** 
```json
"{
    "message": "Login bem-sucedido!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM5LCJ1c2VyVHlwZSI6IkNsaWVudCIsImlhdCI6MTczODYwNDk1NSwiZXhwIjoxNzM4NjA4NTU1fQ.NbdZh1s0CaKhOA73d_myhDwt2LKoYTJwl6ooLM3NMpY",
    "user": {
        "id": 39,
        "name": "client",
        "email": "client@email.com",
        "user_type": "Client"
    }
}"
```

### Logout
**Método:** `POST`

**URL:** `localhost:3000/auth/logout`

**Body:** 
```json
"coloque o Bearer token para fazer o logout no usuário especifico"
```

**Exemplo de Resposta:** 
```json
"{
    "message": "Logout realizado com sucesso!"
}"
```

### registro_da_api
**Método:** `POST`

**URL:** `localhost:3000/api/external-api/register`

**Body:** 
```json
"{
  "source": "superflixapi",
  "catalogId": 2
}"
```

**Exemplo de Resposta:** 
```json
"{
    "id": 4,
    "source": "superflixapi",
    "catalog_id": 2,
    "synced_at": "2025-02-03T18:26:34.275Z"
}"
```

## req_PATCH

### Atualizar usuarios
**Método:** `PATCH`

**URL:** `localhost:3000/users/36`

**Body:** 
```json
"{
    "name": "Adm110",
    "email": "admin4312@email.com"
}"
```

**Exemplo de Resposta:** 
```json
"{
    "id": 34,
    "name": "Adm110",
    "email": "admin4312@email.com",
    "user_type": "Administrator"
}"
```

### Atualizar_catálogo
**Método:** `PATCH`

**URL:** `localhost:3000/catalog/17`

**Body:** 
```json
"{
    "title": "novo",
    "genre": "Drama, Comédia "
}"
```

**Exemplo de Resposta:** 
```json
"{
    "id": 7,
    "title": "novo",
    "description": "A verdadeira história sobre o casal Jerry e Marge Selbee, que ganham na loteria e usam o dinheiro para reviver sua pequena cidade.",
    "genre": "Drama, Comédia ",
    "content_type": "filme",
    "video_url": "https://superflixapi.link/filme/tt8323668",
    "created_at": "2025-01-23T21:24:02.174Z"
}"
```

## req_DELETE

### Delete_usuarios
**Método:** `DELETE`

**URL:** `localhost:3000/users/42`

**Exemplo de Resposta:** 
```json
"ele deve retornar um status 204 no content
Lembrando que deve estar com a autorização do token de adm"
```

### delete do catálogo
**Método:** `DELETE`

**URL:** `localhost:3000/catalog/14`

**Exemplo de Resposta:** 
```json
"ele deve retornar um status 204 no content
Lembrando que deve estar com a autorização do token de adm"
```

