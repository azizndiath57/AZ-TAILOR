-- Durcissement de la sécurité (à exécuter une seule fois dans l'éditeur SQL de Supabase)

-- 1. profiles : un utilisateur ne peut plus écrire la colonne "role" (ni à l'inscription, ni ensuite)
revoke insert, update on public.profiles from anon, authenticated;
grant insert (id, phone, nom_atelier) on public.profiles to authenticated;
grant update (phone, nom_atelier) on public.profiles to authenticated;

-- 2. subscriptions : lecture seule pour le propriétaire ; seuls les webhooks (service role) écrivent
drop policy "Users can manage their own subscriptions" on public.subscriptions;
create policy "Users can read their own subscription" on public.subscriptions
  for select to authenticated using ((select auth.uid()) = owner_id);
revoke insert, update, delete, truncate on public.subscriptions from anon, authenticated;

-- 3. mot de passe oublié : compteur de tentatives par compte, réservé au serveur
create table public.password_reset_attempts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  attempts integer not null default 0,
  window_start timestamptz not null default now()
);
alter table public.password_reset_attempts enable row level security;
revoke all on public.password_reset_attempts from anon, authenticated;

-- Consomme une tentative de façon atomique ; renvoie false au-delà de 5 tentatives par heure
create function public.consume_password_reset_attempt(p_user_id uuid)
returns boolean
language sql
set search_path = ''
as $$
  insert into public.password_reset_attempts as a (user_id, attempts, window_start)
  values (p_user_id, 1, now())
  on conflict (user_id) do update
    set attempts = case when a.window_start < now() - interval '1 hour' then 1 else a.attempts + 1 end,
        window_start = case when a.window_start < now() - interval '1 hour' then now() else a.window_start end
  returning a.attempts <= 5;
$$;
revoke execute on function public.consume_password_reset_attempt(uuid) from public, anon, authenticated;
grant execute on function public.consume_password_reset_attempt(uuid) to service_role;
