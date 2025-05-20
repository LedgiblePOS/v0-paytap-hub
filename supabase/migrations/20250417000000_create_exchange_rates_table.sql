
create table if not exists public.exchange_rates (
  id uuid default gen_random_uuid() primary key,
  base_currency text not null,
  rates jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(base_currency)
);

-- Add RLS policies
alter table public.exchange_rates enable row level security;

create policy "Exchange rates are viewable by all authenticated users"
  on public.exchange_rates for select
  to authenticated
  using (true);

create policy "Exchange rates are insertable by authenticated users"
  on public.exchange_rates for insert
  to authenticated
  with check (true);

create policy "Exchange rates are updatable by authenticated users"
  on public.exchange_rates for update
  to authenticated
  using (true);
