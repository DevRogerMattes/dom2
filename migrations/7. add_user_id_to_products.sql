-- 7. add_user_id_to_products.sql
ALTER TABLE products 
ADD COLUMN user_id VARCHAR(255);

-- Índice para busca rápida por usuário
CREATE INDEX idx_products_user_id ON products(user_id);

-- Atualizar produtos existentes para ter um user_id padrão (opcional)
-- UPDATE products SET user_id = 'default-user' WHERE user_id IS NULL;