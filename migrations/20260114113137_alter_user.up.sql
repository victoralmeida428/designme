-- Migration UP: alter_user
-- Escreva seu SQL aqui:

alter table if exists users
add column tel character varying,
add column cpf varchar(12)