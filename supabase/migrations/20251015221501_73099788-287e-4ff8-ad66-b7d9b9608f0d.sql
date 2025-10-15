-- Drop existing tables and triggers
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists set_updated_at on public.food_substitutions;
drop trigger if exists set_updated_at on public.profiles;
drop function if exists public.handle_new_user();
drop function if exists public.handle_updated_at();
drop table if exists public.foods cascade;
drop table if exists public.measurements cascade;
drop table if exists public.food_substitutions cascade;
drop table if exists public.water_intake cascade;
drop table if exists public.profiles cascade;

-- Criar tabela de perfis de usuário
create table public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome_completo text,
  avatar_url text,
  altura decimal(5,2), -- em cm
  peso_alvo decimal(5,2), -- em kg
  data_nascimento date,
  genero text check (genero in ('masculino', 'feminino', 'outro')),
  criado_em timestamp with time zone default now(),
  atualizado_em timestamp with time zone default now()
);

-- Criar tabela de consumo de água
create table public.consumo_agua (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.perfis(id) on delete cascade not null,
  quantidade_ml integer not null check (quantidade_ml > 0),
  registrado_em timestamp with time zone default now(),
  observacoes text,
  criado_em timestamp with time zone default now()
);

-- Criar tabela de substituições de alimentos
create table public.substituicoes_alimentos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.perfis(id) on delete cascade not null,
  alimento_original text not null,
  alimento_substituto text not null,
  motivo text,
  diferenca_calorias integer,
  criado_em timestamp with time zone default now(),
  atualizado_em timestamp with time zone default now()
);

-- Criar tabela de medidas corporais
create table public.medidas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.perfis(id) on delete cascade not null,
  peso decimal(5,2) not null, -- em kg
  cintura decimal(5,2), -- em cm
  peito decimal(5,2), -- em cm
  quadril decimal(5,2), -- em cm
  bracos decimal(5,2), -- em cm
  coxas decimal(5,2), -- em cm
  medido_em timestamp with time zone default now(),
  observacoes text,
  criado_em timestamp with time zone default now()
);

-- Criar tabela de alimentos consumidos
create table public.alimentos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.perfis(id) on delete cascade not null,
  nome text not null,
  calorias integer,
  proteina decimal(5,2), -- em gramas
  carboidratos decimal(5,2), -- em gramas
  gorduras decimal(5,2), -- em gramas
  tipo_refeicao text check (tipo_refeicao in ('cafe_manha', 'almoco', 'jantar', 'lanche')),
  consumido_em timestamp with time zone default now(),
  observacoes text,
  criado_em timestamp with time zone default now()
);

-- Habilitar Row Level Security
alter table public.perfis enable row level security;
alter table public.consumo_agua enable row level security;
alter table public.substituicoes_alimentos enable row level security;
alter table public.medidas enable row level security;
alter table public.alimentos enable row level security;

-- Políticas para perfis
create policy "Usuários podem ver seu próprio perfil"
  on public.perfis for select
  using (auth.uid() = id);

create policy "Usuários podem atualizar seu próprio perfil"
  on public.perfis for update
  using (auth.uid() = id);

create policy "Usuários podem inserir seu próprio perfil"
  on public.perfis for insert
  with check (auth.uid() = id);

-- Políticas para consumo de água
create policy "Usuários podem ver seu próprio consumo de água"
  on public.consumo_agua for select
  using (auth.uid() = usuario_id);

create policy "Usuários podem inserir seu próprio consumo de água"
  on public.consumo_agua for insert
  with check (auth.uid() = usuario_id);

create policy "Usuários podem atualizar seu próprio consumo de água"
  on public.consumo_agua for update
  using (auth.uid() = usuario_id);

create policy "Usuários podem deletar seu próprio consumo de água"
  on public.consumo_agua for delete
  using (auth.uid() = usuario_id);

-- Políticas para substituições de alimentos
create policy "Usuários podem ver suas próprias substituições"
  on public.substituicoes_alimentos for select
  using (auth.uid() = usuario_id);

create policy "Usuários podem inserir suas próprias substituições"
  on public.substituicoes_alimentos for insert
  with check (auth.uid() = usuario_id);

create policy "Usuários podem atualizar suas próprias substituições"
  on public.substituicoes_alimentos for update
  using (auth.uid() = usuario_id);

create policy "Usuários podem deletar suas próprias substituições"
  on public.substituicoes_alimentos for delete
  using (auth.uid() = usuario_id);

-- Políticas para medidas
create policy "Usuários podem ver suas próprias medidas"
  on public.medidas for select
  using (auth.uid() = usuario_id);

create policy "Usuários podem inserir suas próprias medidas"
  on public.medidas for insert
  with check (auth.uid() = usuario_id);

create policy "Usuários podem atualizar suas próprias medidas"
  on public.medidas for update
  using (auth.uid() = usuario_id);

create policy "Usuários podem deletar suas próprias medidas"
  on public.medidas for delete
  using (auth.uid() = usuario_id);

-- Políticas para alimentos
create policy "Usuários podem ver seus próprios alimentos"
  on public.alimentos for select
  using (auth.uid() = usuario_id);

create policy "Usuários podem inserir seus próprios alimentos"
  on public.alimentos for insert
  with check (auth.uid() = usuario_id);

create policy "Usuários podem atualizar seus próprios alimentos"
  on public.alimentos for update
  using (auth.uid() = usuario_id);

create policy "Usuários podem deletar seus próprios alimentos"
  on public.alimentos for delete
  using (auth.uid() = usuario_id);

-- Função para atualizar atualizado_em
create or replace function public.atualizar_data_modificacao()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

-- Triggers para atualizado_em
create trigger definir_atualizado_em
  before update on public.perfis
  for each row
  execute function public.atualizar_data_modificacao();

create trigger definir_atualizado_em
  before update on public.substituicoes_alimentos
  for each row
  execute function public.atualizar_data_modificacao();

-- Função para criar perfil automaticamente
create or replace function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfis (id, nome_completo)
  values (new.id, new.raw_user_meta_data->>'nome_completo');
  return new;
end;
$$;

-- Trigger para criação automática de perfil
create trigger ao_criar_usuario
  after insert on auth.users
  for each row
  execute function public.criar_perfil_novo_usuario();