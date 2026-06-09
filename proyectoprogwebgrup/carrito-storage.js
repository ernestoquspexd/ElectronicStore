const CART_KEY = 'voltCart';
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
const normalizeId = (value) => value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
const parsePrice = (text) => {
    const value = text.replace(/[^0-9]/g, '');
    return Number(value) || 0;
};
const addToCart = (card) => {
    const title = card.querySelector('h2')?.textContent?.trim() || 'Producto';
    const brand = card.querySelector('h4')?.textContent?.trim() || '';
    const priceText = Array.from(card.querySelectorAll('p')).find((p) => /precio/i.test(p.textContent))?.textContent || '';
    const price = parsePrice(priceText);
    const image = card.querySelector('img')?.src || '';
    const id = card.dataset.id || normalizeId(title);
    const cart = getCart();
    const existing = cart.find((item) => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, title, brand, price, image, qty: 1 });
    }
    saveCart(cart);
};
document.addEventListener('click', (event) => {
    const button = event.target.closest('.btn-carrito');
    if (!button) return;
    const card = button.closest('.card');
    if (!card) return;
    addToCart(card);
});
