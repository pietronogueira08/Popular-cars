-- 1. Atualizar a restrição de categoria para incluir as novas categorias (suv, hatch, sedan, utilitario, picape, etc)
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_category_check;
ALTER TABLE vehicles ADD CONSTRAINT vehicles_category_check CHECK (category IN ('suv', 'hatch', 'sedan', 'moto', 'utilitario', 'picape', 'tuning', 'carro'));

-- 2. Adicionar a coluna images (array de texto) para suportar até 8 fotos
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS images text[];
