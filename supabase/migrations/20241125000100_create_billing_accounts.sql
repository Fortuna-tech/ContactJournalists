-- Billing accounts table to track non-journalist subscriptions
create table if not exists public.billing_accounts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_id text,
  price_id text,
  status text not null default 'incomplete',
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  usage_window_start timestamptz,
  pitch_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists billing_accounts_profile_unique on public.billing_accounts(profile_id);
create index if not exists billing_accounts_status_idx on public.billing_accounts(status);
create index if not exists billing_accounts_plan_idx on public.billing_accounts(plan_id);

create or replace function public.handle_billing_accounts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_billing_accounts_updated_at
before update on public.billing_accounts
for each row
execute procedure public.handle_billing_accounts_updated_at();
