-- Habilitar la extensión UUID
create extension if not exists "uuid-ossp";

-- Crear tabla de perfiles
create table profiles (
  id uuid references auth.users(id) primary key,
  email text unique,
  full_name text,
  avatar_url text,
  -- Campos básicos del onboarding
  project_type text,
  artist_name text,
  members text[],
  guest_members text[],
  creative_team text[],
  distributor text,
  label_status text default 'independent',
  label_name text,
  language text default 'es',
  -- Redes sociales
  socials jsonb default '{
    "instagram_followers": 0,
    "spotify_monthly_listeners": 0,
    "tiktok_followers": 0,
    "youtube_subscribers": 0,
    "mailing_list_size": 0
  }'::jsonb,
  -- Discografía
  discography jsonb default '{
    "eps": [],
    "singles_released": [],
    "upcoming_releases": [],
    "visual_concept": ""
  }'::jsonb,
  -- Historia en vivo
  live_history jsonb default '{
    "highlights": [],
    "avg_capacity": 0,
    "avg_ticket_price_ars": 0
  }'::jsonb,
  -- Financieros
  financials jsonb default '{
    "annual_expenses_ars": 0,
    "budget_per_launch_ars": 0
  }'::jsonb,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear tabla de créditos 
create table credits (
  id uuid references auth.users(id) primary key,
  amount integer default 3,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear tabla de transacciones de créditos
create table credit_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  amount integer not null,
  type text check (type in ('purchase', 'use')),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear tabla de mensajes de chat
create table chat_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  role text check (role in ('user', 'assistant')),
  content text not null,
  agent_type text not null,
  agent_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear tabla de estrategias
create table strategies (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  calendar jsonb not null,
  task_tracker jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Crear políticas de seguridad RLS
alter table profiles enable row level security;
alter table credits enable row level security;
alter table credit_transactions enable row level security;
alter table chat_messages enable row level security;
alter table strategies enable row level security;

-- Políticas para profiles
create policy "Usuarios pueden leer su propio perfil"
  on profiles for select
  using (auth.uid() = id);

create policy "Usuarios pueden actualizar su propio perfil"
  on profiles for update
  using (auth.uid() = id);

create policy "Usuarios pueden crear su propio perfil"
  on profiles for insert
  with check (auth.uid() = id OR (auth.jwt() IS NOT NULL AND id = auth.uid()));

-- Políticas para credits
create policy "Usuarios pueden leer sus propios créditos"
  on credits for select
  using (auth.uid() = id);

create policy "Usuarios pueden actualizar sus propios créditos"
  on credits for update
  using (auth.uid() = id);

create policy "Usuarios pueden crear sus propios créditos"
  on credits for insert
  with check (auth.uid() = id OR (auth.jwt() IS NOT NULL AND id = auth.uid()));

-- Políticas para credit_transactions
create policy "Usuarios pueden ver sus propias transacciones"
  on credit_transactions for select
  using (auth.uid() = user_id);

create policy "Usuarios pueden crear sus propias transacciones"
  on credit_transactions for insert
  with check (auth.uid() = user_id);

-- Políticas para chat_messages
create policy "Usuarios pueden ver sus propios mensajes"
  on chat_messages for select
  using (auth.uid() = user_id);

create policy "Usuarios pueden crear sus propios mensajes"
  on chat_messages for insert
  with check (auth.uid() = user_id);

-- Políticas para strategies
create policy "Usuarios pueden ver sus propias estrategias"
  on strategies for select
  using (auth.uid() = user_id);

create policy "Usuarios pueden crear sus propias estrategias"
  on strategies for insert
  with check (auth.uid() = user_id);

create policy "Usuarios pueden actualizar sus propias estrategias"
  on strategies for update
  using (auth.uid() = user_id);