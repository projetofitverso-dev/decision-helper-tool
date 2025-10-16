-- Adicionar colunas faltantes na tabela perfis
ALTER TABLE public.perfis 
ADD COLUMN IF NOT EXISTS telefone text,
ADD COLUMN IF NOT EXISTS localizacao text,
ADD COLUMN IF NOT EXISTS peso_atual numeric;