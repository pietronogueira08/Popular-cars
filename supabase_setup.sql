-- 1. Cria a tabela de veículos
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price numeric NOT NULL,
  mileage integer NOT NULL,
  category text NOT NULL CHECK (category IN ('carro', 'moto', 'tuning', 'suv', 'hatch', 'sedan', 'utilitario', 'picape')),
  status text NOT NULL CHECK (status IN ('disponivel', 'reservado', 'vendido')),
  description text,
  image text,
  images text[],
  features text[],
  highlighted boolean DEFAULT false,
  color text,
  fuel text,
  stage text,
  created_at timestamptz DEFAULT now()
);

-- 2. Habilita a Segurança (Row Level Security)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas da Tabela (Leitura pública, Edição apenas para logados)
CREATE POLICY "Allow public read access to vehicles" ON vehicles FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated insert to vehicles" ON vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update to vehicles" ON vehicles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete to vehicles" ON vehicles FOR DELETE TO authenticated USING (true);

-- 4. Cria o Bucket de Imagens (Se não existir)
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-images', 'vehicle-images', true) ON CONFLICT (id) DO NOTHING;

-- 5. Políticas do Storage
CREATE POLICY "Public Access to vehicle-images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'vehicle-images');
CREATE POLICY "Auth Insert to vehicle-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vehicle-images');
CREATE POLICY "Auth Update to vehicle-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'vehicle-images');
CREATE POLICY "Auth Delete to vehicle-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'vehicle-images');
