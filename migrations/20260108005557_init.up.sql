-- Migration UP: init

-- 1. Tabela Principal de Usuários (Padrão Auth.js)
-- Precisa ser criada antes das outras que dependem dela
CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255), -- Adicionado para login com senha
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  role VARCHAR(50) DEFAULT 'user' NOT NULL
);

-- 2. Tabelas de Suporte Auth.js (Accounts, Sessions, Tokens)

CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
 
  PRIMARY KEY (identifier, token)
);
 
CREATE TABLE accounts
(
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT
);
 
CREATE TABLE sessions
(
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL
);

-- Tabela para o fluxo de "Esqueci minha senha"
CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabelas de Domínio E-commerce

CREATE TABLE IF NOT EXISTS endereco (
    id_endereco SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Corrigido para users(id)
    cep VARCHAR(20) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(255),
    cidade VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL
);

-- 4. Tabelas de Produto
CREATE TABLE IF NOT EXISTS categoria_convite (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS convite (
    id_convite SERIAL PRIMARY KEY,
    id_categoria INTEGER NOT NULL REFERENCES categoria_convite(id_categoria),
    descricao VARCHAR(255),
    nome VARCHAR(100) NOT NULL,
    image_preview_url VARCHAR(255),
    preco_base DECIMAL(10, 2) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

-- 5. Personalização e Status
CREATE TABLE IF NOT EXISTS status_convite (
    id_status_convite SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS convite_usuario (
    id_convite_usuario SERIAL PRIMARY KEY,
    id_convite INTEGER NOT NULL REFERENCES convite(id_convite),
    usuario_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Corrigido para users(id)
    id_status_convite INTEGER NOT NULL REFERENCES status_convite(id_status_convite),
    dados JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabelas Auxiliares de Venda
CREATE TABLE IF NOT EXISTS status_pagamento (
    id_status_pagamento SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS status_pedido (
    id_status_pedido SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS status_gateway_pag (
    id_status_gateway_pag SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS metodo_pagamento (
    id_metodo_pag SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

-- 7. Pedidos (Ordem)
CREATE TABLE IF NOT EXISTS ordem (
    id_ordem SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT, -- Corrigido para users(id)
    id_endereco INTEGER NOT NULL REFERENCES endereco(id_endereco),
    id_status_pagamento INTEGER NOT NULL REFERENCES status_pagamento(id_status_pagamento),
    id_status_pedido INTEGER NOT NULL REFERENCES status_pedido(id_status_pedido),
    id_gateway_pag INTEGER NOT NULL REFERENCES status_gateway_pag(id_status_gateway_pag),
    id_metodo_pag INTEGER NOT NULL REFERENCES metodo_pagamento(id_metodo_pag),
    id_transacao_gateway VARCHAR(255),
    valor_total DECIMAL(10, 2) NOT NULL,
    valor_frete DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ordem_item (
    id_ordem_item SERIAL PRIMARY KEY,
    id_convite_usuario INTEGER NOT NULL REFERENCES convite_usuario(id_convite_usuario),
    id_ordem INTEGER NOT NULL REFERENCES ordem(id_ordem),
    qtd INTEGER NOT NULL,
    valor_unitario DECIMAL(10, 2) NOT NULL
);

-- INSERTS INICIAIS (SEED)
INSERT INTO status_convite (nome) VALUES ('Rascunho'), ('Finalizado') ON CONFLICT DO NOTHING;
INSERT INTO status_pagamento (nome) VALUES ('Pendente'), ('Aprovado'), ('Recusado') ON CONFLICT DO NOTHING;
INSERT INTO status_pedido (nome) VALUES ('Recebido'), ('Em Produção'), ('Enviado'), ('Entregue') ON CONFLICT DO NOTHING;
INSERT INTO metodo_pagamento (nome) VALUES ('Cartão de Crédito'), ('PIX') ON CONFLICT DO NOTHING;
INSERT INTO status_gateway_pag (nome) VALUES ('Aguardando'), ('Processado') ON CONFLICT DO NOTHING;