/* Watch Vault — script.js
   - 10 watches (images provided)
   - signup/login via localStorage
   - cart (persisted) with qty, remove, checkout -> orders stored per user
   - product preview (100 chars) + "View Details" modal with full 350-char desc
*/

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- constants & storage keys ---------------- */
  const PRODUCTS = [
    { id: "w1", name: "Rolex Submariner", price: 8500, img: "https://content.rolex.com/dam/2022/upright-bba-with-shadow/m126610ln-0001.png", category: "Luxury",
      desc: "The Rolex Submariner is an iconic diver's watch combining Rolex heritage with modern engineering. It features a robust Oyster case, corrosion-resistant materials, and a precision automatic movement that ensures accurate timekeeping. Water-resistant design, luminescent markers for low-light visibility, and a unidirectional rotatable bezel make it both a practical tool for divers and a symbol of timeless luxury and durability." },

    { id: "w2", name: "Omega Speedmaster", price: 6200, img: "https://gharyal.com/cdn/shop/files/DARKSIDEOFTHEMOONCO_AXIALCHRONOMETERCHRONOGRAPH44.25MM_1080x.png?v=1697088377", category: "Luxury",
      desc: "The Omega Speedmaster is famous for its Moonwatch legacy, offering heritage, precision, and rugged performance. Powered by a reliable mechanical movement, it delivers excellent chronograph functionality and high readability. Its classic design, tachymeter bezel, and comfortable strap make it ideal for collectors and professionals seeking a watch with historical pedigree and practical features for timing and daily wear." },

    { id: "w3", name: "TAG Heuer Carrera", price: 4800, img: "https://www.tagheuer.com/on/demandware.static/-/Sites-tagheuer-master/default/dw46ec1c59/TAG_Heuer_Carrera/CBS2210.FC6534/CBS2210.FC6534_0913.png", category: "Luxury",
      desc: "The TAG Heuer Carrera blends motorsport heritage with contemporary craftsmanship. Designed for professional timing, it offers a precise chronograph movement, a clean legible dial, and a robust case design. Featuring scratch-resistant crystal and refined finishing, this Carrera is engineered for performance and everyday elegance—an excellent choice for those who value speed-inspired design and reliable timekeeping." },

    { id: "w4", name: "Seiko Presage Automatic", price: 750, img: "https://shop.seikoboutique.com.ph/cdn/shop/files/SPB417J1_900x.webp?v=1748496333", category: "Classic",
      desc: "Seiko Presage Automatic watches combine Japanese craftsmanship with mechanical precision, offering refined dial textures and well-balanced design. Equipped with a dependable automatic movement, they deliver lasting accuracy and a premium feel at a reasonable price point. With classic styling, comfortable wear, and durable finishing, Presage models are perfect for watch enthusiasts seeking quality mechanics and traditional aesthetic." },

    { id: "w5", name: "Casio G-Shock", price: 150, img: "https://m.media-amazon.com/images/I/61DRMUJXnoL._AC_SL1000_.jpg", category: "Sport",
      desc: "Casio G-Shock is built to last—from shock resistance to water resistance and rugged design, it’s a go-to for active lifestyles. These digital/analog hybrids include stopwatch, alarm, and world-time features with impressive battery life. Lightweight yet tough, G-Shock models are ideal for sports, outdoors, and anyone who needs a dependable timepiece for rough use and everyday convenience." },

    { id: "w6", name: "Audemars Piguet Royal Oak", price: 22000, img: "https://www.horando.de/cdn/shop/files/Bildschirm_foto_2024-07-08_um_11.11.47-removebg.png?v=1720429949&width=900", category: "Luxury",
      desc: "Audemars Piguet Royal Oak is a haute horlogerie statement with its distinctive octagonal bezel, 'Tapisserie' dial, and exceptional finishing. Crafted for collectors, it houses a sophisticated automatic movement and showcases outstanding attention to detail. Combining sporty elegance with unparalleled craftsmanship, the Royal Oak remains an icon of prestige and mechanical excellence prized by connoisseurs worldwide." },

    { id: "w7", name: "Patek Philippe Nautilus", price: 30000, img: "https://www.keanes.ie/cdn/shop/files/4942016.png?v=1748346976", category: "Luxury",
      desc: "The Patek Philippe Nautilus blends luxury with sporty refinement; its unique porthole case and integrated bracelet present timeless style. Driven by a consistently high-quality mechanical movement, Nautilus models deliver superb finishing and heritage appeal. Collectors prize the Nautilus for its elegance, auction-grade reputation, and beautifully executed design that stands out in haute horology." },

    { id: "w8", name: "Breitling Navitimer", price: 5500, img: "https://www.reeds.com/media/catalog/product/cache/38c3c1b8e53ef11aa9803a5390245afc/b/r/breitling_navitimer_b01_chronograph_46_black_dial_black_leather_strap_watch__ab0137211b1p1-1-20246328-hx603fb16a.jpg", category: "Aviation",
      desc: "Breitling Navitimer is an aviator's classic with a slide-rule bezel and chronograph functions that support in-flight calculations. Its robust mechanical movement, high-contrast dial, and distinctive styling make it a top choice for pilots and enthusiasts. Combining technical utility with refined design, the Navitimer is a professional-grade timepiece that celebrates aviation heritage and precision engineering." },

    { id: "w9", name: "Cartier Santos", price: 7000, img: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.swisswatchglobal.com%2Fproduct%2Fcartier%2Fsantos-de-cartier-watch-wssa0061%2F&psig=AOvVaw2npGp1HkwI0ZkP6OtDid_U&ust=1757436461429000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMDe6JHPyY8DFQAAAAAdAAAAABBF", category: "Luxury",
      desc: "The Cartier Santos offers iconic elegant design with square case geometry, polished bezels, and refined bracelet options. Built with premium materials and meticulous finishing, it blends dress sophistication with everyday functionality. A Cartier watch is an expression of style and heritage—Santos models present a harmony of comfort, visual identity, and luxury watchmaking tradition." },

    { id: "w10", name: "Tissot Gentleman Powermatic 80", price: 850, img: "https://rocks.ie/cdn/shop/products/02-25745.jpg?v=1696865889", category: "Classic",
      desc: "Tissot Gentleman Powermatic 80 brings Swiss automatic movement with impressive 80-hour power reserve, balanced design, and excellent value. With refined finishing, a comfortable bracelet or strap, and versatile styling, it’s perfect as a daily-wear mechanical watch. Tissot offers classic looks paired with modern reliability, appealing to first-time collectors and seasoned wearers alike." }
  ];

  const STORAGE = { USERS: 'wv_users', LOGGED: 'wv_logged', CART: 'wv_cart', ORDERS: 'wv_orders' };

  /* ---------------- load state ---------------- */
  let users = JSON.parse(localStorage.getItem(STORAGE.USERS)) || [];
  let loggedUser = JSON.parse(localStorage.getItem(STORAGE.LOGGED)) || null;
  let cart = JSON.parse(localStorage.getItem(STORAGE.CART)) || [];
  let orders = JSON.parse(localStorage.getItem(STORAGE.ORDERS)) || [];

  /* ---------------- element refs ---------------- */
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
  const detailsModal = document.getElementById('detailsModal');

  // signup inputs
  const signName = document.getElementById('signName');
  const signEmail = document.getElementById('signEmail');
  const signPassword = document.getElementById('signPassword');
  const signSubmit = document.getElementById('signSubmit');

  // login inputs
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginSubmit = document.getElementById('loginSubmit');

  // cart/order refs
  const cartSection = document.getElementById('cartSection');
  const cartList = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');
  const paymentMethod = document.getElementById('paymentMethod');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const ordersSection = document.getElementById('ordersSection');
  const ordersList = document.getElementById('ordersList');

  /* ---------------- helpers ---------------- */
  const money = v => Number(v).toFixed(2);
  const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  function setLogged(user) {
    loggedUser = user;
    if (user) localStorage.setItem(STORAGE.LOGGED, JSON.stringify(user));
    else localStorage.removeItem(STORAGE.LOGGED);
    renderNav();
  }

  function renderNav() {
    welcomeMsg.textContent = loggedUser ? `Welcome, ${loggedUser.name}` : '';
    btnLogin.style.display = loggedUser ? 'none' : '';
    btnSignup.style.display = loggedUser ? 'none' : '';
    btnLogout.style.display = loggedUser ? '' : 'none';
    renderCartCount();
  }

  function renderCartCount() {
    cartCount.textContent = cart.reduce((s,i)=>s+(i.qty||0),0);
  }

  /* ---------------- products rendering ---------------- */
  function renderCategories() {
    const cats = Array.from(new Set(PRODUCTS.map(p=>p.category)));
    categorySelect.innerHTML = ['All', ...cats].map(c => `<option value="${c}">${c}</option>`).join('');
  }

  function renderProducts(filter='', category='All') {
    productsSection.innerHTML = '';
    const list = PRODUCTS.filter(p => {
      const matchName = p.name.toLowerCase().includes(filter.toLowerCase());
      const matchCat = (category === 'All') || p.category === category;
      return matchName && matchCat;
    });
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product';
      const short = p.desc.length > 100 ? p.desc.slice(0,100) + '...' : p.desc;
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <h4>${p.name}</h4>
        <p class="price">$${money(p.price)}</p>
        <p class="preview">${escapeHtml(short)}</p>
        <div class="btn-row">
          <button class="btn add-btn" data-id="${p.id}">Add to cart</button>
          <button class="btn small" data-details="${p.id}">View Details</button>
        </div>
      `;
      productsSection.appendChild(card);
    });
  }

  function escapeHtml(s='') {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  /* ---------------- cart operations ---------------- */
  function addToCart(productId, qty=1) {
    if (!loggedUser) { alert('Please login to add items to cart.'); return; }
    const p = PRODUCTS.find(x=>x.id===productId);
    if (!p) return;
    const existing = cart.find(i=>i.id===productId);
    if (existing) existing.qty += qty;
    else cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty });
    save(STORAGE.CART, cart);
    renderCartCount();
    if (!cartSection.hidden) renderCart();
  }

  function changeQty(idx, delta) {
    if (!cart[idx]) return;
    cart[idx].qty = Math.max(1, cart[idx].qty + delta);
    save(STORAGE.CART, cart);
    renderCart();
    renderCartCount();
  }

  function removeFromCart(idx) {
    if (idx<0 || idx>=cart.length) return;
    cart.splice(idx,1);
    save(STORAGE.CART, cart);
    renderCart();
    renderCartCount();
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
        <img src="${it.img}" alt="${it.name}">
        <div style="flex:1">
          <div><strong>${escapeHtml(it.name)}</strong></div>
          <div>$${money(it.price)} × ${it.qty} = $${money(it.price*it.qty)}</div>
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

  /* ---------------- orders ---------------- */
  function renderOrders() {
    ordersList.innerHTML = '';
    if (!loggedUser) { ordersList.innerHTML = '<p>Please login to view your orders.</p>'; return; }
    const userOrders = orders.filter(o=>o.userEmail === loggedUser.email);
    if (!userOrders.length) { ordersList.innerHTML = '<p>No orders placed yet.</p>'; return; }
    userOrders.forEach((o, i) => {
      const d = document.createElement('div');
      d.className = 'panel';
      d.innerHTML = `
        <strong>Order #${i+1}</strong>
        <div>Order date: ${escapeHtml(o.orderDate)}</div>
        <div>Estimated delivery: ${escapeHtml(o.deliveryDate)}</div>
        <div>Payment: ${escapeHtml(o.payment)}</div>
        <div>Total: $${money(o.total)}</div>
        <ul>${o.items.map(it=>`<li>${escapeHtml(it.name)} x${it.qty} — $${money(it.price*it.qty)}</li>`).join('')}</ul>
      `;
      ordersList.appendChild(d);
    });
  }

  /* ---------------- events ---------------- */
  // product delegation: add-to-cart & view details
  productsSection.addEventListener('click', (e) => {
    const add = e.target.closest('.add-btn');
    if (add) { addToCart(add.dataset.id); return; }
    const det = e.target.closest('[data-details]');
    if (det) { showDetails(det.dataset.details); return; }
  });

  // cart list actions
  cartList.addEventListener('click', (e) => {
    const dec = e.target.closest('button.dec');
    const inc = e.target.closest('button.inc');
    const rem = e.target.closest('button.remove');
    if (dec) changeQty(Number(dec.dataset.idx), -1);
    if (inc) changeQty(Number(inc.dataset.idx), +1);
    if (rem) removeFromCart(Number(rem.dataset.idx));
  });

  // nav buttons
  btnCart.addEventListener('click', () => showPanel(cartSection));
  btnOrders.addEventListener('click', () => { if (!loggedUser) { alert('Please login to view orders.'); return; } showPanel(ordersSection); });
  btnSignup.addEventListener('click', () => openModal(signupModal));
  btnLogin.addEventListener('click', () => openModal(loginModal));
  document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeModals));
  btnLogout.addEventListener('click', () => { setLogged(null); alert('Logged out'); showPanel(productsSection); });

  // signup & login
  signSubmit.addEventListener('click', () => {
    const name = signName.value.trim();
    const email = signEmail.value.trim().toLowerCase();
    const pw = signPassword.value;
    if (!name||!email||!pw) { alert('Fill all fields'); return; }
    if (users.some(u=>u.email===email)) { alert('Email already registered'); return; }
    const newUser = { name, email, password: pw };
    users.push(newUser);
    save(STORAGE.USERS, users);
    alert('Account created — please login');
    closeModals();
    signName.value = signEmail.value = signPassword.value = '';
  });

  loginSubmit.addEventListener('click', () => {
    const email = loginEmail.value.trim().toLowerCase();
    const pw = loginPassword.value;
    const user = users.find(u=>u.email===email && u.password===pw);
    if (!user) { alert('Invalid credentials'); return; }
    setLogged(user);
    closeModals();
    loginEmail.value = loginPassword.value = '';
    renderCart(); // update cart view if visible
  });

  // checkout
  checkoutBtn.addEventListener('click', () => {
    if (!loggedUser) { alert('Please login to place order.'); return; }
    if (!cart.length) { alert('Cart is empty'); return; }
    const now = new Date();
    const delivery = new Date(); delivery.setDate(now.getDate() + 5);
    const order = {
      userEmail: loggedUser.email,
      items: cart.map(i=>({ id:i.id, name:i.name, price:i.price, qty:i.qty })),
      total: cart.reduce((s,i)=>s + i.price * i.qty, 0),
      payment: paymentMethod.value,
      orderDate: now.toLocaleString(),
      deliveryDate: delivery.toLocaleDateString()
    };
    orders.push(order);
    save(STORAGE.ORDERS, orders);
    cart = []; save(STORAGE.CART, cart);
    renderCart();
    renderOrders();
    alert('Order placed successfully!');
    showPanel(ordersSection);
  });

  // search & category
  searchInput.addEventListener('input', () => renderProducts(searchInput.value, categorySelect.value));
  categorySelect.addEventListener('change', () => renderProducts(searchInput.value, categorySelect.value));

  /* ---------------- modal helpers ---------------- */
  function openModal(modal) { modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); modal.style.display='flex'; }
  function closeModals() { document.querySelectorAll('.modal').forEach(m=>{ m.classList.remove('open'); m.style.display='none'; m.setAttribute('aria-hidden','true'); }); }
  function showDetails(productId) {
    const p = PRODUCTS.find(x=>x.id===productId); if(!p) return;
    const content = document.getElementById('detailsContent') || document.createElement('div');
    content.id = 'detailsContent';
    content.innerHTML = `
      <img src="${p.img}" alt="${escapeHtml(p.name)}" style="max-width:100%;height:260px;object-fit:contain;margin-bottom:12px">
      <h3>${escapeHtml(p.name)}</h3>
      <p style="white-space:pre-wrap">${escapeHtml(p.desc)}</p>
      <p style="font-weight:700;margin-top:8px">Price: $${money(p.price)}</p>
      <div style="margin-top:10px"><button class="btn primary" id="detailAdd">Add to cart</button></div>
    `;
    // attach content into modal
    const inner = detailsModal.querySelector('.details-inner') || detailsModal.querySelector('.modal-inner');
    inner.querySelector('#detailsContent')?.remove();
    inner.appendChild(content);
    openModal(detailsModal);
    // add handler
    document.getElementById('detailAdd').onclick = () => { addToCart(p.id); closeModals(); };
  }

  /* ---------------- panel helpers ---------------- */
  function showPanel(panel) {
    [productsSection, cartSection, ordersSection].forEach(s => s.hidden = true);
    panel.hidden = false;
    if (panel === cartSection) renderCart();
    if (panel === ordersSection) renderOrders();
  }

  /* ---------------- init ---------------- */
  function init() {
    renderCategories();
    renderProducts();
    renderNav();
    renderCartCount();
    showPanel(productsSection);
  }

  init();
});
