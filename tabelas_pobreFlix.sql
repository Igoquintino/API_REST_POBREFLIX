-- Drop tables in reverse order of dependencies to avoid conflicts
DROP TABLE IF EXISTS external_api CASCADE;
DROP TABLE IF EXISTS consumption_reports CASCADE;
DROP TABLE IF EXISTS consumption_history CASCADE;
DROP TABLE IF EXISTS catalog CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    user_type VARCHAR(50) CHECK (user_type IN ('Administrator', 'Client')) NOT NULL
);

-- Catalog Table
CREATE TABLE catalog (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    content_type VARCHAR(50) CHECK (content_type IN ('filme', 'serie')) NOT NULL,
    video_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consumption History Table
CREATE TABLE consumption_history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    catalog_id INT REFERENCES catalog(id) ON DELETE CASCADE,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consumption Reports Table
CREATE TABLE consumption_reports (
    id SERIAL PRIMARY KEY,
    catalog_id INT REFERENCES catalog(id) ON DELETE CASCADE UNIQUE,
    views INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- External API Integration Table
CREATE TABLE external_api (
    id SERIAL PRIMARY KEY,
    source VARCHAR(100) NOT NULL, -- Nome da API (ex: 'SuperFlix')
    catalog_id INT UNIQUE REFERENCES catalog(id) ON DELETE CASCADE, -- Garantindo que um catálogo só tenha um registro na API
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data da sincronização
    api_url TEXT NOT NULL -- URL usada para sincronizar (link da SuperFlix)
);

