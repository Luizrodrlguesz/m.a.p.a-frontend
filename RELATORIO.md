# Relatório Técnico — NexTech Store

**Disciplina:** Programação Front-End
**Autor:** Luiz Henrique
**Projeto:** Loja virtual simplificada (tema livre)

---

## 1. Visão geral do projeto

A **NexTech Store** é uma loja virtual simplificada de eletrônicos e acessórios de
tecnologia, desenvolvida como atividade MAPA da disciplina de Programação
Front-End. O objetivo foi aplicar, em um projeto único e coeso, os três pilares
do desenvolvimento front-end apresentados no material da disciplina: **HTML5**
para a estrutura semântica do conteúdo, **CSS3** para a estilização responsiva
e **JavaScript** para o comportamento interativo (NOEL, 2025).

O site é 100% estático (sem back-end), com os dados de produtos e o carrinho de
compras simulados em JavaScript puro (vanilla JS) e persistidos no
`localStorage` do navegador — suficiente para demonstrar os conceitos de
manipulação de DOM, eventos e armazenamento local exigidos na atividade.

---

## 2. Arquitetura do site

O projeto contém **5 páginas HTML interligadas** por um menu de navegação
comum, superando o mínimo de 4 páginas solicitado:

| Página            | Função                                                             |
|--------------------|---------------------------------------------------------------------|
| `index.html`       | Home institucional: hero, diferenciais da loja e produtos em destaque |
| `produtos.html`    | Catálogo completo, com busca em tempo real e filtro por categoria   |
| `carrinho.html`    | Carrinho de compras com quantidade, remoção e resumo do pedido      |
| `sobre.html`       | História do projeto, missão/visão/valores e linha do tempo          |
| `contato.html`     | Formulário de contato com validação em JavaScript                   |

### Estrutura de arquivos

```
mapa-front/
├── index.html
├── produtos.html
├── carrinho.html
├── sobre.html
├── contato.html
├── robots.txt
├── sitemap.xml
├── css/
│   └── style.css          → design system, layout responsivo (mobile-first)
├── js/
│   ├── products-data.js   → "fonte de dados" única dos produtos
│   ├── main.js             → menu hambúrguer, scroll reveal, toast, footer
│   ├── cart.js              → carrinho (localStorage), renderização e eventos
│   ├── produtos.js         → renderização de cards, busca e filtro
│   └── validation.js       → validação do formulário de contato
├── img/
│   ├── products/           → fotos reais dos 10 produtos do catálogo
│   ├── features/           → fotos dos cards "Por que comprar na NexTech"
│   └── about/               → foto do autor usada na página Sobre
└── docs/
    └── screenshots/        → capturas de tela referenciadas neste relatório
```

Optou-se por separar o JavaScript em módulos por responsabilidade (dados,
navegação, carrinho, catálogo, validação) em vez de um único arquivo,
facilitando a manutenção e deixando explícito qual script pertence a qual
funcionalidade — uma boa prática de organização de código reforçada no
material da disciplina (TOKUMOTO, 2018).

---

## 3. Tecnologias e decisões de design

### 3.1 HTML5 semântico e SEO básico

Todas as páginas usam tags semânticas (`header`, `nav`, `main`, `section`,
`article`, `aside`, `footer`), um único `h1` por página e hierarquia de
títulos consistente. Para atender ao requisito de SEO básico, cada página
possui:

- `<title>` único e descritivo;
- `meta description` e `meta keywords` específicas do conteúdo da página;
- `meta og:*` (Open Graph) na home, para pré-visualização em redes sociais;
- `link rel="canonical"`;
- atributo `lang="pt-BR"` no `<html>`;
- texto alternativo (`alt`) e `aria-label` em elementos não textuais/ícones;
- `robots.txt` e `sitemap.xml` na raiz do projeto, incluindo a diretiva
  `Disallow` para `carrinho.html` (página transacional, sem valor de
  indexação) e `meta name="robots" content="noindex, follow"` na própria
  página do carrinho.

### 3.2 CSS3 responsivo (mobile-first) e identidade visual flat

O arquivo `css/style.css` foi construído com a abordagem **mobile-first**:
os estilos base atendem telas pequenas e duas media queries (`min-width:
768px` e `min-width: 1024px`) progressivamente reorganizam o layout em
grid para tablets e desktops (SILVA, 2021).

A identidade visual segue o conceito de **flat design 100%** citado no
material de apoio (NOEL, 2025), levado ao extremo por três decisões de
design system (variáveis em `:root`):

- **Paleta estritamente monocromática** — apenas preto (`#0d0d0d`),
  branco e tons de cinza. Nenhuma cor de destaque (matiz) é usada em
  nenhum elemento da interface, incluindo estados de sucesso/erro do
  formulário, que se diferenciam por ícone e peso da borda, não por cor;
- **Zero border-radius** — todas as bordas do site (botões, cards,
  inputs, badges, avatares) são retas, sem nenhum arredondamento;
- **Zero gradientes e zero sombras (`box-shadow`)** — a separação entre
  elementos é feita por bordas sólidas de 1–2px, não por sombras ou
  transições de cor, reforçando a estética flat;
- **Tipografia:** fonte única `Rajdhani` (Google Fonts, carregada via
  `<link>` no `<head>` de cada página), com títulos em caixa alta e
  leve espaçamento entre letras para reforçar o caráter tecnológico da
  marca.

Os ícones do menu, do rodapé e das informações de contato usam a
biblioteca **Bootstrap Icons**, carregada via CDN (sem necessidade de
download), garantindo glifos vetoriais monocromáticos (`currentColor`)
no lugar de emojis — que, por serem coloridos, quebrariam a paleta
monocromática do projeto.

Principais técnicas de CSS aplicadas:
- **CSS Grid** para a grade de produtos (1 coluna no mobile → 2 no tablet
  → 4 no desktop);
- **Flexbox** para o cabeçalho, cartões e formulário;
- **Media queries** para reorganizar o menu (de gaveta lateral no mobile
  para barra horizontal no desktop);
- **`filter: grayscale()` + `mix-blend-mode: multiply`** nas fotos dos
  produtos, para que o fundo branco das fotos "se funda" com o fundo
  cinza-claro dos cards, sem caixas brancas destacadas;
- **`filter: grayscale()` com transição no `:hover`** nos três cards da
  seção "Por que comprar na NexTech": a foto começa em preto e branco e,
  ao passar o mouse, revela a cor original da fotografia com um leve
  efeito de zoom (`transform: scale()`) — o principal efeito visual
  interativo do projeto;
- **Transições e keyframes** para hover e a animação de entrada
  (fade/slide) dos cards de produto.

### 3.3 JavaScript / interatividade

Foram implementados **quatro** recursos interativos em JavaScript puro
(o dobro do mínimo exigido):

1. **Menu hambúrguer responsivo** (`main.js`): alterna a classe `is-open`
   do menu e anima o ícone de três traços para um "X" em CSS puro.
2. **Carrinho de compras dinâmico** (`cart.js`): adiciona/remove itens,
   ajusta quantidades e persiste tudo em `localStorage`, atualizando o
   contador do carrinho em tempo real em qualquer página.
3. **Busca e filtro de produtos em tempo real** (`produtos.js`): o campo de
   busca e os *chips* de categoria filtram o catálogo via manipulação do
   DOM, sem recarregar a página.
4. **Validação de formulário em tempo real** (`validation.js`): cada campo
   é validado ao perder o foco (`blur`) e, se inválido, mostra mensagem de
   erro específica; o envio só ocorre se todos os campos obrigatórios
   forem válidos.

Como efeito adicional, foi implementado um **scroll reveal** com
`IntersectionObserver` (`main.js`), que anima a entrada de seções conforme
o usuário rola a página — um recurso puramente decorativo que reforça o
domínio de APIs modernas do navegador além do jQuery citado no material
de referência.

---

## 4. Formulário de contato — regras de validação

O formulário (`contato.html` + `js/validation.js`) valida, sem depender de
bibliotecas externas:

- **Nome completo:** mínimo de 3 caracteres;
- **E-mail:** formato válido via expressão regular (`usuario@dominio.tld`);
- **Telefone (opcional):** se preenchido, deve seguir o padrão
  `(DD) 9XXXX-XXXX`;
- **Assunto:** seleção obrigatória em um `<select>`;
- **Mensagem:** mínimo de 10 caracteres, com contador de caracteres em
  tempo real (limite de 500).

Como não há back-end nesta atividade acadêmica, o envio é **simulado**: ao
passar na validação, o formulário exibe uma mensagem de sucesso e é
limpo — deixando claro, no próprio código, onde uma chamada real a uma API
de e-mail (ex.: EmailJS, Formspree) entraria em um cenário de produção.

---

## 5. Imagens e fotografias utilizadas

Os 10 produtos do catálogo, os 3 cards da seção "Por que comprar na
NexTech" (entrega, segurança, suporte) e a foto do autor na página Sobre
usam **fotografias reais**, tratadas em CSS (escala de cinza, e nos três
cards de destaque também com revelação de cor no hover) para manter a
identidade visual monocromática do site.

> **Atenção — pendência antes da entrega:** as imagens usadas nas pastas
> `img/products/`, `img/features/` e `img/about/` foram fornecidas
> diretamente pelo autor do projeto. Antes de submeter esta atividade,
> confirme a origem/licença de cada fotografia que não seja de sua
> autoria (ex.: bancos de imagens gratuitos como Unsplash, Pexels, ou
> fotos de produto do próprio fabricante/loja) e inclua aqui a
> referência completa de cada uma, conforme exigido pelo enunciado
> ("citando todas as fontes utilizadas"). A foto usada na página Sobre
> (`img/about/eu.jpg`) é uma foto pessoal do autor e não necessita de
> citação.

---

## 6. Desafios enfrentados

- **Contraste de texto no hero:** durante os testes, o título principal da
  home ficou quase invisível (texto escuro sobre fundo escuro), pois uma
  regra genérica de `h1` sobrescrevia a cor branca herdada da seção
  `.hero`. O problema foi identificado visualmente em captura de tela e
  corrigido fixando a cor branca diretamente no seletor `.hero h1`.
- **Grid do item do carrinho:** inicialmente a grade de 3 colunas do
  carrinho (imagem, informações, ações) não escalava bem para diferentes
  quantidades de dados; a solução foi agrupar preço, seletor de
  quantidade e botão de remover em um único bloco flexível, mantendo a
  grade estável em qualquer breakpoint.
- **Persistência do carrinho entre páginas:** como o carrinho precisa
  refletir o mesmo estado em `index.html`, `produtos.html` e
  `carrinho.html`, optou-se por `localStorage` (em vez de variáveis em
  memória), garantindo que o contador do cabeçalho e a lista de itens
  fiquem sincronizados mesmo após recarregar a página.
- **Timing do `scroll reveal`:** o efeito de revelar seções ao rolar a
  página depende do elemento realmente entrar na viewport; em testes
  automatizados com rolagem instantânea o efeito não disparava, mas o
  comportamento foi confirmado como correto em uma rolagem gradual,
  típica de um usuário real.
- **Fundo branco das fotos de produto sobre o card cinza:** como as fotos
  fornecidas pelo fabricante têm fundo branco puro, colocá-las direto
  sobre o card gerava uma "caixa branca" destacada e pouco integrada ao
  layout. A solução foi combinar `filter: grayscale(100%)` com
  `mix-blend-mode: multiply`, fazendo o branco da foto se fundir com o
  cinza-claro do card.
- **Revisão de design para 100% flat/monocromático:** o site começou com
  uma paleta em tons de azul/laranja, cantos arredondados e emojis como
  ícones. Atender ao pedido de um visual 100% flat e monocromático exigiu
  reescrever o design system inteiro (variáveis de cor, radius e sombra)
  e substituir **todos** os emojis do projeto (mais de 20 ocorrências,
  incluindo o logotipo do carrinho) por ícones vetoriais do Bootstrap
  Icons, já que emojis são coloridos por padrão no navegador e quebrariam
  a paleta.

---

## 7. Testes realizados

O site foi testado localmente (servidor estático) em resoluções desktop
(1366px) e mobile (375px), cobrindo:

- Navegação entre as 5 páginas e destaque do link ativo no menu;
- Abertura/fechamento do menu hambúrguer no mobile;
- Adição de produtos ao carrinho a partir da Home e da página de Produtos;
- Alteração de quantidade e remoção de itens no carrinho, com recálculo
  automático do subtotal e total;
- Busca textual e filtro por categoria no catálogo;
- Envio do formulário de contato com campos vazios (erros exibidos) e com
  dados válidos (mensagem de sucesso exibida);
- Verificação do console do navegador, sem erros de JavaScript em nenhuma
  página.

---

## 8. Capturas de tela

As imagens completas estão na pasta `docs/screenshots/`. Resumo do que cada
uma demonstra:

| Arquivo | Conteúdo |
|---|---|
| `01-home-desktop.png` | Home em resolução desktop: hero, cards "Por que comprar" e produtos em destaque, todos com fotos reais |
| `02-home-mobile.png` | Home em resolução mobile (375px), layout empilhado |
| `03-menu-hamburguer.png` | Menu hambúrguer aberto no mobile |
| `04-produtos-desktop.png` | Catálogo completo (10 produtos, todos com foto real) com filtros por categoria |
| `05-produtos-busca.png` | Busca em tempo real filtrando por "fone" |
| `06-produtos-filtro-categoria.png` | Filtro pela categoria "Acessórios" |
| `07-carrinho.png` | Carrinho com 2 itens, controle de quantidade e total |
| `08-sobre.png` | Página Sobre, com foto pessoal do autor, missão/visão/valores e linha do tempo |
| `09-contato.png` | Formulário de contato e cartão de informações (ícones Bootstrap Icons) |
| `10-contato-erros-validacao.png` | Validação exibindo erros em campos obrigatórios vazios |
| `11-contato-sucesso.png` | Mensagem de sucesso após envio de dados válidos |
| `12-contato-email-invalido.png` | Validação específica de e-mail em formato inválido |

---

## 9. Considerações finais

O desenvolvimento da NexTech Store permitiu aplicar, em um projeto único,
os conceitos centrais da disciplina: estruturação semântica em HTML5,
estilização responsiva mobile-first em CSS3 e interatividade em
JavaScript puro — sem depender de frameworks como React ou bibliotecas
como jQuery, mas seguindo os mesmos princípios de manipulação de DOM e
eventos que essas ferramentas abstraem (NOEL, 2025). O resultado é um
site funcional, responsivo e navegável, que simula de forma realista a
experiência de uma loja virtual simplificada.

---

## Referências

TOKUMOTO, Ronie Cesar. **Programação Front End**. Maringá-PR: Unicesumar, 2018.

NOEL, André Abdala. **Programação Front End**. Florianópolis, SC: Arqué, 2025. 232 p.

SILVA, Maurício Samy. **HTML5 – A linguagem de marcação que revolucionou a web**. São Paulo: Novatec, 2021.

MDN Web Docs. *Front-end web developer*. Disponível em: https://developer.mozilla.org/pt-BR/docs/Learn/Front-end_web_developer. Acesso em: 8 abr. 2024.

W3Schools. *HTML Tutorial*. Disponível em: https://www.w3schools.com/html/. Acesso em: 8 abr. 2024.

W3Schools. *CSS Tutorial*. Disponível em: https://www.w3schools.com/css/. Acesso em: 8 abr. 2024.
