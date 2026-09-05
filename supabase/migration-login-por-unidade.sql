-- ============================================================================
-- Tarumã Cozinha e Bar — Migração: login restrito por unidade
-- ============================================================================
-- Rode este arquivo no SQL Editor do Supabase se o seu projeto já existia
-- antes desta atualização. Ele é seguro — não apaga nada, e o seu login
-- atual (o do dono) continua funcionando exatamente igual, enxergando as
-- duas unidades, sem precisar de nenhum passo extra.
--
-- O que muda: agora dá pra criar um login que só enxerga e edita UMA
-- unidade — útil quando cada casa tem uma equipe diferente cuidando do
-- próprio cardápio e avaliações.
-- ============================================================================

-- 1. Tabela que vincula um login a uma unidade específica (login sem linha
--    aqui = super admin, enxerga tudo — é o caso do seu login atual)
create table if not exists perfis_admin (
  id uuid primary key references auth.users(id) on delete cascade,
  unidade_id uuid references unidades(id),
  nome text,
  created_at timestamptz not null default now()
);

alter table perfis_admin enable row level security;

drop policy if exists "perfis_admin_le_proprio" on perfis_admin;
create policy "perfis_admin_le_proprio" on perfis_admin for select
  using (auth.uid() = id);

-- 2. Funções que verificam a permissão (usadas nas políticas abaixo)
create or replace function auth_unidade_permitida(alvo_unidade_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select auth.role() = 'authenticated' and (
    not exists (select 1 from perfis_admin where id = auth.uid())
    or exists (
      select 1 from perfis_admin
      where id = auth.uid()
      and (unidade_id is null or unidade_id = alvo_unidade_id)
    )
  );
$$;

create or replace function auth_super_admin()
returns boolean
language sql
security definer
stable
as $$
  select auth.role() = 'authenticated' and (
    not exists (select 1 from perfis_admin where id = auth.uid())
    or exists (select 1 from perfis_admin where id = auth.uid() and unidade_id is null)
  );
$$;

-- 3. Substitui as políticas antigas (liberação geral pra qualquer logado)
--    pelas novas (travadas por unidade)
drop policy if exists "unidades_write_admin" on unidades;
create policy "unidades_write_admin" on unidades for all
  using (auth_super_admin()) with check (auth_super_admin());

drop policy if exists "categorias_write_admin" on categorias;
create policy "categorias_write_admin" on categorias for all
  using (auth_super_admin()) with check (auth_super_admin());

drop policy if exists "produtos_write_admin" on produtos;
create policy "produtos_write_admin" on produtos for all
  using (auth_unidade_permitida(unidade_id)) with check (auth_unidade_permitida(unidade_id));

drop policy if exists "avaliacoes_admin_select_todas" on avaliacoes;
create policy "avaliacoes_admin_select_todas" on avaliacoes for select
  using (exists (
    select 1 from produtos p where p.id = avaliacoes.produto_id
    and auth_unidade_permitida(p.unidade_id)
  ));

drop policy if exists "avaliacoes_admin_update" on avaliacoes;
create policy "avaliacoes_admin_update" on avaliacoes for update
  using (exists (
    select 1 from produtos p where p.id = avaliacoes.produto_id
    and auth_unidade_permitida(p.unidade_id)
  ))
  with check (exists (
    select 1 from produtos p where p.id = avaliacoes.produto_id
    and auth_unidade_permitida(p.unidade_id)
  ));

drop policy if exists "avaliacoes_admin_delete" on avaliacoes;
create policy "avaliacoes_admin_delete" on avaliacoes for delete
  using (exists (
    select 1 from produtos p where p.id = avaliacoes.produto_id
    and auth_unidade_permitida(p.unidade_id)
  ));

drop policy if exists "reservas_admin_select" on reservas;
create policy "reservas_admin_select" on reservas for select
  using (auth_unidade_permitida(unidade_id));

drop policy if exists "reservas_admin_update" on reservas;
create policy "reservas_admin_update" on reservas for update
  using (auth_unidade_permitida(unidade_id)) with check (auth_unidade_permitida(unidade_id));

-- ============================================================================
-- 4. Pra criar o login de uma equipe (rode só depois de criar o usuário em
--    Authentication > Users no painel do Supabase):
-- ============================================================================
--
-- insert into perfis_admin (id, unidade_id, nome)
-- select u.id, un.id, 'Equipe Sudoeste'
-- from auth.users u, unidades un
-- where u.email = 'equipe-sudoeste@exemplo.com' and un.slug = 'sudoeste';
--
-- insert into perfis_admin (id, unidade_id, nome)
-- select u.id, un.id, 'Equipe Gama'
-- from auth.users u, unidades un
-- where u.email = 'equipe-gama@exemplo.com' and un.slug = 'gama';
--
-- Conferência: veja quem está vinculado a quê
select p.nome, p.unidade_id, un.nome as unidade, u.email
from perfis_admin p
join auth.users u on u.id = p.id
left join unidades un on un.id = p.unidade_id;
