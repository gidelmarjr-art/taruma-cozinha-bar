// Dados de demonstração — mesmo formato das tabelas do Supabase
// (unidades / categorias / produtos). Usados como fallback automático
// enquanto VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não existem, e como
// referência de "seed" pro schema.sql. Ver /supabase/schema.sql.

export const seedUnidades = [
  {
    id: 'sudoeste',
    slug: 'sudoeste',
    nome: 'Sudoeste',
    tagline: 'A unidade original, no coração do Sudoeste',
    endereco: 'SIG, Quadra 6, Lote 2330 🔥 Sudoeste, Brasília - DF',
    telefone: '+55 61 99845-6208',
    whatsapp_url: 'https://taruma.supersal.com.br/wppsudoeste',
    link_ifood: 'https://taruma.supersal.com.br/ifoodsudoeste',
    link_cardapio_pdf: 'https://www.dguests.com.br/cardapio/TARUMA',
    link_drinks_pdf: 'https://drive.google.com/file/d/18qrB6ZjHdj2TSTRYvD_3Evxchal3-HOE/view?usp=drive_link',
    maps_query: 'Tarumã Cozinha e Bar Sudoeste, SIG Quadra 6 Lote 2330, Brasília',
    foto_url: '/images/steak-onion-rings.jpg',
    horarios_funcionamento: [
      { dia: 'Domingo a quinta', horario: '11h às 16h' },
      { dia: 'Sexta e sábado', horario: '11h às 00h' },
    ],
  },
  {
    id: 'gama',
    slug: 'gama',
    nome: 'Gama',
    tagline: 'A segunda casa do Tarumã, no Gama',
    endereco: 'St. Central, Área Especial 6 🔥 Gama, Brasília - DF',
    telefone: null,
    whatsapp_url: 'https://taruma.supersal.com.br/wppgama',
    link_ifood: 'https://taruma.supersal.com.br/ifoodgama',
    link_cardapio_pdf: 'https://taruma.supersal.com.br/cardapiogama',
    link_drinks_pdf: 'https://drive.google.com/file/d/1mrclsflCqQM9icQmgyj_fUcuDEhcv_xN/view?usp=drive_link',
    maps_query: 'Tarumã Cozinha e Bar Gama, St Central Área Especial 6, Gama, Brasília',
    foto_url: '/images/peixe-legumes.jpg',
    horarios_funcionamento: [{ dia: 'Segunda a domingo', horario: '11h às 00h' }],
  },
]

// Taxonomia real do cardápio do Tarumã (a partir do sistema atual deles).
// `tipo` separa Comida de Drink pro alternador da página /cardapio.
export const seedCategorias = [
  { id: 'queridinhos', slug: 'queridinhos', nome: 'Queridinhos Tarumã (seg a sex, almoço e jantar)', ordem: 1, tipo: 'comida' },
  { id: 'entradas', slug: 'entradas', nome: 'Entradas', ordem: 2, tipo: 'comida' },
  { id: 'saladas', slug: 'saladas', nome: 'Saladas', ordem: 3, tipo: 'comida' },
  { id: 'petiscos', slug: 'petiscos', nome: 'Petiscos para Compartilhar', ordem: 4, tipo: 'comida' },
  { id: 'pasteis', slug: 'pasteis', nome: 'Pastéis Tarumã', ordem: 5, tipo: 'comida' },
  { id: 'combinados', slug: 'combinados', nome: 'Combinados, para Dividir', ordem: 6, tipo: 'comida' },
  { id: 'risotos-massas', slug: 'risotos-massas', nome: 'Risotos e Massas', ordem: 7, tipo: 'comida' },
  { id: 'pratos-individuais', slug: 'pratos-individuais', nome: 'Pratos Individuais', ordem: 8, tipo: 'comida' },
  { id: 'camaroes', slug: 'camaroes', nome: 'Camarões para Compartilhar', ordem: 9, tipo: 'comida' },
  { id: 'peixes', slug: 'peixes', nome: 'Peixes para Compartilhar', ordem: 10, tipo: 'comida' },
  { id: 'moquecas', slug: 'moquecas', nome: 'Moquecas para Compartilhar', ordem: 11, tipo: 'comida' },
  { id: 'carnes', slug: 'carnes', nome: 'Carnes para Compartilhar', ordem: 12, tipo: 'comida' },
  { id: 'file-mignon', slug: 'file-mignon', nome: 'Pratos de Filé Mignon para Compartilhar', ordem: 13, tipo: 'comida' },
  { id: 'sobremesas', slug: 'sobremesas', nome: 'Sobremesas', ordem: 14, tipo: 'comida' },
  { id: 'promocoes', slug: 'promocoes', nome: 'Promoções Tarumã', ordem: 15, tipo: 'comida' },
  { id: 'bebidas', slug: 'bebidas', nome: 'Bebidas', ordem: 16, tipo: 'drink' },
  { id: 'sucos', slug: 'sucos', nome: 'Sucos', ordem: 17, tipo: 'drink' },
  { id: 'cervejas', slug: 'cervejas', nome: 'Cervejas', ordem: 18, tipo: 'drink' },
  { id: 'destilados', slug: 'destilados', nome: 'Destilados', ordem: 19, tipo: 'drink' },
  { id: 'drinks', slug: 'drinks', nome: 'Drinks', ordem: 20, tipo: 'drink' },
  { id: 'caipifrutas', slug: 'caipifrutas', nome: 'Caipifrutas', ordem: 21, tipo: 'drink' },
]

export const seedProdutos = [
  {
    id: 'bruschetta-camarao',
    unidade_id: 'sudoeste',
    categoria_id: 'entradas',
    nome: 'Bruschetta de camarão',
    descricao: 'Pão crocante, camarão na manteiga e um toque de pimenta',
    preco: null,
    porcao: 'Serve 2 pessoas',
    imagem_url: '/images/bruschetta-camarao.jpg',
    destaque_favorito: true,
    prato_da_semana: false,
    disponivel: true,
  },
  {
    id: 'prato-executivo',
    unidade_id: 'sudoeste',
    categoria_id: 'pratos-individuais',
    nome: 'Prato executivo da casa',
    descricao: 'Carne no ponto, arroz, banana da terra e salada',
    preco: null,
    porcao: 'Serve 1 pessoa',
    imagem_url: '/images/prato-executivo.jpg',
    destaque_favorito: true,
    prato_da_semana: true,
    disponivel: true,
  },
  {
    id: 'fritas-molho',
    unidade_id: 'sudoeste',
    categoria_id: 'petiscos',
    nome: 'Fritas com molho da casa',
    descricao: 'Batata frita coberta com molho cremoso, pra dividir na mesa',
    preco: null,
    porcao: 'Serve 2 a 3 pessoas',
    imagem_url: '/images/fritas-molho.jpg',
    destaque_favorito: true,
    prato_da_semana: false,
    disponivel: true,
  },
  {
    id: 'brownie-sorvete',
    unidade_id: 'sudoeste',
    categoria_id: 'sobremesas',
    nome: 'Brownie com sorvete',
    descricao: 'Quentinho, com bola de sorvete e calda de chocolate',
    preco: null,
    porcao: 'Serve 1 pessoa',
    imagem_url: '/images/brownie-sorvete.jpg',
    destaque_favorito: true,
    prato_da_semana: false,
    disponivel: true,
  },
]

export const seedAvaliacoes = []

export const social = {
  instagram: 'https://www.instagram.com/tarumacozinhaebar/',
  instagramHandle: '@tarumacozinhaebar',
}

export const galleryPhotos = [
  { src: '/images/mesa-brinde.jpg', alt: 'Mesa de amigos brindando com drinks e petiscos do Tarumã' },
  { src: '/images/drinks-toast.jpg', alt: 'Brinde com drinks autorais do Tarumã' },
  { src: '/images/moranga-camarao.jpg', alt: 'Camarão na moranga servido na casca' },
  { src: '/images/salada-palha.jpg', alt: 'Salada com batata palha e tomate cereja' },
  { src: '/images/peixe-legumes.jpg', alt: 'Peixe grelhado com legumes' },
  { src: '/images/steak-onion-rings.jpg', alt: 'Carne com anéis de cebola empanados' },
]
