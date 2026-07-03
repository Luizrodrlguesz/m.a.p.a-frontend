/**
 * cart.js — carrinho de compras persistido em localStorage.
 * Compartilhado entre todas as páginas: atualiza o contador no header,
 * permite adicionar itens (produtos.html/index.html) e gerenciar
 * quantidades/remoção na página carrinho.html.
 */
const CART_STORAGE_KEY = "nextech_cart";

/* Compartilhado com produtos.js: foto real do produto ou ícone de fallback. */
function productThumbMarkup(product) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}" loading="lazy" />`;
  }
  return `<i class="bi ${product.icon}" aria-hidden="true"></i>`;
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch (err) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, qty });
  }

  saveCart(cart);
  if (typeof showToast === "function") {
    showToast(`${product.name} adicionado ao carrinho`);
  }
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
}

function updateQty(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.qty = Math.max(1, qty);
  saveCart(cart);
  renderCartPage();
}

function cartTotalItems() {
  return getCart().reduce((total, item) => total + item.qty, 0);
}

function cartTotalPrice() {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return product ? total + product.price * item.qty : total;
  }, 0);
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (badge) {
    badge.textContent = cartTotalItems();
  }
}

/* Renderiza a lista de itens do carrinho — usado somente em carrinho.html */
function renderCartPage() {
  const list = document.getElementById("cart-list");
  if (!list) return;

  const cart = getCart();
  const emptyState = document.getElementById("cart-empty");
  const summary = document.getElementById("cart-summary");

  if (!cart.length) {
    list.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    if (summary) summary.style.display = "none";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (summary) summary.style.display = "block";

  list.innerHTML = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return "";
      const subtotal = product.price * item.qty;

      return `
        <li class="cart-item">
          <div class="cart-item-thumb" aria-hidden="true">${productThumbMarkup(product)}</div>
          <div class="cart-item-info">
            <h3>${product.name}</h3>
            <p class="product-desc">${formatCurrency(product.price)} / unidade</p>
          </div>
          <div class="cart-item-actions">
            <strong>${formatCurrency(subtotal)}</strong>
            <div class="cart-item-qty">
              <button type="button" class="qty-btn" data-action="decrease" data-id="${product.id}" aria-label="Diminuir quantidade">−</button>
              <span aria-live="polite">${item.qty}</span>
              <button type="button" class="qty-btn" data-action="increase" data-id="${product.id}" aria-label="Aumentar quantidade">+</button>
            </div>
            <button type="button" class="cart-item-remove" data-action="remove" data-id="${product.id}">Remover</button>
          </div>
        </li>`;
    })
    .join("");

  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");
  const total = cartTotalPrice();
  if (subtotalEl) subtotalEl.textContent = formatCurrency(total);
  if (totalEl) totalEl.textContent = formatCurrency(total);

  list.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const cartNow = getCart();
      const item = cartNow.find((i) => i.id === id);

      if (action === "remove") {
        removeFromCart(id);
        renderCartPage();
      } else if (action === "increase" && item) {
        updateQty(id, item.qty + 1);
      } else if (action === "decrease" && item) {
        if (item.qty <= 1) {
          removeFromCart(id);
          renderCartPage();
        } else {
          updateQty(id, item.qty - 1);
        }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartPage();

  const clearBtn = document.getElementById("cart-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      saveCart([]);
      renderCartPage();
      if (typeof showToast === "function") showToast("Carrinho esvaziado");
    });
  }

  const checkoutBtn = document.getElementById("cart-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!getCart().length) return;
      saveCart([]);
      renderCartPage();
      if (typeof showToast === "function") {
        showToast("Pedido simulado com sucesso! Obrigado pela compra.");
      }
    });
  }
});
