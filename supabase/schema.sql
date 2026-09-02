-- ============================================================================
-- Tarumã Cozinha e Bar — Schema do banco (Supabase / PostgreSQL)
-- ============================================================================
-- Como usar:
-- 1. Crie um projeto em https://supabase.com
-- 2. Abra o SQL Editor do projeto e cole este arquivo inteiro
-- 3. Rode. Isso cria as tabelas, políticas de segurança (RLS) e os dados
--    iniciais das duas unidades.
-- 4. Depois, crie um usuário em Authentication > Users para logar no painel
--    admin (/admin/login) — qualquer usuário autenticado tem acesso de gestor.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Tabelas
-- ----------------------------------------------------------------------------

create table if not exists unidades (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  tagline text,
  endereco text not null,
  telefone text,
  whatsapp_url text,
  link_ifood text,
  link_cardapio_pdf text,
  link_drinks_pdf text,
  maps_query text,
  foto_url text,
  horarios_funcionamento jsonb not null default '[]'::jsonb,
  -- exemplo de horarios_funcionamento:
  -- [{"dia": "Domingo a quinta", "horario": "11h às 16h"}, {"dia": "Sexta e sábado", "horario": "11h às 00h"}]
  created_at timestamptz not null default now()
);

create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  ordem int not null default 0,
  tipo text not null default 'comida' check (tipo in ('comida', 'drink'))
);

create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  unidade_id uuid not null references unidades(id) on delete cascade,
  categoria_id uuid references categorias(id) on delete set null,
  nome text not null,
  descricao text,
  preco numeric(10, 2),
  porcao text, -- ex: "Serve 2 pessoas"
  imagem_url text,
  destaque_favorito boolean not null default false,
  prato_da_semana boolean not null default false,
  disponivel boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists avaliacoes (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references produtos(id) on delete cascade,
  nome_cliente text not null,
  nota int not null check (nota between 1 and 5),
  comentario text,
  aprovado boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists reservas (
  id uuid primary key default gen_random_uuid(),
  unidade_id uuid not null references unidades(id),
  nome_cliente text not null,
  telefone text not null,
  data_reserva date not null,
  horario time not null,
  pessoas int not null default 2,
  observacoes text,
  status text not null default 'pendente' check (status in ('pendente', 'confirmada', 'cancelada')),
  created_at timestamptz not null default now()
);

-- Índices úteis
create index if not exists idx_produtos_unidade on produtos(unidade_id);
create index if not exists idx_produtos_categoria on produtos(categoria_id);
create index if not exists idx_avaliacoes_produto on avaliacoes(produto_id);
create index if not exists idx_reservas_unidade on reservas(unidade_id);

-- ----------------------------------------------------------------------------
-- Row Level Security — leitura pública do que é público, escrita só logado
-- ----------------------------------------------------------------------------

alter table unidades enable row level security;
alter table categorias enable row level security;
alter table produtos enable row level security;
alter table avaliacoes enable row level security;
alter table reservas enable row level security;

-- Unidades: qualquer pessoa lê, só usuário logado (gerência) edita
create policy "unidades_select_publico" on unidades for select using (true);
create policy "unidades_write_admin" on unidades for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Categorias: idem
create policy "categorias_select_publico" on categorias for select using (true);
create policy "categorias_write_admin" on categorias for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Produtos: leitura pública só de itens disponíveis; gestão total pra admin
create policy "produtos_select_publico" on produtos for select using (disponivel = true);
create policy "produtos_write_admin" on produtos for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Avaliações: qualquer pessoa pode enviar (insert), mas só vê as aprovadas;
-- admin vê e modera tudo
create policy "avaliacoes_insert_publico" on avaliacoes for insert with check (true);
create policy "avaliacoes_select_aprovadas" on avaliacoes for select using (aprovado = true);
create policy "avaliacoes_admin_select_todas" on avaliacoes for select
  using (auth.role() = 'authenticated');
create policy "avaliacoes_admin_update" on avaliacoes for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "avaliacoes_admin_delete" on avaliacoes for delete
  using (auth.role() = 'authenticated');

-- Reservas: qualquer pessoa pode criar (insert); só admin lê/gerencia
create policy "reservas_insert_publico" on reservas for insert with check (true);
create policy "reservas_admin_select" on reservas for select
  using (auth.role() = 'authenticated');
create policy "reservas_admin_update" on reservas for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- Storage — bucket para fotos de produtos (público pra leitura)
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

create policy "produtos_bucket_leitura_publica" on storage.objects for select
  using (bucket_id = 'produtos');

create policy "produtos_bucket_upload_admin" on storage.objects for insert
  with check (bucket_id = 'produtos' and auth.role() = 'authenticated');

create policy "produtos_bucket_delete_admin" on storage.objects for delete
  using (bucket_id = 'produtos' and auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- Dados iniciais — as duas unidades já existentes
-- ----------------------------------------------------------------------------

insert into unidades (nome, slug, tagline, endereco, telefone, whatsapp_url, link_ifood, link_cardapio_pdf, link_drinks_pdf, maps_query, foto_url, horarios_funcionamento)
values
(
  'Sudoeste',
  'sudoeste',
  'A unidade original, no coração do Sudoeste',
  'SIG, Quadra 6, Lote 2330 — Sudoeste, Brasília - DF',
  '+55 61 99845-6208',
  'https://taruma.supersal.com.br/wppsudoeste',
  'https://taruma.supersal.com.br/ifoodsudoeste',
  'https://www.dguests.com.br/cardapio/TARUMA',
  'https://drive.google.com/file/d/18qrB6ZjHdj2TSTRYvD_3Evxchal3-HOE/view?usp=drive_link',
  'Tarumã Cozinha e Bar Sudoeste, SIG Quadra 6 Lote 2330, Brasília',
  '/images/steak-onion-rings.jpg',
  '[{"dia": "Domingo a quinta", "horario": "11h às 16h"}, {"dia": "Sexta e sábado", "horario": "11h às 00h"}]'
),
(
  'Gama',
  'gama',
  'A segunda casa do Tarumã, no Gama',
  'St. Central, Área Especial 6 — Gama, Brasília - DF',
  null,
  'https://taruma.supersal.com.br/wppgama',
  'https://taruma.supersal.com.br/ifoodgama',
  'https://taruma.supersal.com.br/cardapiogama',
  'https://drive.google.com/file/d/1mrclsflCqQM9icQmgyj_fUcuDEhcv_xN/view?usp=drive_link',
  'Tarumã Cozinha e Bar Gama, St Central Área Especial 6, Gama, Brasília',
  '/images/peixe-legumes.jpg',
  '[{"dia": "Segunda a domingo", "horario": "11h às 00h"}]'
)
on conflict (slug) do nothing;

-- Taxonomia real do cardápio do Tarumã (a partir do sistema atual deles).
insert into categorias (nome, slug, ordem, tipo) values
  ('Queridinhos Tarumã (seg a sex, almoço e jantar)', 'queridinhos', 1, 'comida'),
  ('Entradas', 'entradas', 2, 'comida'),
  ('Saladas', 'saladas', 3, 'comida'),
  ('Petiscos para Compartilhar', 'petiscos', 4, 'comida'),
  ('Pastéis Tarumã', 'pasteis', 5, 'comida'),
  ('Combinados, para Dividir', 'combinados', 6, 'comida'),
  ('Risotos e Massas', 'risotos-massas', 7, 'comida'),
  ('Pratos Individuais', 'pratos-individuais', 8, 'comida'),
  ('Camarões para Compartilhar', 'camaroes', 9, 'comida'),
  ('Peixes para Compartilhar', 'peixes', 10, 'comida'),
  ('Moquecas para Compartilhar', 'moquecas', 11, 'comida'),
  ('Carnes para Compartilhar', 'carnes', 12, 'comida'),
  ('Pratos de Filé Mignon para Compartilhar', 'file-mignon', 13, 'comida'),
  ('Sobremesas', 'sobremesas', 14, 'comida'),
  ('Promoções Tarumã', 'promocoes', 15, 'comida'),
  ('Bebidas', 'bebidas', 16, 'drink'),
  ('Sucos', 'sucos', 17, 'drink'),
  ('Cervejas', 'cervejas', 18, 'drink'),
  ('Destilados', 'destilados', 19, 'drink'),
  ('Drinks', 'drinks', 20, 'drink'),
  ('Caipifrutas', 'caipifrutas', 21, 'drink')
on conflict (slug) do nothing;

-- Produtos de exemplo (favoritos atuais), vinculados à unidade Sudoeste
insert into produtos (unidade_id, categoria_id, nome, descricao, porcao, imagem_url, destaque_favorito)
select
  u.id,
  c.id,
  p.nome,
  p.descricao,
  p.porcao,
  p.imagem_url,
  true
from (
  values
    ('entradas', 'Bruschetta de camarão', 'Pão crocante, camarão na manteiga e um toque de pimenta', 'Serve 2 pessoas', '/images/bruschetta-camarao.jpg'),
    ('pratos-individuais', 'Prato executivo da casa', 'Carne no ponto, arroz, banana da terra e salada', 'Serve 1 pessoa', '/images/prato-executivo.jpg'),
    ('petiscos', 'Fritas com molho da casa', 'Batata frita coberta com molho cremoso, pra dividir na mesa', 'Serve 2 a 3 pessoas', '/images/fritas-molho.jpg'),
    ('sobremesas', 'Brownie com sorvete', 'Quentinho, com bola de sorvete e calda de chocolate', 'Serve 1 pessoa', '/images/brownie-sorvete.jpg')
) as p(categoria_slug, nome, descricao, porcao, imagem_url)
join categorias c on c.slug = p.categoria_slug
join unidades u on u.slug = 'sudoeste';
