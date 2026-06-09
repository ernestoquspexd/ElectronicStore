const CART_KEY = 'voltCart';
const cartItemsElement = document.getElementById('cartItems');
const totalNode = document.getElementById('totalOrden');
const countNode = document.getElementById('itemCount');
const statusText = document.getElementById('statusText');
const emptyCart = document.querySelector('.empty-cart');
const form = document.getElementById('checkoutForm');
const formatPrice = (value) => Number(value).toLocaleString('es-BO');
const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
};
const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};
const createCartItemHtml = (item) => {
  const imageHtml = item.image
    ? `<img src="${item.image}" alt="${item.title}">`
    : `<div class="image-placeholder">Imagen</div>`;
  return `
    <article class="cart-item" data-price="${item.price}" data-id="${item.id}">
      <div class="item-meta">
        ${imageHtml}
        <div>
          <h3>${item.title}</h3>
          <p>${item.brand}</p>
        </div>
      </div>
      <div class="item-actions">
        <div class="price">Precio unitario <span>Bs. ${formatPrice(item.price)}</span></div>
        <div class="qty-control">
          <button class="qty-btn qty-minus" type="button">-</button>
          <input type="number" class="qty" value="${item.qty}" min="1">
          <button class="qty-btn qty-plus" type="button">+</button>
        </div>
        <div class="subtotal">Subtotal <strong>Bs. <span>${formatPrice(item.price * item.qty)}</span></strong></div>
        <button class="remove-btn" type="button">Quitar</button>
      </div>
    </article>`;
};
const renderCart = () => {
  const cart = getCart();
  if (!cartItemsElement) return;
  if (cart.length === 0) {
    cartItemsElement.innerHTML = '';
    emptyCart.classList.remove('oculto');
    totalNode.textContent = 'Bs. 0';
    countNode.textContent = '0';
    statusText.textContent = 'Tu carrito está vacío. Agrega productos para verlos aquí.';
    return;
  }
  emptyCart.classList.add('oculto');
  cartItemsElement.innerHTML = cart.map(createCartItemHtml).join('');
  updateTotals();
};
const updateTotals = () => {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalNode.textContent = `Bs. ${formatPrice(total)}`;
  countNode.textContent = String(cart.length);
};
const setCartItemQty = (id, qty) => {
  const cart = getCart();
  const item = cart.find((product) => product.id === id);
  if (!item) return;
  item.qty = Math.max(1, qty);
  saveCart(cart);
};
const removeCartItem = (id) => {
  const cart = getCart().filter((product) => product.id !== id);
  saveCart(cart);
};
const parsePrice = (text) => Number(text.replace(/[^0-9]/g, '')) || 0;
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const normalizeCard = (value) => (value || '').replace(/\D/g, '');
const validCardNumber = (value) => {
  const digits = normalizeCard(value);
  return digits.length >= 13 && digits.length <= 19;
};
const validateForm = () => {
  if (!form) return false;
  const required = Array.from(form.querySelectorAll('[required]'));
  for (const field of required) {
    if (!field.value.trim()) {
      field.focus();
      statusText.textContent = `Falta ${field.previousElementSibling ? field.previousElementSibling.textContent.toLowerCase() : 'un campo'}.`;
      return false;
    }
    if (field.type === 'email' && !validEmail(field.value)) {
      field.focus();
      statusText.textContent = 'El correo electrónico no tiene el formato correcto.';
      return false;
    }
    if (field.id === 'tarjeta' && !validCardNumber(field.value)) {
      field.focus();
      statusText.textContent = 'El número de tarjeta no tiene el formato correcto.';
      return false;
    }
  }
  return true;
};
const handleCartClick = (event) => {
  const button = event.target.closest('.qty-btn, .remove-btn');
  if (!button) return;
  const item = button.closest('.cart-item');
  if (!item) return;
  const id = item.dataset.id;
  if (button.classList.contains('qty-plus')) {
    const input = item.querySelector('.qty');
    input.value = Number(input.value || 1) + 1;
    setCartItemQty(id, Number(input.value));
    renderCart();
  }
  if (button.classList.contains('qty-minus')) {
    const input = item.querySelector('.qty');
    input.value = Math.max(1, Number(input.value || 1) - 1);
    setCartItemQty(id, Number(input.value));
    renderCart();
  }
  if (button.classList.contains('remove-btn')) {
    removeCartItem(id);
    renderCart();
  }
};
const handleCartInput = (event) => {
  if (!event.target.classList.contains('qty')) return;
  const input = event.target;
  const item = input.closest('.cart-item');
  if (!item) return;
  const id = item.dataset.id;
  const value = Math.max(1, Number(input.value || 1));
  input.value = value;
  setCartItemQty(id, value);
  renderCart();
};
const handleSubmit = (event) => {
  event.preventDefault();
  const cart = getCart();
  if (cart.length === 0) {
    statusText.textContent = 'No hay productos en el carrito para comprar.';
    return;
  }
  if (!validateForm()) return;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  statusText.textContent = `¡Perfecto! Tu pedido de ${cart.length} artículo(s) por Bs. ${formatPrice(total)} está listo.`;
  form.reset();
};
if (cartItemsElement) {
  renderCart();
  cartItemsElement.addEventListener('click', handleCartClick);
  cartItemsElement.addEventListener('input', handleCartInput);
}
if (form) form.addEventListener('submit', handleSubmit);
