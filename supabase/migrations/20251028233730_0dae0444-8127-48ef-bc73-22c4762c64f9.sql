-- Adicionar coluna fator_atividade à tabela perfis
ALTER TABLE public.perfis 
ADD COLUMN fator_atividade TEXT DEFAULT 'sedentario';

-- Comentário explicativo sobre os valores possíveis
COMMENT ON COLUMN public.perfis.fator_atividade IS 'Nível de atividade física do usuário: sedentario, leve, moderado, intenso, muito_intenso';