-- Migration DOWN: alter_user
-- Escreva o rollback aqui:

alter table if exists users
drop column tel,
drop column cpf