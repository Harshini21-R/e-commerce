/* script.js - frontend-only e-commerce logic using localStorage (no backend) */

/* Seed products if none exist in localStorage */
const SEED_PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: 2999, image: "https://images.unsplash.com/photo-1518444089045-2f7e83f1a3ca?auto=format&fit=crop&w=800&q=60", description: "Comfortable over-ear headphones with noise cancellation." },
  { id: 2, name: "Smartwatch Series 5", price: 7999, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60", description: "Track fitness, messages, and heart rate." },
  { id: 3, name: "Gaming Laptop", price: 85999, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60", description: "Powerful laptop designed for gaming and creative work." },
  { id: 4, name: "Bluetooth Speaker", price: 1999, image: "https://images.unsplash.com/photo-1518444023248-9f4d4b9c3f37?auto=format&fit=crop&w=800&q=60", description: "Portable speaker with deep bass." },
  { id: 5, name: "Sneakers (Tech Edition)", price: 3499, image: "https://images.unsplash.com/photo-1528701800489-476fdb5f3278?auto=format&fit=crop&w=800&q=60", description: "Comfortable sneakers with tech-friendly design." }
];

function loadProducts() {
  const raw = localStorage.getItem('products');
  if (raw) {
    try { return JSON.parse(raw); } catch(e){ console.error(e); }
  }
  localStorage.setItem('products', JSON.stringify(SEED_PRODUCTS));
  return SEED_PRODUCTS.slice();
}

function saveProducts(arr){ localStorage.setItem('products', JSON.stringify(arr)); }

function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); updateCartCount(); }

function updateCartCount(){
  const el = document.getElementById('cart-count');
  if (!el) return;
  const count = getCart().reduce((s,i)=>s+i.quantity,0);
  el.innerText = count;
}

/* Render on Shop and Admin pages */
function renderProductsList(){
  const products = loadProducts();
  const shop = document.getElementById('products');
  const admin = document.getElementById('admin-products');
  if (shop){
    shop.innerHTML = '';
    products.forEach(p=>{
      const el = document.createElement('div');
      el.className = 'product card';
      el.innerHTML = `<img src="${p.image}" alt="${p.name}"><h3>${p.name}</h3><p class="desc">${p.description||''}</p><div class="price">₹${p.price}</div><div class="actions"><button class="btn" onclick="addToCart(${p.id})">Add to Cart</button></div>`;
      shop.appendChild(el);
    });
  }
  if (admin){
    admin.innerHTML='';
    products.forEach(p=>{
      const el = document.createElement('div');
      el.className='product card';
      el.innerHTML = `<img src="${p.image}" alt="${p.name}"><h3>${p.name}</h3><p class="desc">${p.description||''}</p><div class="price">₹${p.price}</div><div style="margin-top:8px"><button onclick="removeProduct(${p.id})" class="btn ghost">Delete</button></div>`;
      admin.appendChild(el);
    });
  }
}

/* Cart functions */
function addToCart(productId){
  const products = loadProducts();
  const prod = products.find(p=>p.id===productId);
  if (!prod) return alert('Product not found');
  const cart = getCart();
  const idx = cart.findIndex(i=>i.productId===productId);
  if (idx>-1) cart[idx].quantity += 1;
  else cart.push({ productId, quantity:1, name:prod.name, price:prod.price, image:prod.image });
  saveCart(cart);
  alert(prod.name + ' added to cart');
}

/* Render cart page */
function renderCartPage(){
  const container = document.getElementById('cart-items');
  if (!container) return;
  const cart = getCart();
  container.innerHTML = '';
  if (cart.length===0){
    container.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    let total = 0;
    cart.forEach((it, idx)=>{
      total += it.price * it.quantity;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `<img src="${it.image}" alt="${it.name}"><div style="flex:1"><strong>${it.name}</strong><div>₹${it.price} x ${it.quantity}</div></div><div><button onclick="removeFromCart(${idx})" class="btn ghost">Remove</button></div>`;
      container.appendChild(div);
    });
    const summary = document.getElementById('cart-summary');
    if (summary) summary.innerHTML = '<h3>Total: ₹'+total+'</h3><div style="margin-top:12px"><button class="btn" onclick="checkout()">Checkout</button><button class="btn ghost" onclick="clearCart()">Clear Cart</button></div>';
  }
}

function removeFromCart(index){
  const cart = getCart();
  if (index<0 || index>=cart.length) return;
  cart.splice(index,1);
  saveCart(cart);
  renderCartPage();
}

/* Admin functions */
function addProductFromForm(e){
  if (e) e.preventDefault();
  const name = document.getElementById('p-name').value.trim();
  const price = Number(document.getElementById('p-price').value);
  const image = document.getElementById('p-image').value.trim() || 'https://via.placeholder.com/400x300?text=No+Image';
  const desc = document.getElementById('p-desc').value.trim();
  if (!name || !price) return alert('Please enter name and price');
  const products = loadProducts();
  const id = products.reduce((mx,p)=>Math.max(mx,p.id),0)+1;
  products.push({ id, name, price, image, description: desc });
  saveProducts(products);
  document.getElementById('product-form').reset();
  renderProductsList();
  alert('Product added');
}

function removeProduct(id){
  if (!confirm('Delete this product?')) return;
  let products = loadProducts();
  products = products.filter(p=>p.id!==id);
  saveProducts(products);
  renderProductsList();
}

/* Checkout (simulation) */
function checkout(){
  const cart = getCart();
  if (cart.length===0) return alert('Cart empty');
  alert('Checkout simulated. Thank you for your order!');
  clearCart();
}

function clearCart(){ localStorage.removeItem('cart'); renderCartPage(); updateCartCount(); }

/* Init */
document.addEventListener('DOMContentLoaded', ()=>{
  loadProducts();
  updateCartCount();
  renderProductsList();
  const form = document.getElementById('product-form');
  if (form) form.addEventListener('submit', addProductFromForm);
  if (document.getElementById('cart-items')) renderCartPage();
});
