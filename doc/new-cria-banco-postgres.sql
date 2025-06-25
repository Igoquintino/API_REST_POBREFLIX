DROP TABLE IF EXISTS external_api CASCADE;
DROP TABLE IF EXISTS consumption_reports CASCADE;
DROP TABLE IF EXISTS consumption_history CASCADE;
DROP TABLE IF EXISTS catalog CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sessao CASCADE;
DROP TABLE IF EXISTS log CASCADE;

---
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- SERIAL para auto-incremento
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('Administrator', 'Client')) -- Usando VARCHAR com CHECK para simular ENUM
);

---
-- Catalog Table
CREATE TABLE catalog (
    id SERIAL PRIMARY KEY, -- SERIAL para auto-incremento
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    content_type VARCHAR(10) NOT NULL CHECK (content_type IN ('filme', 'serie')), -- Usando VARCHAR com CHECK para simular ENUM
    video_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT
);

---
-- Consumption History Table
CREATE TABLE consumption_history (
    id SERIAL PRIMARY KEY, -- SERIAL para auto-incremento
    user_id INT NOT NULL,
    catalog_id INT NOT NULL,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (catalog_id) REFERENCES catalog(id) ON DELETE CASCADE
);

---
-- Consumption Reports Table
CREATE TABLE consumption_reports (
    id SERIAL PRIMARY KEY, -- SERIAL para auto-incremento
    catalog_id INT UNIQUE NOT NULL,
    views INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- PostgreSQL não tem ON UPDATE CURRENT_TIMESTAMP nativo para colunas.
);

-- Trigger para atualizar 'updated_at' automaticamente na tabela 'consumption_reports'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_consumption_reports_updated_at
BEFORE UPDATE ON consumption_reports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

---
-- External API Integration Table
CREATE TABLE external_api (
    id SERIAL PRIMARY KEY, -- SERIAL para auto-incremento
    source VARCHAR(100) NOT NULL,
    catalog_id INT UNIQUE NOT NULL,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (catalog_id) REFERENCES catalog(id) ON DELETE CASCADE
);

---
-- Session Table (Sessao)
CREATE TABLE sessao (
  id SERIAL PRIMARY KEY,
  dispositivo VARCHAR(255),
  cripto_key TEXT,
  api_key TEXT,
  ativa BOOLEAN,
  data_criacao TIMESTAMP,
  data_expiracao TIMESTAMP,
  user_id INT, 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE 

);

---
-- Log Table
CREATE TABLE log (
  id SERIAL PRIMARY KEY,
  operacao VARCHAR(20) NOT NULL,
  descricao TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL, -- Usando TIMESTAMP ao invés de DATETIME
  id_usuario INT,
  ip VARCHAR(45) NOT NULL,
  user_agent VARCHAR(255) NOT NULL, -- Aumentado o tamanho para user_agent
  status VARCHAR(20) NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);
