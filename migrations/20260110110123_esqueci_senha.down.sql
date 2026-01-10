-- Migration DOWN: esqueci_senha
-- Escreva o rollback aqui:

DROP TABLE IF EXISTS password_resets;
DROP INDEX IF EXISTS idx_password_resets_token;


