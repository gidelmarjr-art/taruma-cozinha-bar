-- ============================================================================
-- Tarumã Cozinha e Bar — Migração: avaliações não precisam mais de aprovação
-- ============================================================================
-- Rode este arquivo no SQL Editor do Supabase. Ele faz duas coisas:
-- 1. Muda o padrão da coluna `aprovado` pra `true` — toda avaliação nova
--    enviada pelos clientes já aparece publicada na hora, sem passar pelo
--    admin.
-- 2. Publica as avaliações que já estavam pendentes de aprovação (se você
--    preferir revisá-las manualmente antes, comente essa linha).
--
-- O painel /admin continua com a opção de "Ocultar" uma avaliação depois
-- de publicada, caso alguém deixe um comentário impróprio.
-- ============================================================================

alter table avaliacoes alter column aprovado set default true;

update avaliacoes set aprovado = true where aprovado = false;
