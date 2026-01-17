-- Migration DOWN: produto
-- Escreva o rollback aqui:

-- Migration DOWN: refactor_ecommerce

-- 1. Reverter ORDEM_ITEM
-- Adicionar coluna antiga
ALTER TABLE ordem_item ADD COLUMN id_convite_usuario INTEGER;

-- Tentar recuperar os dados (Só funciona se id_personalizacao não for nulo)
UPDATE ordem_item SET id_convite_usuario = id_personalizacao;

-- Se houver produtos físicos (sem personalização), eles serão perdidos nesta reversão ou causarão erro se definirmos NOT NULL agora.
-- Assumindo ambiente de dev, vamos deletar itens órfãos se necessário ou permitir NULL temporariamente.
DELETE FROM ordem_item WHERE id_convite_usuario IS NULL; 

ALTER TABLE ordem_item ALTER COLUMN id_convite_usuario SET NOT NULL;

-- Remover colunas novas
ALTER TABLE ordem_item DROP CONSTRAINT fk_ordem_item_produto;
ALTER TABLE ordem_item DROP CONSTRAINT fk_ordem_item_personalizacao;
ALTER TABLE ordem_item DROP COLUMN id_produto;
ALTER TABLE ordem_item DROP COLUMN id_personalizacao;

-- Restaurar FK
-- Nota: O nome da tabela item_personalizado ainda não foi revertido, então apontamos para o nome atual temporariamente
ALTER TABLE ordem_item ADD CONSTRAINT ordem_item_id_convite_usuario_fkey FOREIGN KEY (id_convite_usuario) REFERENCES item_personalizado(id_item_personalizado);

-- 2. Reverter ITEM_PERSONALIZADO
ALTER TABLE item_personalizado DROP COLUMN dados_preenchidos;
ALTER TABLE item_personalizado DROP COLUMN url_final_print;
ALTER TABLE item_personalizado DROP COLUMN url_final_foil;

ALTER TABLE item_personalizado RENAME COLUMN id_produto TO id_convite;
ALTER TABLE item_personalizado RENAME COLUMN id_item_personalizado TO id_convite_usuario;

-- 3. Remover Tabelas Novas
DROP TABLE IF EXISTS estoque;
DROP TABLE IF EXISTS produto_template;

-- 4. Reverter PRODUTO
ALTER TABLE produto DROP CONSTRAINT produto_sku_unique;
ALTER TABLE produto DROP COLUMN sku;
ALTER TABLE produto DROP COLUMN gerencia_estoque;
ALTER TABLE produto DROP COLUMN id_tipo_produto;

ALTER TABLE produto RENAME COLUMN id_produto TO id_convite;

-- 5. Remover TIPO_PRODUTO
DROP TABLE IF EXISTS tipo_produto;

-- 6. Renomear Tabelas de volta
ALTER TABLE item_personalizado RENAME TO convite_usuario;
ALTER TABLE produto RENAME TO convite;
ALTER TABLE categoria_produto RENAME TO categoria_convite;