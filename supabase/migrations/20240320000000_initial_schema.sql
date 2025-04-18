-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create fund_pages table
create table public.fund_pages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  mission_statement text,
  bitcoin_address text,
  lightning_address text,
  is_public boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create accountability_sections table
create table public.accountability_sections (
  id uuid default uuid_generate_v4() primary key,
  fund_page_id uuid references public.fund_pages(id) on delete cascade not null,
  section_type text not null check (section_type in ('mission', 'financial', 'transparency')),
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create transactions table
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  fund_page_id uuid references public.fund_pages(id) on delete cascade not null,
  amount numeric not null,
  currency text not null default 'sats',
  transaction_hash text,
  status text not null check (status in ('pending', 'confirmed', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index profiles_email_idx on public.profiles(email);
create index fund_pages_user_id_idx on public.fund_pages(user_id);
create index fund_pages_created_at_idx on public.fund_pages(created_at);
create index accountability_sections_fund_page_id_idx on public.accountability_sections(fund_page_id);
create index transactions_fund_page_id_idx on public.transactions(fund_page_id);
create index transactions_created_at_idx on public.transactions(created_at);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.fund_pages enable row level security;
alter table public.accountability_sections enable row level security;
alter table public.transactions enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Fund pages policies
create policy "Users can view public fund pages"
  on public.fund_pages for select
  using (is_public = true);

create policy "Users can view their own fund pages"
  on public.fund_pages for select
  using (auth.uid() = user_id);

create policy "Users can create fund pages"
  on public.fund_pages for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own fund pages"
  on public.fund_pages for update
  using (auth.uid() = user_id);

-- Accountability sections policies
create policy "Users can view public accountability sections"
  on public.accountability_sections for select
  using (
    exists (
      select 1 from public.fund_pages
      where fund_pages.id = accountability_sections.fund_page_id
      and fund_pages.is_public = true
    )
  );

create policy "Users can view their own accountability sections"
  on public.accountability_sections for select
  using (
    exists (
      select 1 from public.fund_pages
      where fund_pages.id = accountability_sections.fund_page_id
      and fund_pages.user_id = auth.uid()
    )
  );

create policy "Users can create accountability sections"
  on public.accountability_sections for insert
  with check (
    exists (
      select 1 from public.fund_pages
      where fund_pages.id = accountability_sections.fund_page_id
      and fund_pages.user_id = auth.uid()
    )
  );

create policy "Users can update their own accountability sections"
  on public.accountability_sections for update
  using (
    exists (
      select 1 from public.fund_pages
      where fund_pages.id = accountability_sections.fund_page_id
      and fund_pages.user_id = auth.uid()
    )
  );

-- Transactions policies
create policy "Users can view their own transactions"
  on public.transactions for select
  using (
    exists (
      select 1 from public.fund_pages
      where fund_pages.id = transactions.fund_page_id
      and fund_pages.user_id = auth.uid()
    )
  );

create policy "Users can create transactions"
  on public.transactions for insert
  with check (
    exists (
      select 1 from public.fund_pages
      where fund_pages.id = transactions.fund_page_id
      and fund_pages.user_id = auth.uid()
    )
  );

-- Remove automatic profile creation trigger
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user(); 