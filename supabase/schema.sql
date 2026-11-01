-- Physical AI Academy membership schema, revision 2026-11-01
-- Already applied to Supabase project gtxqappprshwfbmiaomp (eu-west-3).
create table if not exists public.academy_progress (
 user_id uuid primary key references auth.users(id) on delete cascade,
 progress jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now(),
 constraint academy_progress_object check (jsonb_typeof(progress) = 'object'),
 constraint academy_progress_size check (octet_length(progress::text) < 1000000)
);
alter table public.academy_progress enable row level security;
revoke all on public.academy_progress from PUBLIC, anon;
grant select, insert, update, delete on public.academy_progress to authenticated;
create policy "members_read_own_progress" on public.academy_progress for select to authenticated using ((select auth.uid())=user_id);
create policy "members_create_own_progress" on public.academy_progress for insert to authenticated with check ((select auth.uid())=user_id);
create policy "members_update_own_progress" on public.academy_progress for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "members_delete_own_progress" on public.academy_progress for delete to authenticated using ((select auth.uid())=user_id);

create table if not exists public.academy_training_runs (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 experiment_name text not null check(char_length(experiment_name) between 1 and 140),
 belt text check(belt in ('white','yellow','orange','green','blue','brown','black')),
 robot text, simulator text, learning_method text, policy_model text, dataset text,
 outcome jsonb not null default '{}'::jsonb check(jsonb_typeof(outcome)='object'),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists academy_training_runs_owner_time on public.academy_training_runs(user_id,created_at desc);
alter table public.academy_training_runs enable row level security;
revoke all on public.academy_training_runs from PUBLIC,anon;
grant select,insert,update,delete on public.academy_training_runs to authenticated;
create policy "members_read_own_training_runs" on public.academy_training_runs for select to authenticated using ((select auth.uid())=user_id);
create policy "members_create_own_training_runs" on public.academy_training_runs for insert to authenticated with check ((select auth.uid())=user_id);
create policy "members_update_own_training_runs" on public.academy_training_runs for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "members_delete_own_training_runs" on public.academy_training_runs for delete to authenticated using ((select auth.uid())=user_id);
