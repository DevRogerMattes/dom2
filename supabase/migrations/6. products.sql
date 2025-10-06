-- 6. products.sql
CREATE TABLE products (
    id_produto UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_produto VARCHAR(20) NOT NULL,
    preco_produto NUMERIC(10,2) NOT NULL,
    link_venda TEXT NOT NULL,
    pagina_venda_uuid UUID NOT NULL
);

-- Índice para busca rápida pelo nome
CREATE INDEX idx_products_nome_produto ON products(nome_produto);
