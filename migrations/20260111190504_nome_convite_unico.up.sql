-- Migration UP: nome_convite_unico
-- Escreva seu SQL aqui:
ALTER TABLE IF EXISTS convite 
ADD CONSTRAINT convite_nome_unique UNIQUE (nome);
