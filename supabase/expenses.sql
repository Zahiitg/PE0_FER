create table if not exists public.expenses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  amount     numeric(12,2) not null check (amount > 0),
  category   text not null check (category in ('Food','Transport','Shopping','Bills','Other')),
  spent_on   date not null,
  note       text not null default '' check (char_length(note) <= 100),
  created_at timestamptz not null default now()
);

create index if not exists expenses_user_idx
  on public.expenses (user_id, spent_on desc, created_at desc);

alter table public.expenses enable row level security;

drop policy if exists "expenses select own" on public.expenses;
drop policy if exists "expenses insert own" on public.expenses;
drop policy if exists "expenses delete own" on public.expenses;

create policy "expenses select own" on public.expenses
  for select to authenticated using (auth.uid() = user_id);
create policy "expenses insert own" on public.expenses
  for insert to authenticated with check (auth.uid() = user_id);
create policy "expenses delete own" on public.expenses
  for delete to authenticated using (auth.uid() = user_id);
