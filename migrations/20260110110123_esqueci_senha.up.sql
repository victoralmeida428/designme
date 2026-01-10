-- Migration UP: esqueci_senha
-- Escreva seu SQL aqui:
CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    token VARCHAR(255) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_resets_token ON password_resets(token);

