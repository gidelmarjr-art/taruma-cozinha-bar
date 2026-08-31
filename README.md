# Tarumã Cozinha e Bar — Plataforma Digital

Aplicação React (Vite) com painel administrativo, para as duas unidades do
Tarumã (Sudoeste e Gama): cardápio dinâmico, avaliações, reservas e gestão
completa pela gerência.

## Como o projeto funciona

O site tem **dois modos**:

- **Modo demonstração** (padrão, sem configuração nenhuma): usa os dados
  fixos em `src/data/seed.js`. O site builda, roda e mostra o cardápio atual
  normalmente. Só o painel `/admin` fica bloqueado, pedindo pra conectar o
  Supabase.
- **Modo conectado**: depois de configurar as variáveis de ambiente
  (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`), todo o site passa a ler e
  escrever no banco de verdade, e o painel admin é liberado.

Isso permite abrir, mexer e fazer deploy do projeto imediatamente, sem
depender do banco estar pronto.

## 1. Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Nesse ponto já está em modo demonstração.

## 2. Conectar o Supabase (banco + login + upload de imagens)

1. Crie uma conta e um projeto em [supabase.com](https://supabase.com).
2. No painel do projeto, vá em **SQL Editor** → **New query**, cole todo o
   conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql) e rode.
   Isso cria as tabelas (`unidades`, `categorias`, `produtos`, `avaliacoes`,
   `reservas`), as políticas de segurança (RLS), o bucket de imagens e já
   insere as duas unidades (Sudoeste e Gama) com os dados atuais.
3. Vá em **Authentication → Users → Add user** e crie o usuário (e-mail e
   senha) que a gerência vai usar pra logar em `/admin`. Qualquer usuário
   autenticado tem acesso total ao painel — crie um por gestor.
4. Vá em **Project Settings → API** e copie a **Project URL** e a chave
   **anon public**.
5. Copie `.env.example` para `.env` e preencha:

   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

6. Reinicie `npm run dev`. O site agora lê do banco, e `/admin/login` deixa
   entrar com o usuário criado no passo 3.

⚠️ **Sobre o link de reserva por WhatsApp**: hoje `whatsapp_url` nas
unidades aponta pra um redirecionador (`supersal.com.br`) que não foi
confirmado se repassa a mensagem pré-formatada. Se a mensagem não chegar
preenchida no WhatsApp, troque `whatsapp_url` na tabela `unidades` pelo link
direto `https://wa.me/55SEUNUMERO`.

## 3. Deploy (Vercel)

1. Suba o repositório pro GitHub.
2. Em [vercel.com](https://vercel.com), importe o repositório.
3. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY` com os mesmos valores do `.env`.
4. Deploy. O `vercel.json` já está configurado para o roteamento
   (`/admin`, `/admin/login`) funcionar corretamente em produção.

## Estrutura do projeto

```
supabase/
  schema.sql          tabelas, RLS e dados iniciais — rode isso no Supabase

src/
  data/seed.js         dados de demonstração (mesmo formato das tabelas)
  lib/supabase.js       cliente Supabase + flag isSupabaseConfigured
  store/useUnitStore.js  unidade selecionada globalmente (Zustand, persistido)
  hooks/                 acesso a dados: unidades, categorias, produtos,
                          avaliações, reservas, autenticação — cada um cai
                          pro seed.js automaticamente se o Supabase não
                          estiver configurado

  components/            peças reutilizáveis do site público
    UnitSwitcher/          seletor global Sudoeste/Gama (no header)
    QuickViewModal/        modal de detalhe do prato + avaliações
    ReservationModal/      formulário de reserva → WhatsApp (+ banco)
    Header/ Hero/ About/ Menu/ Locations/ Gallery/ Testimonials/ CTA/ Footer/

  pages/
    Site/SitePublico.jsx    monta a landing page pública
    Admin/
      AdminLogin.jsx          tela de login
      ProtectedRoute.jsx      bloqueia /admin sem sessão
      AdminDashboard.jsx      painel: cardápio (CRUD) + avaliações (moderação)
      ProductForm.jsx         formulário de criar/editar prato com upload de foto

  App.jsx                 rotas: "/" (site), "/admin/login", "/admin"
```

## Painel administrativo (`/admin`)

Depois de logar:

- **Cardápio**: escolha a unidade no topo, veja todos os pratos dela
  (inclusive os ocultos), crie um novo prato, edite ou exclua. O upload de
  foto vai direto pro Supabase Storage. Os três toggles (Favorito da casa,
  Prato da semana, Disponível no site) controlam onde o prato aparece na
  landing page.
- **Avaliações**: toda avaliação enviada pelos clientes chega pendente.
  Aqui a gerência aprova (passa a aparecer no site) ou exclui.

## Coisas que ficaram fora do escopo desta entrega

- **Reservas** já são salvas na tabela `reservas` quando o Supabase está
  conectado, mas o painel admin ainda não tem uma tela pra visualizar essa
  lista (confirmar/cancelar) — só a moderação de avaliações e o CRUD de
  cardápio foram construídos. Dá pra consultar a tabela direto pelo
  Table Editor do Supabase por enquanto.
- **Categorias** são geridas só pelo SQL/Table Editor por enquanto — não há
  tela no painel pra criar/editar categorias.
- **Envio de convite por e-mail** para novos usuários do painel: hoje o
  usuário é criado manualmente em Authentication → Users.
