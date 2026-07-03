/**
 * Catálogo de produtos da NexTech Store.
 * Mantido em um arquivo separado para simular uma "fonte de dados" única,
 * consumida tanto pela home (destaques) quanto pela página de produtos e pelo carrinho.
 *
 * Cada produto tem "image" (foto real, tratada em escala de cinza via CSS)
 * ou, na ausência de foto própria, "icon" (glifo do Bootstrap Icons) como
 * alternativa visual temporária — ambos monocromáticos.
 */
const PRODUCTS = [
  {
    id: "p01",
    name: "Fone Bluetooth NX Pulse",
    category: "audio",
    categoryLabel: "Áudio",
    price: 249.9,
    image: "img/products/fone.jpg",
    desc: "Fone sem fio com cancelamento de ruído e 30h de bateria."
  },
  {
    id: "p02",
    name: "Teclado Mecânico NX Type",
    category: "computacao",
    categoryLabel: "Computação",
    price: 389.0,
    image: "img/products/teclado.jpg",
    desc: "Switches táteis, retroiluminação e layout ABNT2."
  },
  {
    id: "p03",
    name: "Mouse Sem Fio NX Aim",
    category: "computacao",
    categoryLabel: "Computação",
    price: 159.5,
    image: "img/products/mouse.jpg",
    desc: "Design minimalista, sensor óptico preciso e formato ergonômico."
  },
  {
    id: "p04",
    name: "Lâmpada Inteligente NX Glow",
    category: "casa",
    categoryLabel: "Smart Home",
    price: 89.9,
    image: "img/products/lampada.jpg",
    desc: "Controle por app, 16 milhões de cores e integração por voz."
  },
  {
    id: "p05",
    name: "Hub USB-C NX Multi",
    category: "acessorios",
    categoryLabel: "Acessórios",
    price: 129.0,
    image: "img/products/hub.jpg",
    desc: "7 portas em 1: HDMI, USB 3.0, leitor de cartão e mais."
  },
  {
    id: "p06",
    name: "Suporte para Notebook NX Stand",
    category: "acessorios",
    categoryLabel: "Acessórios",
    price: 99.9,
    image: "img/products/suporte-notebook.jpg",
    desc: "Alumínio ajustável, melhora a ergonomia no home office."
  },
  {
    id: "p07",
    name: "Carregador de Parede NX Charge 20W",
    category: "acessorios",
    categoryLabel: "Acessórios",
    price: 89.9,
    image: "img/products/carregador.jpg",
    desc: "Carregamento rápido USB-C de 20W, compacto para levar na bolsa."
  },
  {
    id: "p08",
    name: "Câmera de Segurança NX View",
    category: "casa",
    categoryLabel: "Smart Home",
    price: 219.0,
    image: "img/products/camera.jpg",
    desc: "Visão noturna, detecção de movimento e áudio bidirecional."
  },
  {
    id: "p09",
    name: "Cabo USB-C NX Link",
    category: "acessorios",
    categoryLabel: "Acessórios",
    price: 49.9,
    image: "img/products/cabo.jpg",
    desc: "Cabo USB-C trançado em nylon, resistente e com carregamento rápido."
  },
  {
    id: "p10",
    name: "Smartwatch NX Fit",
    category: "vestiveis",
    categoryLabel: "Vestíveis",
    price: 349.9,
    image: "img/products/relogio.jpg",
    desc: "Monitor de atividades, notificações e bateria de longa duração no pulso."
  }
];

/* IDs exibidos na seção "Produtos em destaque" da Home, nesta ordem. */
const FEATURED_PRODUCT_IDS = ["p01", "p02", "p03", "p10"];
