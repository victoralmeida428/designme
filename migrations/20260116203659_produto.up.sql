-- Migration UP: produto
-- Escreva seu SQL aqui:

-- Migration UP: refactor_ecommerce

-- 1. Renomear Tabelas Base
ALTER TABLE categoria_convite RENAME TO categoria_produto;
ALTER TABLE convite RENAME TO produto;
ALTER TABLE convite_usuario RENAME TO item_personalizado;

-- 2. Criar tabela de Tipos de Produto (Físico vs Personalizável)
CREATE TABLE tipo_produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

-- Popular tipos iniciais
INSERT INTO tipo_produto (nome) VALUES ('Físico'), ('Personalizável');

-- 3. Atualizar Tabela PRODUTO (Antigo Convite)
-- Renomear PK
ALTER TABLE produto RENAME COLUMN id_convite TO id_produto;

-- Adicionar novas colunas
ALTER TABLE produto 
    ADD COLUMN sku VARCHAR(50),
    ADD COLUMN id_tipo_produto INTEGER REFERENCES tipo_produto(id),
    ADD COLUMN gerencia_estoque BOOLEAN DEFAULT TRUE;

-- Atualizar constraint de unique no nome (opcional, mas boa prática manter nomes consistentes)
ALTER TABLE produto DROP CONSTRAINT IF EXISTS convite_nome_unique;
ALTER TABLE produto ADD CONSTRAINT produto_nome_unique UNIQUE (nome);
ALTER TABLE produto ADD CONSTRAINT produto_sku_unique UNIQUE (sku);

-- Atualizar dados existentes (se houver) para tipo 'Personalizável' por padrão, já que eram convites
UPDATE produto SET id_tipo_produto = (SELECT id FROM tipo_produto WHERE nome = 'Personalizável');
-- Agora define como Not Null
ALTER TABLE produto ALTER COLUMN id_tipo_produto SET NOT NULL;


-- 4. Criar Tabela PRODUTO_TEMPLATE
CREATE TABLE produto_template (
    id SERIAL PRIMARY KEY,
    id_produto INTEGER NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    largura_px INTEGER NOT NULL,
    altura_px INTEGER NOT NULL,
    url_camada_base VARCHAR(255),
    url_camada_foil VARCHAR(255),
    url_mascara_corte VARCHAR(255),
    config_editavel JSONB
);

-- 5. Criar Tabela ESTOQUE
CREATE TABLE estoque (
    id_estoque SERIAL PRIMARY KEY,
    id_produto INTEGER NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    qtd_disponivel INTEGER DEFAULT 0,
    qtd_reservada INTEGER DEFAULT 0
);

-- 6. Atualizar Tabela ITEM_PERSONALIZADO (Antigo Convite_Usuario)
-- Renomear PK e FKs antigas para refletir nova realidade
ALTER TABLE item_personalizado RENAME COLUMN id_convite_usuario TO id_item_personalizado;
ALTER TABLE item_personalizado RENAME COLUMN id_convite TO id_produto;

-- Adicionar colunas novas de arquivos finais e dados
ALTER TABLE item_personalizado 
    ADD COLUMN dados_preenchidos JSONB,
    ADD COLUMN url_final_print VARCHAR(255),
    ADD COLUMN url_final_foil VARCHAR(255);

-- 7. Atualizar Tabela ORDEM_ITEM
-- Essa é a mudança mais crítica. Precisamos ligar o item ao produto diretamente, 
-- e deixar a personalização opcional.

-- Adicionar colunas novas
ALTER TABLE ordem_item 
    ADD COLUMN id_produto INTEGER,
    ADD COLUMN id_personalizacao INTEGER;

-- Migração de Dados: 
-- Para itens existentes, descobrir o id_produto através da tabela item_personalizado antiga
UPDATE ordem_item 
SET 
    id_personalizacao = ordem_item.id_convite_usuario,
    id_produto = (
        SELECT id_produto 
        FROM item_personalizado 
        WHERE item_personalizado.id_item_personalizado = ordem_item.id_convite_usuario
    );

-- Agora criar as constraints e remover a coluna antiga
ALTER TABLE ordem_item ALTER COLUMN id_produto SET NOT NULL;
ALTER TABLE ordem_item ADD CONSTRAINT fk_ordem_item_produto FOREIGN KEY (id_produto) REFERENCES produto(id_produto);
ALTER TABLE ordem_item ADD CONSTRAINT fk_ordem_item_personalizacao FOREIGN KEY (id_personalizacao) REFERENCES item_personalizado(id_item_personalizado);

ALTER TABLE ordem_item DROP COLUMN id_convite_usuario;