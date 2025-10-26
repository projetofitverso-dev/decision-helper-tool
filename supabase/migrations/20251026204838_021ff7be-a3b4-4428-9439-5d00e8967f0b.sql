-- Deletar a tabela substituicoes_alimentos
DROP TABLE IF EXISTS public.substituicoes_alimentos CASCADE;

-- Criar nova tabela de alimentos de referência
CREATE TABLE public.alimentos_referencia (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_alimento text NOT NULL,
  alimento text NOT NULL,
  proteinas numeric,
  carboidratos numeric,
  lipideos numeric,
  calorias numeric,
  quantidade integer DEFAULT 100,
  criado_em timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.alimentos_referencia ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos os usuários autenticados visualizem os alimentos de referência
CREATE POLICY "Usuários podem ver alimentos de referência"
ON public.alimentos_referencia
FOR SELECT
TO authenticated
USING (true);

-- Índices para melhorar performance
CREATE INDEX idx_alimentos_referencia_tipo ON public.alimentos_referencia(tipo_alimento);
CREATE INDEX idx_alimentos_referencia_alimento ON public.alimentos_referencia(alimento);