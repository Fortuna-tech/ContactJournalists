-- Create billing_accounts table
create table public.billing_accounts (
  id uuid primary key references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  subscription_status text,
  plan_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add index for subscription status
create index idx_billing_accounts_subscription_status on public.billing_accounts(subscription_status);

-- RLS Policies for billing_accounts
alter table public.billing_accounts enable row level security;

create policy "Users can view their own billing account"
  on public.billing_accounts for select
  using ( auth.uid() = id );

-- Only service role should update this table usually, but for now let's allow users to view

