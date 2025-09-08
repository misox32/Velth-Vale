/* eslint-disable no-console */
/*
  Fully functional frontend-only store
  - Uses localStorage for users, cart, orders
  - Signup/Login modals
  - Products listing, search, category filter
  - Cart with qty & remove, checkout saves orders with date & delivery
*/

document.addEventListener('DOMContentLoaded', () => {
  /***** Data & keys ******/
  const PRODUCTS = [
    { id: "p1", name: "iPhone 17", price: 500, img: "https://www.mygsm.me/media/catalog/product/cache/cd27a0d6f4197d1b7e37983dff472110/image/2528207d6/apple-iphone-17-pro-256gb-dual-sim-2-nano-sim-cards.webp", category: "Electronics" },
    { id: "p2", name: "MacBook", price: 200, img: "https://m.media-amazon.com/images/I/71jG+e7roXL._UF1000,1000_QL80_.jpg", category: "Electronics" },
    { id: "p3", name: "Rolex Watch", price: 1400, img: "https://loto.pk/cdn/shop/files/2ed9cc5d-83eb-45f6-ad66-02dbd7eba259_958x.jpg?v=1735726986", category: "Fashion" },
    { id: "p4", name: "Desktop PC", price: 399, img: "https://dlcdnrog.asus.com/rog/media/1739408156130.webp", category: "Electronics" },
    { id: "p5", name: "Fashion Sneakers", price: 90, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsHP4cmfIYKmYNyKo-4DVetI0FMsML78fLbg&s", category: "Fashion" },
  ];

  const STORAGE = {
    USERS: 'vv_users',
    LOGGED: 'vv_logged',
    CART: 'vv_cart',
    ORDERS: 'vv_orders'
  };

  /***** App state (from storage) *****/
  let users = JSON.parse(localStorage.getItem(STORAGE.USERS)) || [];
  let loggedUser = JSON.parse(localStorage.getItem(STORAGE.LOGGED)) || null;
  let cart = JSON.parse(localStorage.getItem(STORAGE.CART)) || [];
  let orders = JSON.parse(localStorage.getItem(STORAGE.ORDERS)) || [];

  /***** DOM refs *****/
  const productsSection = document.getElementById('productsSection');
  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categorySelect');

  const btnSignup = document.getElementById('btnSignup');
  const btnLogin = document.getElementById('btnLogin');
  const btnCart = document.getElementById('btnCart');
  const btnOrders = document.getElementById('btnOrders');
  const btnLogout = document.getElementById('btnLogout');
  const welcomeMsg = document.getElementById('welcomeMsg');
  const cartCount = document.getElementById('cartCount');

  const signupModal = document.getElementById('signupModal');
  const loginModal = document.getElementById('loginModal');

  const signName = document.getElementById('signName');
  const signEmail = document.getElementById('signEmail');
  const signPassword = document.getElementById('signPassword');
  const signSubmit = document.getElementById('signSubmit');

  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginSubmit = document.getElementById('loginSubmit');

  const cartSection = document.getElementById('cartSection');
  const cartList = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const paymentMethod = document.getElementById('paymentMethod');

  const ordersSection = document.getElementById('ordersSection');
  const ordersList = document.getElementById('ordersList');

  /***** Helpers *****/
  const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));
  const money = v => Number(v).toFixed(2);

  function setLogged(user) {
    loggedUser = user;
    if (user) localStorage.setItem(STORAGE.LOGGED, JSON.stringify(user));
    else localStorage.removeItem(STORAGE.LOGGED);
    renderNav();
  }

  function addToCart(productId, qty = 1) {
    if (!loggedUser) { alert('Please login to add items to cart.'); return; }
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    const existing = cart.find(i => i.id === productId);
    if (existing) existing.qty += qty;
    else cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty });
    save(STORAGE.CART, cart);
    renderCartCount();
    if (isPanelVisible(cartSection) ) renderCart();
  }

  function removeFromCart(idx) {
    if (idx < 0 || idx >= cart.length) return;
    cart.splice(idx, 1);
    save(STORAGE.CART, cart);
    renderCart();
    renderCartCount();
  }

  function changeQty(idx, delta) {
    const item = cart[idx];
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    save(STORAGE.CART, cart);
    renderCart();
    renderCartCount();
  }

  function isPanelVisible(panel) {
    return !panel.hasAttribute('hidden');
  }

  function showPanel(panel) {
    // hide all main panels, then show requested
    [productsSection, cartSection, ordersSection].forEach(s => s.hidden = true);
    panel.hidden = false;
    if (panel === cartSection) renderCart();
    if (panel === ordersSection) renderOrders();
  }

  /***** Rendering functions *****/
  function renderProducts(filter = '', category = 'All') {
    productsSection.innerHTML = '';
    const list = PRODUCTS.filter(p => {
      const matchText = p.name.toLowerCase().includes(filter.toLowerCase());
      const matchCat = (category === 'All' || p.category === category);
      return matchText && matchCat;
    });
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product';
      card.innerHTML = `
        <img loading="lazy" src="${p.img}" alt="${escapeHtml(p.name)}" />
        <h4>${escapeHtml(p.name)}</h4>
        <p class="price">$${money(p.price)}</p>
        <div>
          <button data-id="${p.id}" class="btn add-btn">Add to cart</button>
        </div>
      `;
      productsSection.appendChild(card);
    });
  }

  function renderCategories() {
    const cats = Array.from(new Set(PRODUCTS.map(p => p.category)));
    // Clear & add All
    categorySelect.innerHTML = '<option value="All">All categories</option>' +
      cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  }

  function renderNav() {
    // update welcome text and show/hide login/signup/logout
    welcomeMsg.textContent = loggedUser ? `Welcome, ${loggedUser.name}` : '';
    btnLogin.style.display = loggedUser ? 'none' : '';
    btnSignup.style.display = loggedUser ? 'none' : '';
    btnLogout.style.display = loggedUser ? '' : 'none';
    renderCartCount();
  }

  function renderCartCount() {
    const count = cart.reduce((s, i) => s + (i.qty || 0), 0);
    cartCount.textContent = count;
  }

  function renderCart() {
    cartList.innerHTML = '';
    if (!cart.length) {
      cartList.innerHTML = '<li>Your cart is empty.</li>';
      cartTotal.textContent = '0.00';
      return;
    }
    let total = 0;
    cart.forEach((it, idx) => {
      total += it.price * it.qty;
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <img src="${it.img}" alt="${escapeHtml(it.name)}" />
        <div style="flex:1">
          <div><strong>${escapeHtml(it.name)}</strong></div>
          <div>$${money(it.price)} &times; ${it.qty} = $${money(it.price * it.qty)}</div>
        </div>
        <div class="qty-controls">
          <button class="small-btn dec" data-idx="${idx}">-</button>
          <button class="small-btn inc" data-idx="${idx}">+</button>
          <button class="small-btn remove" data-idx="${idx}">Remove</button>
        </div>
      `;
      cartList.appendChild(li);
    });
    cartTotal.textContent = money(total);
  }

  function renderOrders() {
    ordersList.innerHTML = '';
    if (!loggedUser) { ordersList.innerHTML = '<p>Please login to view your orders.</p>'; return; }
    const userOrders = orders.filter(o => o.userEmail === loggedUser.email);
    if (!userOrders.length) { ordersList.innerHTML = '<p>No orders placed yet.</p>'; return; }
    userOrders.forEach((o, idx) => {
      const d = document.createElement('div');
      d.className = 'panel';
      d.innerHTML = `
        <strong>Order #${idx + 1}</strong>
        <div>Order date: ${escapeHtml(o.orderDate)}</div>
        <div>Estimated delivery: ${escapeHtml(o.deliveryDate)}</div>
        <div>Payment: ${escapeHtml(o.payment)}</div>
        <div>Total: $${money(o.total)}</div>
        <ul>${o.items.map(it => `<li>${escapeHtml(it.name)} x${it.qty} — $${money(it.price * it.qty)}</li>`).join('')}</ul>
      `;
      ordersList.appendChild(d);
    });
  }

  /***** Small utilities *****/
  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  /***** Wire up events *****/
  // Add to cart (event delegation)
  productsSection.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    addToCart(id, 1);
  });

  // Cart controls (inc/dec/remove)
  cartList.addEventListener('click', (e) => {
    const dec = e.target.closest('button.dec');
    const inc = e.target.closest('button.inc');
    const rem = e.target.closest('button.remove');
    if (dec) changeQty(Number(dec.dataset.idx), -1);
    if (inc) changeQty(Number(inc.dataset.idx), +1);
    if (rem) removeFromCart(Number(rem.dataset.idx));
  });

  // Panels
  btnCart.addEventListener('click', () => showPanel(cartSection));
  btnOrders.addEventListener('click', () => {
    if (!loggedUser) { alert('Please login to view orders.'); return; }
    showPanel(ordersSection);
  });

  // Signup/login open modals
  btnSignup.addEventListener('click', () => openModal(signupModal));
  btnLogin.addEventListener('click', () => openModal(loginModal));
  // modal close buttons
  document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeModal));

  // Signup
  signSubmit.addEventListener('click', () => {
    const name = signName.value.trim();
    const email = signEmail.value.trim().toLowerCase();
    const password = signPassword.value;
    if (!name || !email || !password) { alert('Fill all fields'); return; }
    if (users.some(u => u.email === email)) { alert('Email already registered'); return; }
    const newUser = { name, email, password };
    users.push(newUser);
    save(STORAGE.USERS, users);
    alert('Account created. Please login.');
    closeModal();
    signName.value = signEmail.value = signPassword.value = '';
  });

  // Login
  loginSubmit.addEventListener('click', () => {
    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) { alert('Invalid credentials'); return; }
    setLogged(user);
    closeModal();
    loginEmail.value = loginPassword.value = '';
    // when logging in, refresh panels as needed
    renderCart();
  });

  btnLogout.addEventListener('click', () => {
    setLogged(null);
    alert('Logged out');
    showPanel(productsSection);
  });

  // Checkout
  checkoutBtn.addEventListener('click', () => {
    if (!loggedUser) { alert('Please login to place order.'); return; }
    if (!cart.length) { alert('Cart is empty'); return; }

    const orderDate = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(orderDate.getDate() + 5); // 5 days estimate

    const order = {
      userEmail: loggedUser.email,
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
      payment: paymentMethod.value,
      orderDate: orderDate.toLocaleString(),
      deliveryDate: deliveryDate.toLocaleDateString()
    };

    orders.push(order);
    save(STORAGE.ORDERS, orders);
    cart = [];
    save(STORAGE.CART, cart);
    renderCart();
    renderOrders();
    alert('Order placed successfully!');
    showPanel(ordersSection);
  });

  // Search & category
  searchInput.addEventListener('input', () => {
    renderProducts(searchInput.value, categorySelect.value);
  });
  categorySelect.addEventListener('change', () => {
    renderProducts(searchInput.value, categorySelect.value);
  });

  /***** Modal helpers *****/
  function openModal(modal) {
    modal.setAttribute('open', '');
    modal.classList.add('open');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    document.querySelectorAll('.modal').forEach(m => {
      m.removeAttribute('open'); m.style.display = 'none'; m.setAttribute('aria-hidden', 'true'); m.classList.remove('open');
    });
  }

  /***** Initialize UI *****/
  function init() {
    renderCategories();
    renderProducts();
    renderNav();
    renderCartCount();
    // Initially show products panel
    showPanel(productsSection);
  }

  // categories
  function renderCategories() {
    const cats = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
    categorySelect.innerHTML = cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  }

  // initial save helper
  // expose changeQty and removeFromCart to closure scope used by handlers
  function changeQty(idx, delta) { if (!cart[idx]) return; cart[idx].qty = Math.max(1, cart[idx].qty + delta); save(STORAGE.CART, cart); renderCart(); renderCartCount(); }
  function removeFromCart(idx) { if (idx < 0 || idx >= cart.length) return; cart.splice(idx, 1); save(STORAGE.CART, cart); renderCart(); renderCartCount(); }

  // run initialization
  init();
});