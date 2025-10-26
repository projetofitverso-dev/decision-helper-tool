-- Remover colunas não utilizadas da tabela medidas
ALTER TABLE public.medidas 
DROP COLUMN IF EXISTS peito,
DROP COLUMN IF EXISTS bracos,
DROP COLUMN IF EXISTS coxas;

-- Adicionar novas colunas na tabela medidas
ALTER TABLE public.medidas 
ADD COLUMN abdomen NUMERIC,
ADD COLUMN altura NUMERIC,
ADD COLUMN idade INTEGER;