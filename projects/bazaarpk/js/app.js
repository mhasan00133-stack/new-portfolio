/**
 * BazaarPK — Core Application Engine (app.js)
 * 100% Working Interactive Pakistani E-Commerce Platform
 * Cart, Wishlist, Flash Sale Timer, Search, Filters, Quick View,
 * Cash on Delivery (COD) Checkout & Order Tracking.
 */

(function () {
  'use strict';

  // ═════════════════════════════════════════════════════════════════════════
  // 1. STATE & STORAGE CONTROLLER
  // ═════════════════════════════════════════════════════════════════════════
  const STORAGE_KEYS = {
    CART: 'bazaarpk_cart_v1',
    WISHLIST: 'bazaarpk_wishlist_v1',
    COUPON: 'bazaarpk_coupon_v1',
    ORDERS: 'bazaarpk_orders_v1'
  };

  const VALID_COUPONS = {
    'DARAZ10': { type: 'percent', value: 10, label: '10% OFF Sitewide' },
    'BAZAAR15': { type: 'percent', value: 15, label: '15% Mega Bachat Discount' },
    'FREESHIP': { type: 'shipping', value: 199, label: 'Free Delivery' },
    'WELCOME': { type: 'flat', value: 300, label: 'Rs. 300 Welcome Voucher' }
  };

  let state = {
    cart: loadFromStorage(STORAGE_KEYS.CART, [
      { id: 1, quantity: 1 },
      { id: 3, quantity: 1 }
    ]),
    wishlist: loadFromStorage(STORAGE_KEYS.WISHLIST, [2, 7]),
    appliedCoupon: loadFromStorage(STORAGE_KEYS.COUPON, null),
    orders: loadFromStorage(STORAGE_KEYS.ORDERS, []),
    category: 'all',
    searchQuery: '',
    sortBy: 'popular',
    maxPrice: 35000,
    quickViewProduct: null,
    activeOrderTracking: null
  };

  function loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  }

  // Currency Formatter for Pakistani Rupee (PKR)
  function formatPKR(amount) {
    return 'Rs. ' + Math.round(amount).toLocaleString('en-PK');
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 2. FLASH SALE COUNTDOWN TIMER
  // ═════════════════════════════════════════════════════════════════════════
  function initFlashSaleTimer() {
    const hoursEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-minutes');
    const secsEl = document.getElementById('timer-seconds');
    if (!hoursEl || !minsEl || !secsEl) return;

    // Set end time 10 hours from now
    let remainingSeconds = 10 * 3600 + 42 * 60 + 18;

    function tick() {
      if (remainingSeconds <= 0) {
        remainingSeconds = 12 * 3600; // Reset loop
      }
      remainingSeconds--;

      const h = Math.floor(remainingSeconds / 3600);
      const m = Math.floor((remainingSeconds % 3600) / 60);
      const s = remainingSeconds % 60;

      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    }

    tick();
    setInterval(tick, 1000);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 3. PRODUCT CATALOG RENDERING & FILTERING
  // ═════════════════════════════════════════════════════════════════════════
  function getFilteredProducts() {
    return BAZAAR_PRODUCTS.filter((product) => {
      // Category match
      if (state.category !== 'all' && product.category !== state.category) {
        return false;
      }
      // Price limit
      if (product.price > state.maxPrice) {
        return false;
      }
      // Search query
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase().trim();
        const inName = product.name.toLowerCase().includes(query);
        const inBrand = product.brand.toLowerCase().includes(query);
        const inCat = product.categoryName.toLowerCase().includes(query);
        const inDesc = product.description.toLowerCase().includes(query);
        if (!inName && !inBrand && !inCat && !inDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      switch (state.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'discount':
          return b.discount - a.discount;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
        default:
          return b.sold - a.sold;
      }
    });
  }

  function renderCatalog() {
    const grid = document.getElementById('products-grid');
    const resultCountEl = document.getElementById('catalog-count');
    if (!grid) return;

    const products = getFilteredProducts();

    if (resultCountEl) {
      resultCountEl.textContent = `Showing ${products.length} of ${BAZAAR_PRODUCTS.length} products`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog-state">
          <div class="empty-icon-box">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3>No products match your search criteria</h3>
          <p>Try adjusting your category filter, price slider, or search keywords.</p>
          <button id="btn-reset-filters" class="btn btn-primary" style="margin-top: 1rem;">
            <i class="fa-solid fa-rotate-left"></i> Reset All Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          resetAllFilters();
        });
      }
      return;
    }

    grid.innerHTML = products.map((product) => createProductCardHTML(product)).join('');
  }

  function renderFlashSaleSection() {
    const flashGrid = document.getElementById('flash-sale-grid');
    if (!flashGrid) return;

    const flashProducts = BAZAAR_PRODUCTS.filter((p) => p.isFlashSale);
    flashGrid.innerHTML = flashProducts.map((p) => createProductCardHTML(p, true)).join('');
  }

  function createProductCardHTML(product, isFlash = false) {
    const isWishlisted = state.wishlist.includes(product.id);
    const stockPercentage = Math.round((product.sold / (product.sold + product.stock)) * 100);

    return `
      <article class="bazaar-card ${isFlash ? 'flash-card' : ''}" data-product-id="${product.id}">
        <!-- Card Top Badges -->
        <div class="card-badges-row">
          <span class="discount-pill">-${product.discount}% OFF</span>
          ${product.badge ? `<span class="tag-pill">${product.badge}</span>` : ''}
        </div>

        <!-- Wishlist Button -->
        <button class="btn-wishlist-toggle ${isWishlisted ? 'active' : ''}" data-action="toggle-wishlist" data-id="${product.id}" aria-label="Save ${product.name} to Wishlist">
          <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>

        <!-- Product Image Preview -->
        <div class="card-img-wrap" data-action="quick-view" data-id="${product.id}">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            loading="lazy" 
            onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';"
          />
          <div class="card-hover-overlay">
            <span class="btn-quick-preview">
              <i class="fa-solid fa-eye"></i> Quick View
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="card-info">
          <div class="brand-row">
            <span class="brand-name">${product.brand}</span>
            <span class="category-name">${product.categoryName}</span>
          </div>

          <h3 class="product-title" data-action="quick-view" data-id="${product.id}" title="${product.name}">
            ${product.name}
          </h3>

          <!-- Rating -->
          <div class="rating-row">
            <div class="stars">
              ${renderStars(product.rating)}
            </div>
            <span class="rating-val">${product.rating}</span>
            <span class="review-count">(${product.reviews})</span>
          </div>

          <!-- Price Row -->
          <div class="price-container">
            <span class="price-current">${formatPKR(product.price)}</span>
            <span class="price-original">${formatPKR(product.originalPrice)}</span>
          </div>

          <!-- Trust Badges -->
          <div class="card-trust-tags">
            <span class="trust-tag"><i class="fa-solid fa-truck-fast"></i> ${product.freeDelivery ? 'Free Delivery' : 'COD Available'}</span>
            <span class="trust-tag"><i class="fa-solid fa-shield-halved"></i> Verified</span>
          </div>

          ${isFlash ? `
            <!-- Flash Deal Stock Progress Bar -->
            <div class="stock-progress-wrap">
              <div class="stock-bar">
                <div class="stock-fill" style="width: ${stockPercentage}%"></div>
              </div>
              <div class="stock-labels">
                <span>Sold: ${product.sold}</span>
                <span class="stock-alert">Only ${product.stock} left!</span>
              </div>
            </div>
          ` : ''}

          <!-- Action Buttons -->
          <div class="card-actions-row">
            <button class="btn btn-outline-orange btn-add-cart" data-action="add-cart" data-id="${product.id}">
              <i class="fa-solid fa-cart-plus"></i> Add
            </button>
            <button class="btn btn-primary btn-buy-now" data-action="buy-now" data-id="${product.id}">
              Buy Now
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars += '<i class="fa-solid fa-star"></i>';
      } else if (rating >= i - 0.5) {
        stars += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        stars += '<i class="fa-regular fa-star"></i>';
      }
    }
    return stars;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 4. CART ENGINE (DRAWER, CALCULATIONS, VOUCHERS)
  // ═════════════════════════════════════════════════════════════════════════
  function getCartItemDetails() {
    return state.cart.map((item) => {
      const product = BAZAAR_PRODUCTS.find((p) => p.id === item.id);
      return {
        ...item,
        product: product || null
      };
    }).filter((item) => item.product !== null);
  }

  function calculateCartTotals() {
    const items = getCartItemDetails();
    const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    // Free delivery threshold: Rs. 2,999
    const isFreeDelivery = subtotal >= 2999 || (state.appliedCoupon && state.appliedCoupon.type === 'shipping');
    const deliveryFee = subtotal === 0 ? 0 : (isFreeDelivery ? 0 : 199);

    let discount = 0;
    if (state.appliedCoupon) {
      if (state.appliedCoupon.type === 'percent') {
        discount = (subtotal * state.appliedCoupon.value) / 100;
      } else if (state.appliedCoupon.type === 'flat') {
        discount = Math.min(subtotal, state.appliedCoupon.value);
      }
    }

    const total = Math.max(0, subtotal + deliveryFee - discount);

    return {
      itemsCount: items.reduce((count, item) => count + item.quantity, 0),
      subtotal,
      deliveryFee,
      discount,
      total,
      isFreeDelivery,
      freeDeliveryRemaining: Math.max(0, 2999 - subtotal)
    };
  }

  function updateCartBadge() {
    const badge = document.getElementById('cart-badge-count');
    const headerPrice = document.getElementById('cart-header-price');
    const totals = calculateCartTotals();

    if (badge) {
      badge.textContent = totals.itemsCount;
      badge.classList.toggle('pulse-pop', totals.itemsCount > 0);
    }
    if (headerPrice) {
      headerPrice.textContent = formatPKR(totals.total);
    }
  }

  function updateWishlistBadge() {
    const badge = document.getElementById('wishlist-badge-count');
    if (badge) {
      badge.textContent = state.wishlist.length;
    }
  }

  function renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-summary-subtotal');
    const shippingEl = document.getElementById('cart-summary-shipping');
    const discountRow = document.getElementById('cart-discount-row');
    const discountValEl = document.getElementById('cart-summary-discount');
    const totalEl = document.getElementById('cart-summary-total');
    const freeShipText = document.getElementById('cart-freeship-text');
    const freeShipFill = document.getElementById('cart-freeship-fill');
    const appliedCouponContainer = document.getElementById('cart-applied-coupon-box');

    if (!container) return;

    const items = getCartItemDetails();
    const totals = calculateCartTotals();

    updateCartBadge();

    // Free delivery progress bar
    if (freeShipText && freeShipFill) {
      if (totals.subtotal === 0) {
        freeShipText.innerHTML = `Add items to enjoy <strong>Free Delivery</strong> on orders above Rs. 2,999!`;
        freeShipFill.style.width = '0%';
      } else if (totals.isFreeDelivery) {
        freeShipText.innerHTML = `<i class="fa-solid fa-circle-check text-green"></i> <strong>Congratulations!</strong> You unlocked FREE Delivery across Pakistan!`;
        freeShipFill.style.width = '100%';
        freeShipFill.classList.add('bg-green');
      } else {
        freeShipText.innerHTML = `Add <strong>${formatPKR(totals.freeDeliveryRemaining)}</strong> more to get <strong>FREE Delivery</strong>!`;
        const percent = Math.min(100, Math.round((totals.subtotal / 2999) * 100));
        freeShipFill.style.width = `${percent}%`;
        freeShipFill.classList.remove('bg-green');
      }
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-cart-icon">
            <i class="fa-solid fa-basket-shopping"></i>
          </div>
          <h4>Your Shopping Cart is Empty</h4>
          <p>Explore hot deals, Khaadi lawn suits, electronics, and spices on BazaarPK.</p>
          <button class="btn btn-primary" onclick="window.BazaarPK.closeCartDrawer();">
            Start Shopping Now
          </button>
        </div>
      `;
    } else {
      container.innerHTML = items.map((item) => `
        <div class="cart-item-row" data-id="${item.product.id}">
          <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-thumb" />
          <div class="cart-item-body">
            <span class="cart-item-brand">${item.product.brand}</span>
            <h4 class="cart-item-title" title="${item.product.name}">${item.product.name}</h4>
            <div class="cart-item-price-row">
              <span class="cart-item-price">${formatPKR(item.product.price)}</span>
              <span class="cart-item-orig">${formatPKR(item.product.originalPrice)}</span>
            </div>
            <div class="cart-item-bottom">
              <div class="quantity-stepper">
                <button class="btn-qty" data-action="decrement-qty" data-id="${item.product.id}" aria-label="Decrease quantity">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="qty-num">${item.quantity}</span>
                <button class="btn-qty" data-action="increment-qty" data-id="${item.product.id}" aria-label="Increase quantity">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
              <button class="btn-remove-item" data-action="remove-cart" data-id="${item.product.id}" title="Remove Item">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Totals
    if (subtotalEl) subtotalEl.textContent = formatPKR(totals.subtotal);
    if (shippingEl) {
      shippingEl.innerHTML = totals.deliveryFee === 0 
        ? '<span class="text-green font-bold">FREE</span>' 
        : formatPKR(totals.deliveryFee);
    }

    if (discountRow && discountValEl) {
      if (totals.discount > 0) {
        discountRow.classList.remove('hidden');
        discountValEl.textContent = `-${formatPKR(totals.discount)}`;
      } else {
        discountRow.classList.add('hidden');
      }
    }

    if (totalEl) totalEl.textContent = formatPKR(totals.total);

    // Render applied coupon tag
    if (appliedCouponContainer) {
      if (state.appliedCoupon) {
        appliedCouponContainer.innerHTML = `
          <div class="applied-coupon-pill">
            <i class="fa-solid fa-tag text-orange"></i>
            <span><strong>${state.appliedCoupon.code}</strong> (${state.appliedCoupon.label})</span>
            <button class="btn-remove-coupon" data-action="remove-coupon" title="Remove coupon">&times;</button>
          </div>
        `;
      } else {
        appliedCouponContainer.innerHTML = '';
      }
    }
  }

  function addToCart(productId, quantity = 1, showToastMsg = true) {
    const existing = state.cart.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({ id: productId, quantity });
    }
    saveToStorage(STORAGE_KEYS.CART, state.cart);
    renderCartDrawer();

    const product = BAZAAR_PRODUCTS.find((p) => p.id === productId);
    if (showToastMsg && product) {
      showToast(`Added to Cart!`, `${product.name} has been added to your shopping bag.`);
    }
  }

  function updateQuantity(productId, delta) {
    const index = state.cart.findIndex((item) => item.id === productId);
    if (index !== -1) {
      state.cart[index].quantity += delta;
      if (state.cart[index].quantity <= 0) {
        state.cart.splice(index, 1);
      }
      saveToStorage(STORAGE_KEYS.CART, state.cart);
      renderCartDrawer();
    }
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter((item) => item.id !== productId);
    saveToStorage(STORAGE_KEYS.CART, state.cart);
    renderCartDrawer();
    showToast('Item Removed', 'The selected item was removed from your cart.');
  }

  function applyCouponCode(code) {
    const cleanCode = code.trim().toUpperCase();
    if (VALID_COUPONS[cleanCode]) {
      state.appliedCoupon = {
        code: cleanCode,
        ...VALID_COUPONS[cleanCode]
      };
      saveToStorage(STORAGE_KEYS.COUPON, state.appliedCoupon);
      renderCartDrawer();
      showToast('Voucher Applied!', `Promo code ${cleanCode} unlocked: ${state.appliedCoupon.label}`);
      return true;
    } else {
      showToast('Invalid Voucher', 'Code not recognized. Try DARAZ10, BAZAAR15, or WELCOME.', 'error');
      return false;
    }
  }

  function removeCoupon() {
    state.appliedCoupon = null;
    saveToStorage(STORAGE_KEYS.COUPON, null);
    renderCartDrawer();
    showToast('Voucher Removed', 'The discount promo code has been detached.');
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 5. WISHLIST CONTROLLER
  // ═════════════════════════════════════════════════════════════════════════
  function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    const product = BAZAAR_PRODUCTS.find((p) => p.id === productId);

    if (index !== -1) {
      state.wishlist.splice(index, 1);
      showToast('Removed from Wishlist', `${product ? product.name : 'Item'} removed from favorites.`);
    } else {
      state.wishlist.push(productId);
      showToast('Saved to Wishlist!', `${product ? product.name : 'Item'} saved to your favorite wishlist.`);
    }

    saveToStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
    updateWishlistBadge();
    renderCatalog();
    renderFlashSaleSection();
    renderWishlistDrawer();
  }

  function renderWishlistDrawer() {
    const container = document.getElementById('wishlist-items-container');
    if (!container) return;

    const wishlistProducts = BAZAAR_PRODUCTS.filter((p) => state.wishlist.includes(p.id));

    if (wishlistProducts.length === 0) {
      container.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-cart-icon">
            <i class="fa-regular fa-heart"></i>
          </div>
          <h4>Your Wishlist is Empty</h4>
          <p>Tap the heart icon on any Khaadi dress, audio gear, or kitchen appliance to save it for later.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = wishlistProducts.map((product) => `
      <div class="cart-item-row" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" class="cart-item-thumb" />
        <div class="cart-item-body">
          <span class="cart-item-brand">${product.brand}</span>
          <h4 class="cart-item-title">${product.name}</h4>
          <div class="cart-item-price-row">
            <span class="cart-item-price">${formatPKR(product.price)}</span>
            <span class="cart-item-orig">${formatPKR(product.originalPrice)}</span>
          </div>
          <div class="cart-item-bottom" style="margin-top: 0.6rem;">
            <button class="btn btn-sm btn-primary" data-action="move-wishlist-cart" data-id="${product.id}">
              <i class="fa-solid fa-cart-plus"></i> Move to Cart
            </button>
            <button class="btn-remove-item" data-action="remove-wishlist" data-id="${product.id}" title="Remove">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 6. QUICK VIEW MODAL
  // ═════════════════════════════════════════════════════════════════════════
  function openQuickView(productId) {
    const product = BAZAAR_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quick-view-modal');
    const container = document.getElementById('quick-view-content');
    if (!modal || !container) return;

    container.innerHTML = `
      <div class="qv-grid">
        <div class="qv-media-col">
          <div class="qv-main-img-wrap">
            <img src="${product.image}" alt="${product.name}" class="qv-main-img" />
            <span class="discount-pill qv-badge">-${product.discount}% OFF</span>
          </div>
          <div class="qv-trust-features">
            <div class="qv-feature-item">
              <i class="fa-solid fa-money-bill-wave text-green"></i>
              <span>Cash on Delivery (COD) Available</span>
            </div>
            <div class="qv-feature-item">
              <i class="fa-solid fa-rotate-left text-orange"></i>
              <span>7 Days Easy Return Guarantee</span>
            </div>
            <div class="qv-feature-item">
              <i class="fa-solid fa-shield-halved text-blue"></i>
              <span>100% Authentic Brand Original</span>
            </div>
          </div>
        </div>

        <div class="qv-details-col">
          <div class="qv-brand-tag">${product.brand} • ${product.categoryName}</div>
          <h2 class="qv-title">${product.name}</h2>

          <div class="rating-row" style="margin-bottom: 1rem;">
            <div class="stars">${renderStars(product.rating)}</div>
            <span class="rating-val font-bold">${product.rating}</span>
            <span class="review-count">(${product.reviews} verified customer reviews)</span>
          </div>

          <div class="qv-price-box">
            <div class="qv-price-row">
              <span class="qv-current-price">${formatPKR(product.price)}</span>
              <span class="qv-orig-price">${formatPKR(product.originalPrice)}</span>
              <span class="qv-save-tag">You Save ${formatPKR(product.originalPrice - product.price)}</span>
            </div>
            <div class="qv-tax-note">Inclusive of all local Pakistani GST and duties</div>
          </div>

          <p class="qv-desc">${product.description}</p>

          <div class="qv-specs-table">
            <h4 class="qv-specs-title">Product Specifications</h4>
            <div class="specs-grid">
              ${Object.entries(product.specs).map(([key, val]) => `
                <div class="spec-row">
                  <span class="spec-k">${key}:</span>
                  <span class="spec-v">${val}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="qv-delivery-estimator">
            <i class="fa-solid fa-location-dot text-orange"></i>
            <span>Delivery to <strong>Karachi, Lahore, Islamabad</strong> in 2-4 business days</span>
          </div>

          <div class="qv-cta-row">
            <div class="quantity-stepper qv-stepper">
              <button class="btn-qty" id="qv-qty-minus"><i class="fa-solid fa-minus"></i></button>
              <span class="qty-num" id="qv-qty-val">1</span>
              <button class="btn-qty" id="qv-qty-plus"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button class="btn btn-outline-orange btn-lg" id="qv-add-cart-btn">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
            <button class="btn btn-primary btn-lg" id="qv-buy-now-btn">
              <i class="fa-solid fa-bolt"></i> Buy Now
            </button>
          </div>
        </div>
      </div>
    `;

    let qvQuantity = 1;
    const qtyVal = document.getElementById('qv-qty-val');
    const btnMinus = document.getElementById('qv-qty-minus');
    const btnPlus = document.getElementById('qv-qty-plus');
    const btnAdd = document.getElementById('qv-add-cart-btn');
    const btnBuy = document.getElementById('qv-buy-now-btn');

    if (btnMinus && btnPlus && qtyVal) {
      btnMinus.onclick = () => {
        if (qvQuantity > 1) {
          qvQuantity--;
          qtyVal.textContent = qvQuantity;
        }
      };
      btnPlus.onclick = () => {
        if (qvQuantity < product.stock) {
          qvQuantity++;
          qtyVal.textContent = qvQuantity;
        }
      };
    }

    if (btnAdd) {
      btnAdd.onclick = () => {
        addToCart(product.id, qvQuantity);
        closeModal(modal);
      };
    }

    if (btnBuy) {
      btnBuy.onclick = () => {
        addToCart(product.id, qvQuantity, false);
        closeModal(modal);
        openCheckoutModal();
      };
    }

    openModal(modal);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 7. CASH ON DELIVERY (COD) CHECKOUT ENGINE
  // ═════════════════════════════════════════════════════════════════════════
  function populateCityDropdown() {
    const citySelect = document.getElementById('checkout-city');
    if (!citySelect) return;

    citySelect.innerHTML = `
      <option value="">Select City / Town</option>
      ${PAKISTAN_CITIES.map((city) => `<option value="${city}">${city}</option>`).join('')}
    `;
  }

  function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const summaryContainer = document.getElementById('checkout-summary-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const discountRow = document.getElementById('checkout-discount-row');
    const discountEl = document.getElementById('checkout-discount');
    const grandTotalEl = document.getElementById('checkout-grand-total');

    if (!modal) return;

    const items = getCartItemDetails();
    if (items.length === 0) {
      showToast('Cart is Empty', 'Please add products to your cart before proceeding to checkout.', 'error');
      return;
    }

    const totals = calculateCartTotals();

    if (summaryContainer) {
      summaryContainer.innerHTML = items.map((item) => `
        <div class="checkout-item-preview">
          <img src="${item.product.image}" alt="${item.product.name}" />
          <div class="ci-meta">
            <span class="ci-title">${item.product.name}</span>
            <span class="ci-qty">Qty: ${item.quantity} &times; ${formatPKR(item.product.price)}</span>
          </div>
          <span class="ci-sub">${formatPKR(item.product.price * item.quantity)}</span>
        </div>
      `).join('');
    }

    if (subtotalEl) subtotalEl.textContent = formatPKR(totals.subtotal);
    if (shippingEl) {
      shippingEl.innerHTML = totals.deliveryFee === 0 
        ? '<span class="text-green font-bold">FREE</span>' 
        : formatPKR(totals.deliveryFee);
    }

    if (discountRow && discountEl) {
      if (totals.discount > 0) {
        discountRow.classList.remove('hidden');
        discountEl.textContent = `-${formatPKR(totals.discount)}`;
      } else {
        discountRow.classList.add('hidden');
      }
    }

    if (grandTotalEl) grandTotalEl.textContent = formatPKR(totals.total);

    openModal(modal);
  }

  function handleCheckoutSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    const cityInput = document.getElementById('checkout-city');
    const addressInput = document.getElementById('checkout-address');
    const paymentRadio = document.querySelector('input[name="payment_method"]:checked');

    let isValid = true;

    // 1. Full Name Validation
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      setFieldError(nameInput, 'Enter your full name (minimum 3 characters).');
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // 2. Pakistani Phone Number Validation: 03xx-xxxxxxx
    const phoneVal = phoneInput.value.replace(/[\s-]/g, '');
    const pakPhoneRegex = /^03\d{9}$/;
    if (!pakPhoneRegex.test(phoneVal)) {
      setFieldError(phoneInput, 'Enter a valid Pakistani mobile number (e.g. 03001234567 or 0321-9876543).');
      isValid = false;
    } else {
      clearFieldError(phoneInput);
    }

    // 3. City Selection
    if (!cityInput.value) {
      setFieldError(cityInput, 'Select your delivery destination city.');
      isValid = false;
    } else {
      clearFieldError(cityInput);
    }

    // 4. Street Address
    if (!addressInput.value.trim() || addressInput.value.trim().length < 10) {
      setFieldError(addressInput, 'Provide complete house, street, and area address (min 10 characters).');
      isValid = false;
    } else {
      clearFieldError(addressInput);
    }

    if (!isValid) return;

    // Generate Order Details
    const totals = calculateCartTotals();
    const orderId = `BZPK-${Math.floor(10000 + Math.random() * 90000)}-${cityInput.value.substring(0, 3).toUpperCase()}`;
    const orderDate = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

    const newOrder = {
      orderId,
      date: orderDate,
      customer: {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        city: cityInput.value,
        address: addressInput.value.trim()
      },
      paymentMethod: paymentRadio ? paymentRadio.value : 'Cash on Delivery (COD)',
      items: getCartItemDetails(),
      totals,
      status: 'Order Confirmed',
      courier: 'TCS Express / Leopards Courier',
      eta: '2 to 3 Business Days'
    };

    // Save order & clear cart
    state.orders.push(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, state.orders);

    state.cart = [];
    state.appliedCoupon = null;
    saveToStorage(STORAGE_KEYS.CART, []);
    saveToStorage(STORAGE_KEYS.COUPON, null);
    renderCartDrawer();

    // Close checkout modal & open Order Success confirmation
    closeModal(document.getElementById('checkout-modal'));
    openOrderSuccessModal(newOrder);
  }

  function setFieldError(input, msg) {
    input.classList.add('error');
    const err = input.parentElement.querySelector('.field-err');
    if (err) {
      err.textContent = msg;
      err.classList.add('visible');
    }
  }

  function clearFieldError(input) {
    input.classList.remove('error');
    const err = input.parentElement.querySelector('.field-err');
    if (err) {
      err.classList.remove('visible');
    }
  }

  function openOrderSuccessModal(order) {
    const modal = document.getElementById('order-success-modal');
    const body = document.getElementById('order-success-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="success-confirmation-card">
        <div class="success-checkmark-circle">
          <i class="fa-solid fa-check"></i>
        </div>
        <h2 class="success-title">Shukriya! Order Placed Successfully</h2>
        <p class="success-subtitle">
          Your order has been recorded. Our verification team will send an SMS dispatch notification shortly.
        </p>

        <div class="order-receipt-box">
          <div class="receipt-row">
            <span class="r-label">Tracking Number:</span>
            <span class="r-val tracking-code font-bold">${order.orderId}</span>
          </div>
          <div class="receipt-row">
            <span class="r-label">Payment Method:</span>
            <span class="r-val text-green font-bold">${order.paymentMethod}</span>
          </div>
          <div class="receipt-row">
            <span class="r-label">Estimated Delivery:</span>
            <span class="r-val">${order.eta} (${order.customer.city})</span>
          </div>
          <div class="receipt-row">
            <span class="r-label">Total Payable at Doorstep:</span>
            <span class="r-val price-total-pay font-bold">${formatPKR(order.totals.total)}</span>
          </div>
          <div class="receipt-row">
            <span class="r-label">Ship To:</span>
            <span class="r-val">${order.customer.name}, ${order.customer.address}, ${order.customer.city}</span>
          </div>
        </div>

        <div class="success-actions">
          <button class="btn btn-primary btn-lg" onclick="window.BazaarPK.trackOrderById('${order.orderId}')">
            <i class="fa-solid fa-truck"></i> Track Live Shipment Status
          </button>
          <button class="btn btn-outline-orange" onclick="window.BazaarPK.closeAllModals()">
            Continue Shopping on BazaarPK
          </button>
        </div>
      </div>
    `;

    openModal(modal);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 8. ORDER TRACKER MODAL
  // ═════════════════════════════════════════════════════════════════════════
  function trackOrderById(trackingId) {
    closeAllModals();
    const modal = document.getElementById('order-tracker-modal');
    const input = document.getElementById('tracker-input');
    const resultBox = document.getElementById('tracker-result-container');
    if (!modal) return;

    if (input && trackingId) {
      input.value = trackingId;
    }

    const order = state.orders.find((o) => o.orderId.toLowerCase() === (trackingId || '').toLowerCase());

    if (resultBox) {
      if (order) {
        resultBox.innerHTML = `
          <div class="tracker-status-card">
            <div class="tsc-head">
              <div>
                <span class="tsc-label">Active Shipment</span>
                <h3 class="tsc-code">${order.orderId}</h3>
              </div>
              <span class="badge-status-green"><i class="fa-solid fa-circle-dot"></i> In Transit via ${order.courier}</span>
            </div>

            <!-- 4-Stage Pakistan Logistics Timeline -->
            <div class="logistics-timeline">
              <div class="timeline-step completed">
                <div class="step-icon"><i class="fa-solid fa-check"></i></div>
                <div class="step-meta">
                  <strong>Order Verified</strong>
                  <span>Karachi Fulfillment Hub</span>
                </div>
              </div>
              <div class="timeline-step completed">
                <div class="step-icon"><i class="fa-solid fa-box"></i></div>
                <div class="step-meta">
                  <strong>Package Dispatched</strong>
                  <span>Handed to ${order.courier}</span>
                </div>
              </div>
              <div class="timeline-step active">
                <div class="step-icon"><i class="fa-solid fa-truck-fast"></i></div>
                <div class="step-meta">
                  <strong>In Transit to ${order.customer.city}</strong>
                  <span>Estimated Arrival: 1-2 Days</span>
                </div>
              </div>
              <div class="timeline-step">
                <div class="step-icon"><i class="fa-solid fa-house"></i></div>
                <div class="step-meta">
                  <strong>Doorstep Delivery (COD)</strong>
                  <span>Pay ${formatPKR(order.totals.total)} on receipt</span>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (trackingId) {
        resultBox.innerHTML = `
          <div class="tracker-status-card">
            <div class="tsc-head">
              <h3 class="tsc-code">${trackingId.toUpperCase()}</h3>
              <span class="badge-status-orange">Standard Courier Manifest</span>
            </div>
            <div class="logistics-timeline">
              <div class="timeline-step completed">
                <div class="step-icon"><i class="fa-solid fa-check"></i></div>
                <div class="step-meta"><strong>Dispatched from Central Warehouse</strong><span>Karachi Hub</span></div>
              </div>
              <div class="timeline-step active">
                <div class="step-icon"><i class="fa-solid fa-truck-fast"></i></div>
                <div class="step-meta"><strong>En Route via TCS Air Cargo</strong><span>Connecting to Destination Hub</span></div>
              </div>
              <div class="timeline-step">
                <div class="step-icon"><i class="fa-solid fa-house"></i></div>
                <div class="step-meta"><strong>Rider Out for Delivery</strong><span>Scheduled Tomorrow</span></div>
              </div>
            </div>
          </div>
        `;
      } else {
        resultBox.innerHTML = `
          <div class="tracker-prompt">
            <p>Enter your BazaarPK Order ID (e.g., <strong>BZPK-83921-KHI</strong>) to inspect live Pakistani courier logistics.</p>
          </div>
        `;
      }
    }

    openModal(modal);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 9. MODALS & DRAWERS UI HELPERS
  // ═════════════════════════════════════════════════════════════════════════
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    // Only restore scroll if no other modals/drawers open
    const openModals = document.querySelectorAll('.bazaar-modal.active, .cart-drawer.open, .wishlist-drawer.open');
    if (openModals.length === 0) {
      document.body.style.overflow = '';
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.bazaar-modal').forEach((m) => m.classList.remove('active'));
    document.getElementById('cart-drawer')?.classList.remove('open');
    document.getElementById('wishlist-drawer')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openCartDrawer() {
    renderCartDrawer();
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-backdrop');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-backdrop');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function openWishlistDrawer() {
    renderWishlistDrawer();
    const drawer = document.getElementById('wishlist-drawer');
    const overlay = document.getElementById('drawer-backdrop');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeWishlistDrawer() {
    const drawer = document.getElementById('wishlist-drawer');
    const overlay = document.getElementById('drawer-backdrop');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Floating Toast Notification
  function showToast(title, message, type = 'success') {
    const toast = document.getElementById('bazaar-toast');
    if (!toast) return;

    const titleEl = toast.querySelector('.toast-t');
    const msgEl = toast.querySelector('.toast-m');
    const iconEl = toast.querySelector('.toast-icon');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    if (iconEl) {
      iconEl.className = type === 'error'
        ? 'toast-icon bg-red text-white'
        : 'toast-icon bg-orange text-white';
      iconEl.innerHTML = type === 'error'
        ? '<i class="fa-solid fa-triangle-exclamation"></i>'
        : '<i class="fa-solid fa-bag-shopping"></i>';
    }

    toast.classList.add('visible');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 4200);
  }

  function resetAllFilters() {
    state.category = 'all';
    state.searchQuery = '';
    state.sortBy = 'popular';
    state.maxPrice = 35000;

    // Reset UI elements
    const searchInput = document.getElementById('main-search-input');
    const sortSelect = document.getElementById('sort-select');
    const priceRange = document.getElementById('price-range-input');
    const priceDisplay = document.getElementById('price-range-val');

    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'popular';
    if (priceRange) priceRange.value = 35000;
    if (priceDisplay) priceDisplay.textContent = formatPKR(35000);

    document.querySelectorAll('.cat-pill-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === 'all');
    });

    renderCatalog();
  }

  // ═════════════════════════════════════════════════════════════════════════
  // 10. EVENT DELEGATION & GLOBAL LISTENERS
  // ═════════════════════════════════════════════════════════════════════════
  function initEventDelegation() {
    // Global Click Delegation
    document.addEventListener('click', (e) => {
      // 1. Add to Cart
      const addCartBtn = e.target.closest('[data-action="add-cart"]');
      if (addCartBtn) {
        const id = parseInt(addCartBtn.getAttribute('data-id'), 10);
        addToCart(id, 1);
        return;
      }

      // 2. Buy Now
      const buyNowBtn = e.target.closest('[data-action="buy-now"]');
      if (buyNowBtn) {
        const id = parseInt(buyNowBtn.getAttribute('data-id'), 10);
        addToCart(id, 1, false);
        openCheckoutModal();
        return;
      }

      // 3. Toggle Wishlist
      const wishlistBtn = e.target.closest('[data-action="toggle-wishlist"]');
      if (wishlistBtn) {
        const id = parseInt(wishlistBtn.getAttribute('data-id'), 10);
        toggleWishlist(id);
        return;
      }

      // 4. Quick View
      const quickViewEl = e.target.closest('[data-action="quick-view"]');
      if (quickViewEl) {
        const id = parseInt(quickViewEl.getAttribute('data-id'), 10);
        openQuickView(id);
        return;
      }

      // 5. Quantity Stepper
      const incBtn = e.target.closest('[data-action="increment-qty"]');
      if (incBtn) {
        const id = parseInt(incBtn.getAttribute('data-id'), 10);
        updateQuantity(id, 1);
        return;
      }

      const decBtn = e.target.closest('[data-action="decrement-qty"]');
      if (decBtn) {
        const id = parseInt(decBtn.getAttribute('data-id'), 10);
        updateQuantity(id, -1);
        return;
      }

      // 6. Remove Cart Item
      const removeCartBtn = e.target.closest('[data-action="remove-cart"]');
      if (removeCartBtn) {
        const id = parseInt(removeCartBtn.getAttribute('data-id'), 10);
        removeFromCart(id);
        return;
      }

      // 7. Move Wishlist item to Cart
      const moveCartBtn = e.target.closest('[data-action="move-wishlist-cart"]');
      if (moveCartBtn) {
        const id = parseInt(moveCartBtn.getAttribute('data-id'), 10);
        addToCart(id, 1);
        toggleWishlist(id);
        return;
      }

      const removeWishBtn = e.target.closest('[data-action="remove-wishlist"]');
      if (removeWishBtn) {
        const id = parseInt(removeWishBtn.getAttribute('data-id'), 10);
        toggleWishlist(id);
        return;
      }

      // 8. Remove Coupon
      const removeCpnBtn = e.target.closest('[data-action="remove-coupon"]');
      if (removeCpnBtn) {
        removeCoupon();
        return;
      }

      // 9. Close Modal
      const closeModalBtn = e.target.closest('[data-action="close-modal"]');
      if (closeModalBtn) {
        const modal = closeModalBtn.closest('.bazaar-modal');
        closeModal(modal);
        return;
      }
    });

    // Header Trigger Buttons
    const btnOpenCart = document.getElementById('btn-open-cart');
    if (btnOpenCart) btnOpenCart.onclick = openCartDrawer;

    const btnOpenWishlist = document.getElementById('btn-open-wishlist');
    if (btnOpenWishlist) btnOpenWishlist.onclick = openWishlistDrawer;

    const btnCloseCart = document.getElementById('btn-close-cart');
    if (btnCloseCart) btnCloseCart.onclick = closeCartDrawer;

    const btnCloseWishlist = document.getElementById('btn-close-wishlist');
    if (btnCloseWishlist) btnCloseWishlist.onclick = closeWishlistDrawer;

    const drawerBackdrop = document.getElementById('drawer-backdrop');
    if (drawerBackdrop) {
      drawerBackdrop.onclick = () => {
        closeCartDrawer();
        closeWishlistDrawer();
      };
    }

    // Modal Backdrops
    document.querySelectorAll('.bazaar-modal').forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });

    // ESC Key listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });

    // Category Pill Filters
    document.querySelectorAll('.cat-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.category = btn.getAttribute('data-cat') || 'all';
        renderCatalog();
      });
    });

    // Search Input with Debounce
    const searchInput = document.getElementById('main-search-input');
    const searchForm = document.getElementById('search-form');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderCatalog();
      });
    }
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        renderCatalog();
        const catalogSec = document.getElementById('catalog-section');
        if (catalogSec) {
          catalogSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderCatalog();
      });
    }

    // Price Range Slider
    const priceSlider = document.getElementById('price-range-input');
    const priceDisplay = document.getElementById('price-range-val');
    if (priceSlider && priceDisplay) {
      priceSlider.addEventListener('input', (e) => {
        state.maxPrice = parseInt(e.target.value, 10);
        priceDisplay.textContent = formatPKR(state.maxPrice);
        renderCatalog();
      });
    }

    // Cart Coupon Form
    const couponForm = document.getElementById('cart-coupon-form');
    const couponInput = document.getElementById('cart-coupon-input');
    if (couponForm && couponInput) {
      couponForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (couponInput.value) {
          applyCouponCode(couponInput.value);
          couponInput.value = '';
        }
      });
    }

    // Checkout Modal Open & Submit
    const btnProceedCheckout = document.getElementById('btn-proceed-checkout');
    if (btnProceedCheckout) {
      btnProceedCheckout.addEventListener('click', () => {
        closeCartDrawer();
        openCheckoutModal();
      });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    // Order Tracker Header Trigger
    const btnTrackOrder = document.getElementById('btn-track-order-nav');
    if (btnTrackOrder) {
      btnTrackOrder.addEventListener('click', () => {
        trackOrderById('');
      });
    }

    const trackerForm = document.getElementById('tracker-form');
    const trackerInput = document.getElementById('tracker-input');
    if (trackerForm && trackerInput) {
      trackerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        trackOrderById(trackerInput.value.trim());
      });
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // INITIALIZATION ON DOM READY
  // ═════════════════════════════════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    initFlashSaleTimer();
    renderFlashSaleSection();
    renderCatalog();
    renderCartDrawer();
    updateWishlistBadge();
    populateCityDropdown();
    initEventDelegation();
  });

  // Expose Global Public API for Inline Handlers
  window.BazaarPK = {
    addToCart,
    toggleWishlist,
    openQuickView,
    openCartDrawer,
    closeCartDrawer,
    openWishlistDrawer,
    closeWishlistDrawer,
    openCheckoutModal,
    trackOrderById,
    closeAllModals,
    showToast
  };
})();
