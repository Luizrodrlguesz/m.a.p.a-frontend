/**
 * produtos.js — renderiza o catálogo em produtos.html e implementa
 * busca em tempo real + filtro por categoria (efeito interativo adicional).
 * Também é usado em index.html para renderizar os produtos em destaque.
 */
function createProductCard(product, index) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.style.animationDelay = `${index * 0.06}s`;

  card.innerHTML = `
    <div class="product-thumb" aria-hidden="true">${productThumbMarkup(product)}</div>
    <div class="product-body">
      <span class="product-category">${product.categoryLabel}</span>
      <h3>${product.name}</h3>
      <p class="product-desc">${product.desc}</p>
      <p class="product-price">${formatCurrency(product.price)}</p>
      <button type="button" class="btn btn-primary btn-block" data-add-to-cart="${product.id}">
        Adicionar ao carrinho
      </button>
    </div>
  `;

  return card;
}

function renderProducts(list, products) {
  list.innerHTML = "";
  const emptyState = document.getElementById("products-empty");

  if (!products.length) {
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (emptyState) emptyState.style.display = "none";

  products.forEach((product, index) => {
    list.appendChild(createProductCard(product, index));
  });

  list.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.addToCart));
  });
}

function initProductsPage() {
  const list = document.getElementById("product-list");
  if (!list) return;

  const searchInput = document.getElementById("product-search");
  const chips = document.querySelectorAll(".chip");
  let activeCategory = "all";

  function applyFilters() {
    const term = (searchInput?.value || "").trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesTerm =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.desc.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
    renderProducts(list, filtered);
  }

  searchInput?.addEventListener("input", applyFilters);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.dataset.category;
      applyFilters();
    });
  });

  applyFilters();
}

function initFeaturedProducts() {
  const list = document.getElementById("featured-list");
  if (!list) return;
  const featured = FEATURED_PRODUCT_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  renderProducts(list, featured);
}

document.addEventListener("DOMContentLoaded", () => {
  initProductsPage();
  initFeaturedProducts();
});
