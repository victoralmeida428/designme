-- Migration DOWN: init
-- Escreva o rollback aqui:

-- 1. Remove tabelas dependentes (Filhas/Netas) primeiro para evitar erro de FK
-- Ordem: itens -> ordens -> convites_usuario -> pagamentos/resets -> endereços

DROP TABLE IF EXISTS ordem_item;
DROP TABLE IF EXISTS ordem;
DROP TABLE IF EXISTS convite_usuario;
DROP TABLE IF EXISTS password_resets; -- Tabela nova do reset de senha
DROP TABLE IF EXISTS endereco;

-- 2. Remove tabelas do E-commerce (Produto)
DROP TABLE IF EXISTS convite;
DROP TABLE IF EXISTS categoria_convite;

-- 3. Remove tabelas do Auth.js (Sessão e Contas vinculadas)
-- Devem ser removidas antes da tabela 'users'
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS verification_token;

-- 4. Remove a tabela principal de Usuários
DROP TABLE IF EXISTS users; -- Antiga tabela 'usuario'

-- 5. Remove tabelas de status e tipos (Enums simulados)
-- Só podem ser removidas depois que as tabelas que as usam (ordem, convite_usuario) foram deletadas
DROP TABLE IF EXISTS status_convite;
DROP TABLE IF EXISTS status_pagamento;
DROP TABLE IF EXISTS status_pedido;
DROP TABLE IF EXISTS status_gateway_pag;
DROP TABLE IF EXISTS metodo_pagamento;

-- 6. Remove extensões (Opcional - geralmente é seguro manter)
-- DROP EXTENSION IF EXISTS "uuid-ossp";