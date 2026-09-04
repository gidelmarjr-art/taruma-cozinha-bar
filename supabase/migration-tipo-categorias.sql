-- ============================================================================
-- Tarumã Cozinha e Bar — Migração: coluna `tipo` em categorias
-- ============================================================================
-- Rode este arquivo no SQL Editor do Supabase SE o seu banco já existia
-- antes desta atualização (ou seja: você já tinha rodado o schema.sql uma
-- vez e agora a página /cardapio está aparecendo vazia mesmo com produtos
-- cadastrados). Ele é seguro de rodar mesmo que parte já exista — não
-- apaga nem duplica nada, e preserva os produtos que você já cadastrou
-- (a ligação categoria → produto continua com o mesmo id).
-- ============================================================================

-- 1. Adiciona a coluna `tipo`, se ainda não existir
alter table categorias
  add column if not exists tipo text not null default 'comida';

alter table categorias
  drop constraint if exists categorias_tipo_check;

alter table categorias
  add constraint categorias_tipo_check check (tipo in ('comida', 'drink'));

-- 2. Corrige o tipo das categorias antigas que já existiam antes da coluna
--    (o passo 1 preenche tudo como 'comida' por padrão — aqui corrigimos
--    a categoria de drinks que já existia sob esse nome/slug antigo)
update categorias set tipo = 'drink' where slug = 'drinks';

-- 3. Insere as categorias novas da taxonomia real que ainda não existem
--    (categorias que você já tinha, como "Entradas" ou "Sobremesas",
--    mantêm o id original — os produtos já cadastrados nelas continuam
--    linkados corretamente)
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

-- 4. Conferência: rode isso pra ver o estado final das categorias
select slug, nome, tipo, ordem from categorias order by ordem;
