-- Migration DOWN: init
-- Escreva o rollback aqui:

-- REVERTER MIGRAÇÃO INICIAL (DOWN)

-- 1. Remove tabelas com dependências (FKs) primeiro
-- Ordem: item -> ordem -> convite_usuario -> convite -> endereco
DROP TABLE IF EXISTS ordem_item;
DROP TABLE IF EXISTS ordem;
DROP TABLE IF EXISTS convite_usuario;
DROP TABLE IF EXISTS convite;
DROP TABLE IF EXISTS endereco;

-- 2. Remove tabelas de domínio base e catálogos
DROP TABLE IF EXISTS categoria_convite;
DROP TABLE IF EXISTS usuario;

-- 3. Remove tabelas de status e tipos (enums simulados)
DROP TABLE IF EXISTS status_convite;
DROP TABLE IF EXISTS status_pagamento;
DROP TABLE IF EXISTS status_pedido;
DROP TABLE IF EXISTS status_gateway_pag;
DROP TABLE IF EXISTS metodo_pagamento;

-- 4. Remove a extensão (Opcional - mantenha se outros sistemas usarem)
DROP EXTENSION IF EXISTS "uuid-ossp";