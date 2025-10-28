-- Criar tabela de configurações do usuário
CREATE TABLE public.configuracoes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notificações
  lembrete_agua boolean NOT NULL DEFAULT true,
  atualizacoes_progresso boolean NOT NULL DEFAULT true,
  som_notificacoes text NOT NULL DEFAULT 'enabled' CHECK (som_notificacoes IN ('enabled', 'vibrate', 'disabled')),
  
  -- Aparência
  tema text NOT NULL DEFAULT 'system' CHECK (tema IN ('light', 'dark', 'system')),
  idioma text NOT NULL DEFAULT 'pt-BR',
  tamanho_fonte text NOT NULL DEFAULT 'medium' CHECK (tamanho_fonte IN ('small', 'medium', 'large')),
  animacoes boolean NOT NULL DEFAULT true,
  
  criado_em timestamp with time zone NOT NULL DEFAULT now(),
  atualizado_em timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(usuario_id)
);

-- Habilitar RLS
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver suas próprias configurações"
  ON public.configuracoes FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem inserir suas próprias configurações"
  ON public.configuracoes FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar suas próprias configurações"
  ON public.configuracoes FOR UPDATE
  USING (auth.uid() = usuario_id);

-- Trigger para atualizar data de modificação
CREATE TRIGGER atualizar_configuracoes_modificacao
  BEFORE UPDATE ON public.configuracoes
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_data_modificacao();