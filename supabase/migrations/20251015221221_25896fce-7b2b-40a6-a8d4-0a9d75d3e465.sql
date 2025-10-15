-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table for user data
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  height decimal(5,2), -- in cm
  target_weight decimal(5,2), -- in kg
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create water intake tracking table
create table public.water_intake (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount_ml integer not null check (amount_ml > 0),
  recorded_at timestamp with time zone default now(),
  notes text,
  created_at timestamp with time zone default now()
);

-- Create food substitutions table
create table public.food_substitutions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  original_food text not null,
  substitute_food text not null,
  reason text,
  calories_difference integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create measurements table for body tracking
create table public.measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  weight decimal(5,2) not null, -- in kg
  waist decimal(5,2), -- in cm
  chest decimal(5,2), -- in cm
  hips decimal(5,2), -- in cm
  arms decimal(5,2), -- in cm
  thighs decimal(5,2), -- in cm
  measured_at timestamp with time zone default now(),
  notes text,
  created_at timestamp with time zone default now()
);

-- Create foods table for user food logs
create table public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  calories integer,
  protein decimal(5,2), -- in grams
  carbs decimal(5,2), -- in grams
  fats decimal(5,2), -- in grams
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  consumed_at timestamp with time zone default now(),
  notes text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.water_intake enable row level security;
alter table public.food_substitutions enable row level security;
alter table public.measurements enable row level security;
alter table public.foods enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Water intake policies
create policy "Users can view their own water intake"
  on public.water_intake for select
  using (auth.uid() = user_id);

create policy "Users can insert their own water intake"
  on public.water_intake for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own water intake"
  on public.water_intake for update
  using (auth.uid() = user_id);

create policy "Users can delete their own water intake"
  on public.water_intake for delete
  using (auth.uid() = user_id);

-- Food substitutions policies
create policy "Users can view their own food substitutions"
  on public.food_substitutions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own food substitutions"
  on public.food_substitutions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own food substitutions"
  on public.food_substitutions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own food substitutions"
  on public.food_substitutions for delete
  using (auth.uid() = user_id);

-- Measurements policies
create policy "Users can view their own measurements"
  on public.measurements for select
  using (auth.uid() = user_id);

create policy "Users can insert their own measurements"
  on public.measurements for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own measurements"
  on public.measurements for update
  using (auth.uid() = user_id);

create policy "Users can delete their own measurements"
  on public.measurements for delete
  using (auth.uid() = user_id);

-- Foods policies
create policy "Users can view their own foods"
  on public.foods for select
  using (auth.uid() = user_id);

create policy "Users can insert their own foods"
  on public.foods for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own foods"
  on public.foods for update
  using (auth.uid() = user_id);

create policy "Users can delete their own foods"
  on public.foods for delete
  using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create triggers for updated_at
create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.food_substitutions
  for each row
  execute function public.handle_updated_at();

-- Create function to handle new user profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- Create trigger for automatic profile creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();