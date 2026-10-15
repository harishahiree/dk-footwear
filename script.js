// DK Footwear demo storefront. Edit product names, prices and images in this file.
const WHATSAPP_NUMBER = "918169390120"; // India country code 91 + your 10-digit number

const PRODUCTS = [
  {id:1,name:"Classic Sneakers",category:"Sneakers",price:999,tag:"BESTSELLER",description:"An easy everyday favourite.",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Street Runner",category:"Sneakers",price:1299,tag:"NEW",description:"Sport-inspired, made for the city.",image:"https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Everyday Casuals",category:"Casual",price:799,tag:"EASY WEAR",description:"Relaxed style for daily plans.",image:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Urban High Tops",category:"Sneakers",price:1499,tag:"CITY EDIT",description:"A bold silhouette with attitude.",image:"https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Classic Formal",category:"Formal",price:1599,tag:"SMART STYLE",description:"A polished look for occasions.",image:"https://images.unsplash.com/photo-1614252369475-531bdoors9e?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Weekend Slides",category:"Sandals",price:499,tag:"LIGHTWEIGHT",description:"Simple comfort for off-duty days.",image:"https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Minimal Low Tops",category:"Casual",price:899,tag:"VERSATILE",description:"Clean lines that pair with anything.",image:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Office Lace-Ups",category:"Formal",price:1799,tag:"TIMELESS",description:"A smart choice for work and events.",image:"https://images.unsplash.com/photo-1614252369475-531bdoors9e?auto=format&fit=crop&w=700&q=80"}
];

const money = amount => "₹" + amount.toLocaleString("en-IN");
const getCart = () => { try { return JSON.parse(localStorage.getItem("dkFootwearCart") || "{}"); } catch { return {}; } };
const saveCart = cart => { try { localStorage.setItem("dkFootwearCart", JSON.stringify(cart)); } catch {} };
let cart = getCart();
let activeCategory = "All";

function productCard(product) {
  return `<article class="product-card">
    <div class="product-image-wrap">
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x600/24211b/d6b36a?text=DK+Footwear'">
      <span class="product-tag">${product.tag}</span>
    </div>
    <div class="product-info">
      <span class="product-category">${product.category}</span>
      <h3>${product.name}</h3><p class="product-desc">${product.description}</p>
      <div class="product-bottom"><div class="product-price">${money(product.price)}<small>Indicative price</small></div>
      <button class="add-button" data-add="${product.id}">+ Add to bag</button></div>
    </div>
  </article>`;
}

function renderFeatured() {
  const target = document.querySelector("[data-featured-products]");
  if (target) target.innerHTML = PRODUCTS.slice(0, 4).map(productCard).join("");
}

function renderCollection() {
  const target = document.querySelector("[data-all-products]");
  if (!target) return;
  const search = (document.querySelector("#product-search")?.value || "").trim().toLowerCase();
  const sort = document.querySelector("#product-sort")?.value || "featured";
  let list = PRODUCTS.filter(p => (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)));
  if (sort === "low") list.sort((a,b) => a.price-b.price);
  if (sort === "high") list.sort((a,b) => b.price-a.price);
  target.innerHTML = list.map(productCard).join("");
  const count = document.querySelector("[data-result-count]");
  if (count) count.textContent = list.length;
  const empty = document.querySelector("[data-empty-state]");
  if (empty) empty.hidden = list.length !== 0;
}

function renderCart() {
  const count = Object.values(cart).reduce((sum,qty) => sum + qty, 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
  const target = document.querySelector("[data-cart-items]");
  if (target) {
    const entries = PRODUCTS.filter(p => cart[p.id]);
    target.innerHTML = entries.length ? entries.map(p => `<div class="cart-item"><div><b>${p.name}</b><br><small>${money(p.price)} × ${cart[p.id]}</small></div><div><b>${money(p.price*cart[p.id])}</b><br><button data-remove="${p.id}">Remove</button></div></div>`).join("") : '<p class="muted small">Your bag is empty. Add a pair to get started.</p>';
  }
  const total = PRODUCTS.reduce((sum,p) => sum + p.price*(cart[p.id] || 0), 0);
  const totalEl = document.querySelector("[data-cart-total]");
  if (totalEl) totalEl.textContent = money(total);
  saveCart(cart);
}

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) {
    const id = Number(add.dataset.add);
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
    const original = add.textContent;
    add.textContent = "Added ✓";
    setTimeout(() => { if (add.isConnected) add.textContent = original; }, 900);
  }
  const remove = event.target.closest("[data-remove]");
  if (remove) { delete cart[Number(remove.dataset.remove)]; renderCart(); }
  const category = event.target.closest("[data-category]");
  if (category) {
    activeCategory = category.dataset.category;
    document.querySelectorAll("[data-category]").forEach(btn => btn.classList.toggle("active", btn === category));
    renderCollection();
  }
  if (event.target.closest("[data-checkout]")) {
    const entries = PRODUCTS.filter(p => cart[p.id]);
    if (!entries.length) { alert("Your bag is empty. Add a product first."); return; }
    const lines = entries.map(p => `• ${p.name} — ${cart[p.id]} × ${money(p.price)} = ${money(p.price*cart[p.id])}`);
    const total = PRODUCTS.reduce((sum,p) => sum + p.price*(cart[p.id] || 0), 0);
    openWhatsApp(`Hello DK Footwear! I'd like to enquire about this order:\n\n${lines.join("\n")}\n\nEstimated total: ${money(total)}\nPlease confirm availability, sizes and final price.`);
  }
  const menu = event.target.closest(".menu-toggle");
  if (menu) {
    const nav = document.querySelector(".nav-links");
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  }
});

document.querySelector("#product-search")?.addEventListener("input", renderCollection);
document.querySelector("#product-sort")?.addEventListener("change", renderCollection);
document.querySelectorAll("[data-whatsapp-link]").forEach(link => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello DK Footwear! I have a question about your collection.")}`;
});
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
renderFeatured();
renderCollection();
renderCart();
