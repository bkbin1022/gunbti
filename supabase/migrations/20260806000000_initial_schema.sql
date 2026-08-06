create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text check (char_length(nickname) between 2 and 30),
  created_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  trait text not null,
  position integer not null unique check (position > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.answer_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  text text not null,
  score jsonb not null default '{}'::jsonb,
  position integer not null check (position > 0),
  unique (question_id, position)
);

create table public.military_jobs (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  branch text,
  description text not null,
  traits jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  scores jsonb not null,
  summary text,
  algorithm_version text not null,
  created_at timestamptz not null default now()
);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.test_results(id) on delete cascade,
  military_job_id uuid not null references public.military_jobs(id) on delete restrict,
  score numeric(5,2) not null check (score >= 0 and score <= 100),
  reason text not null,
  rank smallint not null check (rank between 1 and 3),
  unique (result_id, rank)
);

alter table public.profiles enable row level security;
alter table public.test_results enable row level security;
alter table public.recommendations enable row level security;
alter table public.questions enable row level security;
alter table public.answer_options enable row level security;
alter table public.military_jobs enable row level security;

create policy "users read own profile" on public.profiles for select using ((select auth.uid()) = id);
create policy "users update own profile" on public.profiles for update using ((select auth.uid()) = id);
create policy "users insert own profile" on public.profiles for insert with check ((select auth.uid()) = id);
create policy "users read own results" on public.test_results for select using ((select auth.uid()) = user_id);
create policy "users read own recommendations" on public.recommendations for select using (exists (select 1 from public.test_results r where r.id = result_id and r.user_id = (select auth.uid())));
create policy "public reads active questions" on public.questions for select using (is_active = true);
create policy "public reads answer options" on public.answer_options for select using (exists (select 1 from public.questions q where q.id = question_id and q.is_active = true));
create policy "public reads active jobs" on public.military_jobs for select using (is_active = true);
