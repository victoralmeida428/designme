-- Migration DOWN: nome_convite_unico
-- Escreva o rollback aqui:

ALTER TABLE IF EXISTS convite 
drop CONSTRAINT convite_nome_unique UNIQUE (nome);