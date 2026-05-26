-- ============================================================
-- Popular Veículos — Tabela de Depoimentos
-- Execute este script no SQL Editor do Supabase
-- ============================================================

-- 1. Criar tabela
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  location TEXT,
  vehicle_info TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  text_content TEXT NOT NULL,
  avatar_url TEXT,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 3. Policy: qualquer pessoa pode ler depoimentos aprovados
CREATE POLICY "Public can read approved testimonials"
  ON testimonials
  FOR SELECT
  USING (is_approved = true);

-- 4. Policy: usuários autenticados podem fazer tudo (para o admin)
CREATE POLICY "Authenticated users have full access"
  ON testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Criar bucket de avatares no Storage (execute se ainda não existir)
-- No painel do Supabase: Storage > New Bucket > "testimonial-avatars" > Public: ON
-- Ou via SQL (requer extensão storage habilitada):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('testimonial-avatars', 'testimonial-avatars', true) ON CONFLICT DO NOTHING;

-- 6. Inserir dados mock realistas
INSERT INTO testimonials (client_name, location, vehicle_info, rating, text_content, avatar_url, is_approved) VALUES
(
  'Marcos Vinícius Silva',
  'São Paulo/SP',
  'Trocou por um VW T-Cross 2023',
  5,
  'Troquei meu Gol 2016 e recebi um valor muito acima do que esperava. O processo foi transparente do início ao fim — apresentaram a vistoria completa antes mesmo de eu pedir. Saí com o T-Cross emplacado em menos de 5 dias. Atendimento impecável do Rodrigo!',
  NULL,
  true
),
(
  'Fernanda Cristina Oliveira',
  'Campinas/SP',
  'Comprou uma Honda CB 1000R 2024',
  5,
  'Sempre tive receio de comprar moto em revenda, mas a Popular Veículos quebrou todos os meus preconceitos. A CB 1000R estava impecável, exatamente como anunciada. Revisão em dia, nota fiscal emitida e entregaram até o capacete de brinde. Nota 10, com certeza volto!',
  NULL,
  true
),
(
  'Ricardo Mendes Costa',
  'Santo André/SP',
  'Comprou uma Toyota Hilux SW4 2022',
  5,
  'Pesquisei bastante antes de ir na Popular Veículos. A Hilux SW4 estava com preço justo e, diferente de outras revendas, me deixaram levar para uma vistoria independente sem problema algum. Isso passa confiança. Financiamento aprovado em 24h. Recomendo de olhos fechados!',
  NULL,
  true
),
(
  'Amanda Santos Rocha',
  'Osasco/SP',
  'Comprou um VW Polo GTS 2022',
  5,
  'Encontrei o Polo GTS no Instagram da loja e fui pessoalmente. O carro era ainda melhor do que nas fotos! O time de vendas é super atencioso e honesto, sem pressão nenhuma. Entrega rápida e com laço surpresa no carro. Amei a experiência, super indico!',
  NULL,
  true
),
(
  'Paulo Henrique Almeida',
  'Guarulhos/SP',
  'Comprou um Gol AP 1.8 Stage 2 Forjado',
  5,
  'Comprei o Gol preparado Stage 2 e ficou melhor do que eu esperava — entregaram todos os comprovantes das peças instaladas, com laudo do preparador. A garantia foi honrada quando surgiu um ajuste no câmbio. Suporte pós-venda presente de verdade. Equipe top!',
  NULL,
  true
);
