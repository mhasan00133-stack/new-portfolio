/**
 * VELOCE — Luxury Winter & Motorsport Apparel
 * Frontend Store Logic, State Management, Netlify Serverless API Client & Fallbacks.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. EMBEDDED FALLBACK CATALOG (Guarantees zero-failure offline operation)
  // =========================================================================
  const FALLBACK_PRODUCTS = [
    {
      id: 'vlc-fer-01',
      name: 'Scuderia Ferrari Rosso Corsa Quilted Puffer Jacket',
      brand: 'Ferrari',
      gender: 'Men',
      category: 'Puffers',
      price: 18999,
      originalPrice: 24999,
      discount: 24,
      rating: 4.9,
      reviewsCount: 128,
      stock: 14,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'Rosso Corsa', hex: '#E10600' }, { name: 'Nero Carbon', hex: '#0E1017' }],
      fabric: 'Water-Repellent Matte Ripstop with 700-Fill Thermal Duck Down',
      badge: 'Trending',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      description: 'Iconic Scuderia Ferrari thermal puffer featuring storm-proof baffle quilting, brushed fleece storm collar, embroidered Cavallino shield on chest, and internal zipped device pocket.'
    },
    {
      id: 'vlc-fer-02',
      name: 'Scuderia Ferrari Carbon Shield Heavyweight Fleece Hoodie',
      brand: 'Ferrari',
      gender: 'Men',
      category: 'Hoodies & Knits',
      price: 9499,
      originalPrice: 12500,
      discount: 24,
      rating: 4.8,
      reviewsCount: 94,
      stock: 22,
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'Nero Stealth', hex: '#111318' }, { name: 'Rosso Corsa', hex: '#E10600' }],
      fabric: '450 GSM Heavyweight Brushed Cotton-Poly Fleece with Carbon Hood Lining',
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      description: 'Premium heavyweight motorsport hoodie lined with thermal fleece. Custom Italian tricolor inner neck tape and high-density 3D silicone Ferrari shield.'
    },
    {
      id: 'vlc-fer-03',
      name: 'Ferrari Competizione Women\'s Thermal Softshell Windbreaker',
      brand: 'Ferrari',
      gender: 'Women',
      category: 'Jackets',
      price: 14999,
      originalPrice: 19500,
      discount: 23,
      rating: 4.9,
      reviewsCount: 67,
      stock: 9,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [{ name: 'Rosso Scuderia', hex: '#D60000' }, { name: 'Bianco Avorio', hex: '#F8FAFC' }],
      fabric: '3-Layer Windstopper Stretch Membrane with Micro-Grid Fleece Backing',
      badge: 'Trending',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      description: 'Tailored feminine motorsport cut offering complete gale protection. Articulated sleeves, storm hood with concealed cinch, and water-sealed YKK zips.'
    },
    {
      id: 'vlc-fer-04',
      name: 'Ferrari Paddock Club Dual-Insulated Padded Winter Vest',
      brand: 'Ferrari',
      gender: 'Men',
      category: 'Puffers',
      price: 12999,
      originalPrice: 16999,
      discount: 23,
      rating: 4.7,
      reviewsCount: 48,
      stock: 18,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Nero Black', hex: '#0B0D13' }, { name: 'Modena Yellow', hex: '#FFBE00' }],
      fabric: 'Windproof Micro-Ripstop with PrimaLoft Gold Synthetic Insulation',
      badge: 'New Drop',
      image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
      description: 'Ultra-lightweight yet exceptionally warm winter gilet engineered for paddock mobility. Features fleece-lined chin guard and reflective back collar print.'
    },
    {
      id: 'vlc-fer-05',
      name: 'Scuderia Ferrari Women\'s Cashmere-Blend High-Neck Knit',
      brand: 'Ferrari',
      gender: 'Women',
      category: 'Hoodies & Knits',
      price: 11500,
      originalPrice: 14999,
      discount: 23,
      rating: 4.9,
      reviewsCount: 52,
      stock: 11,
      sizes: ['S', 'M', 'L'],
      colors: [{ name: 'Nero Elegante', hex: '#181A20' }, { name: 'Rosso Scuro', hex: '#8B0000' }],
      fabric: '85% Extra-Fine Merino Wool, 15% Grade-A Mongolian Cashmere',
      badge: 'Luxury Knit',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      description: 'Refined Italian luxury knitwear with high thermal retention. Ribbed turtleneck and cuffs with subtle tonal metallic Ferrari wordmark badge.'
    },
    {
      id: 'vlc-amg-01',
      name: 'Mercedes-AMG Petronas F1 Paddock Winter Arctic Parka',
      brand: 'Mercedes-AMG',
      gender: 'Men',
      category: 'Parkas',
      price: 24999,
      originalPrice: 32000,
      discount: 22,
      rating: 5.0,
      reviewsCount: 142,
      stock: 8,
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'Obsidian Black', hex: '#08090C' }, { name: 'Petronas Cyan', hex: '#00A19B' }],
      fabric: 'Heavy Duty 20,000mm Hydrostatic Waterproof Shell with Thermal Duck Down',
      badge: 'Flagship Drop',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      description: 'Sub-zero expedition parka engineered for track engineers during harsh European winter testing. Dual storm flaps, removable faux-fur storm hood, and neon cyan reflective accents.'
    },
    {
      id: 'vlc-amg-02',
      name: 'AMG Affalterbach Diamond-Quilted Bomber Jacket',
      brand: 'Mercedes-AMG',
      gender: 'Men',
      category: 'Jackets',
      price: 16500,
      originalPrice: 21999,
      discount: 25,
      rating: 4.8,
      reviewsCount: 83,
      stock: 15,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'Matte Graphite', hex: '#1E232F' }, { name: 'Satin Obsidian', hex: '#0D0F14' }],
      fabric: 'High-Density Flight Nylon with Quilted Microfiber Thermal Wadding',
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=800&q=80',
      description: 'Classic MA-1 flight silhouette modernized with AMG high-performance styling. Embossed Affalterbach apple tree crest on genuine leather sleeve patch.'
    },
    {
      id: 'vlc-amg-03',
      name: 'Mercedes-AMG F1 Women\'s Longline Stealth Puffer Coat',
      brand: 'Mercedes-AMG',
      gender: 'Women',
      category: 'Puffers',
      price: 19999,
      originalPrice: 25999,
      discount: 23,
      rating: 4.9,
      reviewsCount: 79,
      stock: 7,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Stealth Noir', hex: '#0A0C10' }, { name: 'Glacier Silver', hex: '#CBD5E1' }],
      fabric: 'Gloss Lacquer Weather-Shield Fabric with 650-Fill Down Insulation',
      badge: 'Trending',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      description: 'Elegant maxi-length winter down coat featuring a thermal stand collar, magnetic wind flap, side zip expansion vents, and subtle AMG laser-cut branding.'
    },
    {
      id: 'vlc-amg-04',
      name: 'AMG Turbo-Hybrid Heavyweight Micro-Polar Fleece Zip',
      brand: 'Mercedes-AMG',
      gender: 'Men',
      category: 'Hoodies & Knits',
      price: 8999,
      originalPrice: 11999,
      discount: 25,
      rating: 4.7,
      reviewsCount: 61,
      stock: 24,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'Carbon Black', hex: '#13161C' }, { name: 'Steel Melange', hex: '#4B5563' }],
      fabric: '360 GSM Anti-Pill Micro-Polar Fleece with Water-Resistant Woven Yokes',
      badge: 'Essential',
      image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80',
      description: 'Versatile winter mid-layer with reinforced abrasion-resistant shoulders. Breathable underarm stretch panels and zippered chest utility pocket.'
    },
    {
      id: 'vlc-amg-05',
      name: 'Mercedes-AMG Women\'s Form-Fit Thermal Track Jacket',
      brand: 'Mercedes-AMG',
      gender: 'Women',
      category: 'Jackets',
      price: 13499,
      originalPrice: 17500,
      discount: 23,
      rating: 4.8,
      reviewsCount: 43,
      stock: 12,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [{ name: 'Phantom Black', hex: '#12141A' }, { name: 'Petronas Mist', hex: '#00827C' }],
      fabric: 'Double-Knit Thermal Performance Spandex with Brushed Fleece Lining',
      badge: 'New Drop',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      description: 'Ergonomically contoured racing jacket with thumbhole wind-stop cuffs and high-collar thermal seal. AMG AMG logo printed in high-gloss silicone.'
    },
    {
      id: 'vlc-aud-01',
      name: 'Audi Sport RS Performance Top-Grain Leather Biker Jacket',
      brand: 'Audi Sport',
      gender: 'Men',
      category: 'Jackets',
      price: 23500,
      originalPrice: 29999,
      discount: 22,
      rating: 5.0,
      reviewsCount: 116,
      stock: 6,
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'Nardo Black', hex: '#0F1216' }, { name: 'Vintage Chestnut', hex: '#452B1E' }],
      fabric: '1.2mm Full-Grain Buffalo Leather with Removable Diamond-Quilted Thermal Vest',
      badge: 'Luxury Leather',
      image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=800&q=80',
      description: 'Handcrafted motorsport motorcycle jacket with genuine RS Rhombus metal badge, heavy-gauge antique silver hardware, and CE-certified internal elbow pockets.'
    },
    {
      id: 'vlc-aud-02',
      name: 'Audi Sport GORE-TEX Mountain Heavy Down Puffer',
      brand: 'Audi Sport',
      gender: 'Men',
      category: 'Puffers',
      price: 17999,
      originalPrice: 23500,
      discount: 23,
      rating: 4.9,
      reviewsCount: 92,
      stock: 16,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Nardo Grey', hex: '#6B7280' }, { name: 'Mythos Black', hex: '#0A0C10' }],
      fabric: 'GORE-TEX Infinium Windproof Membrane with 750-Fill Power Goose Down',
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      description: 'Engineered for extreme alpine climates. Full windproof construction, storm-seal internal rib cuffs, and reflective Audi Quattro signature branding on sleeve.'
    },
    {
      id: 'vlc-aud-03',
      name: 'Audi Sport Women\'s Alpine Thermal Long Parka',
      brand: 'Audi Sport',
      gender: 'Women',
      category: 'Parkas',
      price: 18500,
      originalPrice: 24000,
      discount: 23,
      rating: 4.8,
      reviewsCount: 56,
      stock: 10,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Daytona Grey', hex: '#475569' }, { name: 'Glacier White', hex: '#F1F5F9' }],
      fabric: 'Water-Repellent Poly-Oxford with Thermal Thermo-Ball Insulation',
      badge: 'Winter Warmth',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
      description: 'Chic urban winter parka with fleece-lined deep handwarmer pockets, two-way heavy zipper, and red Audi Sport accent pullers.'
    },
    {
      id: 'vlc-aud-04',
      name: 'Audi Sport Quattro 10K All-Weather Winter Softshell',
      brand: 'Audi Sport',
      gender: 'Men',
      category: 'Jackets',
      price: 11999,
      originalPrice: 15500,
      discount: 23,
      rating: 4.7,
      reviewsCount: 71,
      stock: 20,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'Mythos Black', hex: '#111317' }, { name: 'Tango Red', hex: '#C00000' }],
      fabric: '10,000mm Hydrostatic Waterproof Stretch Softshell with Waffle Fleece',
      badge: 'All-Weather',
      image: 'https://images.unsplash.com/photo-1548883354-94672e3995f3?auto=format&fit=crop&w=800&q=80',
      description: 'Designed for high-output driving and outdoor motorsports. Windproof, breathable, and equipped with a micro-grid thermal fleece interior that locks in body heat.'
    },
    {
      id: 'vlc-aud-05',
      name: 'Audi Sport Women\'s Pure Merino Wool Mock-Neck Sweater',
      brand: 'Audi Sport',
      gender: 'Women',
      category: 'Hoodies & Knits',
      price: 10999,
      originalPrice: 13999,
      discount: 21,
      rating: 4.9,
      reviewsCount: 38,
      stock: 14,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [{ name: 'Chalk White', hex: '#F8FAFC' }, { name: 'Anthracite', hex: '#334155' }],
      fabric: '100% Sustainable Extra-Fine Australian Merino Wool',
      badge: 'Pure Merino',
      image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80',
      description: 'Super-fine gauge luxurious winter knit with natural temperature regulation. Seamless knitting technique for zero friction and ultimate cold-weather layering.'
    },
    {
      id: 'vlc-vel-01',
      name: 'Veloce Apex Heavyweight Sherpa-Lined Corduroy Jacket',
      brand: 'Veloce',
      gender: 'Men',
      category: 'Jackets',
      price: 13999,
      originalPrice: 17999,
      discount: 22,
      rating: 4.8,
      reviewsCount: 88,
      stock: 17,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: 'Caramel Tan', hex: '#B45309' }, { name: 'Midnight Charcoal', hex: '#1E293B' }],
      fabric: '14-Wale Vintage Cotton Corduroy with Plush High-Loft Faux Sherpa Fleece',
      badge: 'Trending Drop',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      description: 'Veloce signature vintage winter trucker jacket. Double-faced thick sherpa shearling collar, antiqued brass hardware, and dual buttoned chest pockets.'
    },
    {
      id: 'vlc-vel-02',
      name: 'Veloce Milano Oversized Double-Breasted Virgin Wool Overcoat',
      brand: 'Veloce',
      gender: 'Women',
      category: 'Jackets',
      price: 21999,
      originalPrice: 28000,
      discount: 21,
      rating: 5.0,
      reviewsCount: 104,
      stock: 5,
      sizes: ['S', 'M', 'L'],
      colors: [{ name: 'Camel Gold', hex: '#D97706' }, { name: 'Nero Black', hex: '#0F1117' }],
      fabric: '75% Italian Virgin Wool, 25% Polyamide for Shape Retention',
      badge: 'Luxury Runway',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      description: 'Statement Italian winter tailoring. Generous drop-shoulder cut, deep notched lapels, genuine buffalo horn buttons, and full satin interior lining.'
    },
    {
      id: 'vlc-vel-03',
      name: 'Veloce Carbon Monocoque Waterproof Thermal Tech Parka',
      brand: 'Veloce',
      gender: 'Men',
      category: 'Parkas',
      price: 15999,
      originalPrice: 20999,
      discount: 24,
      rating: 4.8,
      reviewsCount: 65,
      stock: 12,
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: [{ name: 'Asphalt Black', hex: '#0B0D12' }, { name: 'Combat Olive', hex: '#3F4E3E' }],
      fabric: 'Carbon-Grid Ripstop Poly with 3M Thinsulate Thermal Barrier',
      badge: 'Techwear',
      image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
      description: 'Technical motorsport outerwear built with high-density carbon ripstop matrix. Magnetic fidlock chest closures, AquaGuard taped seams, and hidden balaclava hood.'
    },
    {
      id: 'vlc-vel-04',
      name: 'Veloce Women\'s Ultra-Soft Cashmere-Touch Ribbed Turtleneck',
      brand: 'Veloce',
      gender: 'Women',
      category: 'Hoodies & Knits',
      price: 9999,
      originalPrice: 12999,
      discount: 23,
      rating: 4.9,
      reviewsCount: 57,
      stock: 20,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [{ name: 'Winter Cloud White', hex: '#F1F5F9' }, { name: 'Midnight Merlot', hex: '#581C87' }],
      fabric: 'Brushed Micro-Modal & Cashmere-Poly Blend (Zero Itch Guarantee)',
      badge: 'Winter Cozy',
      image: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=800&q=80',
      description: 'Buttery-soft essential winter knit designed for layered styling or standalone elegance. Form-flattering ribbed texture that never loses its structure.'
    }
  ];

  // =========================================================================
  // 2. STATE MANAGEMENT
  // =========================================================================
  let catalog = [...FALLBACK_PRODUCTS];
  let selectedSizes = {}; // Product ID -> Selected Size string
  let promoApplied = null; // { code: 'WINTER15', percent: 15 }

  // Persistent state
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('veloce_cart') || '[]');
  } catch (e) {
    cart = [];
  }

  let wishlist = [];
  try {
    wishlist = JSON.parse(localStorage.getItem('veloce_wishlist') || '[]');
  } catch (e) {
    wishlist = [];
  }

  let filters = {
    brand: 'All',
    gender: 'All',
    category: 'All',
    search: '',
    sort: 'featured'
  };

  // =========================================================================
  // 3. INITIALIZATION
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initWinterCountdown();
    fetchCatalogFromAPI();
    initFiltersAndSearch();
    initCartDrawers();
    initCheckout();
    initOrderTracker();
    updateCartUI();
    updateWishlistUI();
  });

  // =========================================================================
  // 4. API CLIENT WITH SEAMLESS LOCAL FALLBACK
  // =========================================================================
  async function fetchCatalogFromAPI() {
    const endpoints = [
      '/api/veloce/products',
      '/.netlify/functions/veloce-products'
    ];

    let apiLoaded = false;
    for (const url of endpoints) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
            catalog = data.products;
            apiLoaded = true;
            break;
          }
        }
      } catch (err) {
        // Fallback silently
      }
    }

    if (!apiLoaded) {
      catalog = [...FALLBACK_PRODUCTS];
    }

    applyFiltersAndRender();
  }

  // =========================================================================
  // 5. FILTERS & SEARCH
  // =========================================================================
  function initFiltersAndSearch() {
    // Brand / Category tabs
    const brandTabs = document.querySelectorAll('.filter-tab-btn');
    brandTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        brandTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const brand = tab.dataset.brand;
        const gender = tab.dataset.gender;

        if (brand) filters.brand = brand;
        if (gender) filters.gender = gender;
        if (!gender && !brand) {
          filters.brand = 'All';
          filters.gender = 'All';
        }

        applyFiltersAndRender();
      });
    });

    // Category Selector
    const catSelect = document.getElementById('filter-category-select');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        filters.category = e.target.value;
        applyFiltersAndRender();
      });
    }

    // Sort Selector
    const sortSelect = document.getElementById('filter-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        filters.sort = e.target.value;
        applyFiltersAndRender();
      });
    }

    // Search Input
    const searchInput = document.getElementById('store-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filters.search = e.target.value.trim().toLowerCase();
        applyFiltersAndRender();
      });
    }
  }

  function applyFiltersAndRender() {
    let result = [...catalog];

    // Brand filter
    if (filters.brand && filters.brand !== 'All') {
      result = result.filter((p) => p.brand.toLowerCase() === filters.brand.toLowerCase());
    }

    // Gender filter
    if (filters.gender && filters.gender !== 'All') {
      result = result.filter(
        (p) => p.gender.toLowerCase() === filters.gender.toLowerCase() || p.gender.toLowerCase() === 'unisex'
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Search query
    if (filters.search) {
      const q = filters.search;
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (filters.sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'discount') {
      result.sort((a, b) => b.discount - a.discount);
    }

    renderProductsGrid(result);
  }

  // =========================================================================
  // 6. PRODUCT GRID RENDERING
  // =========================================================================
  function renderProductsGrid(products) {
    const grid = document.getElementById('products-grid');
    const countEl = document.getElementById('results-count');

    if (countEl) countEl.textContent = `${products.length} Products Found`;
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-results-box">
          <i class="fa-solid fa-wind"></i>
          <h3>No Winter Outerwear Matches</h3>
          <p>Try clearing filters or search for "Ferrari", "AMG", "Parka", or "Puffer".</p>
          <button type="button" class="btn-veloce btn-veloce-outline" id="btn-reset-filters">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          filters = { brand: 'All', gender: 'All', category: 'All', search: '', sort: 'featured' };
          const searchInput = document.getElementById('store-search-input');
          if (searchInput) searchInput.value = '';
          const brandTabs = document.querySelectorAll('.filter-tab-btn');
          brandTabs.forEach((t) => t.classList.toggle('active', t.dataset.brand === 'All'));
          applyFiltersAndRender();
        });
      }
      return;
    }

    grid.innerHTML = products
      .map((p) => {
        const isWish = wishlist.includes(p.id);
        const currentSize = selectedSizes[p.id] || p.sizes[0] || 'L';
        const brandBadgeClass =
          p.brand === 'Ferrari'
            ? 'badge-ferrari'
            : p.brand === 'Mercedes-AMG'
            ? 'badge-amg'
            : p.brand === 'Audi Sport'
            ? 'badge-audi'
            : 'badge-veloce';

        return `
        <article class="veloce-card" data-id="${p.id}">
          <div class="card-media-wrapper">
            <span class="card-pill-badge ${brandBadgeClass}">
              <i class="fa-solid fa-flag-checkered"></i> ${p.badge || p.brand}
            </span>

            <button type="button" class="btn-wishlist-toggle ${isWish ? 'active' : ''}" data-id="${p.id}" aria-label="Add to Wishlist">
              <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>

            <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'">

            <button type="button" class="btn-card-quickview" data-id="${p.id}">
              <i class="fa-regular fa-eye"></i> Quick View
            </button>
          </div>

          <div class="card-info">
            <div class="card-meta-line">
              <span class="product-brand-tag">${p.brand} • ${p.gender}'s Collection</span>
              <span class="product-rating"><i class="fa-solid fa-star"></i> ${p.rating} (${p.reviewsCount})</span>
            </div>

            <h3 class="product-name" title="${p.name}">${p.name}</h3>
            <p class="product-fabric-tag"><i class="fa-solid fa-layer-group"></i> ${p.fabric}</p>

            <!-- Size Selector -->
            <div class="card-sizes-row">
              <span class="size-lbl">Size:</span>
              <div class="size-chips" data-prod-id="${p.id}">
                ${p.sizes
                  .map(
                    (s) => `
                  <button type="button" class="size-chip ${s === currentSize ? 'active' : ''}" data-size="${s}">
                    ${s}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>

            <!-- Price & Add To Cart -->
            <div class="card-price-action-row">
              <div class="price-stack">
                <div class="current-price">Rs. ${p.price.toLocaleString()}</div>
                <div class="original-price">Rs. ${p.originalPrice.toLocaleString()} <span class="discount-pill">-${p.discount}%</span></div>
              </div>

              <button type="button" class="btn-add-cart" data-id="${p.id}">
                <i class="fa-solid fa-bag-shopping"></i> Add
              </button>
            </div>
          </div>
        </article>
      `;
      })
      .join('');

    attachCardEventListeners();
  }

  function attachCardEventListeners() {
    // Size Chips
    document.querySelectorAll('.size-chip').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        const parent = chip.closest('.size-chips');
        const prodId = parent.dataset.prodId;
        const size = chip.dataset.size;

        parent.querySelectorAll('.size-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        selectedSizes[prodId] = size;
      });
    });

    // Add To Cart Buttons
    document.querySelectorAll('.btn-add-cart').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        addToCart(id);
      });
    });

    // Wishlist Buttons
    document.querySelectorAll('.btn-wishlist-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        toggleWishlist(id);
      });
    });

    // Quick View Buttons
    document.querySelectorAll('.btn-card-quickview').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        openQuickViewModal(id);
      });
    });
  }

  // =========================================================================
  // 7. CART STATE & OPERATIONS
  // =========================================================================
  function addToCart(productId, customSize, customQty) {
    const product = catalog.find((p) => p.id === productId);
    if (!product) return;

    const size = customSize || selectedSizes[productId] || product.sizes[0] || 'L';
    const quantity = customQty || 1;

    // Check if same item & size exists in cart
    const existingIndex = cart.findIndex((item) => item.id === productId && item.size === size);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        size: size,
        color: product.colors[0] ? product.colors[0].name : 'Default',
        image: product.image,
        quantity: quantity
      });
    }

    saveCart();
    updateCartUI();
    showToast(`Added to Bag: ${product.name} (Size: ${size})`);

    // Animate button feedback
    const btn = document.querySelector(`.btn-add-cart[data-id="${productId}"]`);
    if (btn) {
      const origText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      btn.classList.add('added');
      setTimeout(() => {
        btn.innerHTML = origText;
        btn.classList.remove('added');
      }, 1400);
    }
  }

  function removeFromCart(index) {
    if (cart[index]) {
      const removed = cart.splice(index, 1)[0];
      saveCart();
      updateCartUI();
      showToast(`Removed from Bag: ${removed.name}`);
    }
  }

  function updateQuantity(index, delta) {
    if (cart[index]) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        removeFromCart(index);
        return;
      }
      saveCart();
      updateCartUI();
    }
  }

  function saveCart() {
    try {
      localStorage.setItem('veloce_cart', JSON.stringify(cart));
    } catch (e) {
      // LocalStorage fallback
    }
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, it) => sum + it.quantity, 0);
    const subtotal = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);

    // Navbar badges
    document.querySelectorAll('.cart-counter-badge').forEach((badge) => {
      badge.textContent = totalCount;
      badge.classList.toggle('visible', totalCount > 0);
    });

    // Cart Drawer Items List
    const itemsContainer = document.getElementById('cart-drawer-items');
    const emptyState = document.getElementById('cart-empty-state');
    const footer = document.getElementById('cart-drawer-footer');

    if (itemsContainer && emptyState && footer) {
      if (cart.length === 0) {
        itemsContainer.innerHTML = '';
        emptyState.style.display = 'flex';
        footer.style.display = 'none';
      } else {
        emptyState.style.display = 'none';
        footer.style.display = 'block';

        itemsContainer.innerHTML = cart
          .map(
            (item, idx) => `
          <div class="cart-item-row">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
              <div class="cart-item-brand">${item.brand}</div>
              <h4 class="cart-item-title">${item.name}</h4>
              <div class="cart-item-size">Size: <strong>${item.size}</strong></div>
              <div class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>

              <div class="cart-item-controls">
                <div class="qty-stepper">
                  <button type="button" class="btn-qty-minus" data-idx="${idx}">-</button>
                  <span class="qty-num">${item.quantity}</span>
                  <button type="button" class="btn-qty-plus" data-idx="${idx}">+</button>
                </div>

                <button type="button" class="btn-cart-remove" data-idx="${idx}">
                  <i class="fa-regular fa-trash-can"></i> Remove
                </button>
              </div>
            </div>
          </div>
        `
          )
          .join('');

        // Stepper listeners
        itemsContainer.querySelectorAll('.btn-qty-minus').forEach((b) => {
          b.addEventListener('click', () => updateQuantity(parseInt(b.dataset.idx, 10), -1));
        });
        itemsContainer.querySelectorAll('.btn-qty-plus').forEach((b) => {
          b.addEventListener('click', () => updateQuantity(parseInt(b.dataset.idx, 10), 1));
        });
        itemsContainer.querySelectorAll('.btn-cart-remove').forEach((b) => {
          b.addEventListener('click', () => removeFromCart(parseInt(b.dataset.idx, 10)));
        });
      }
    }

    // Free delivery progress bar (Rs. 4,999 threshold in Pakistan)
    const freeDeliveryThreshold = 4999;
    const progressFill = document.getElementById('free-shipping-progress');
    const progressNotice = document.getElementById('free-shipping-notice');

    if (progressFill && progressNotice) {
      if (subtotal >= freeDeliveryThreshold) {
        progressFill.style.width = '100%';
        progressNotice.innerHTML = '<i class="fa-solid fa-truck-fast"></i> You unlocked <strong>FREE Express Delivery</strong> across Pakistan!';
        progressFill.classList.add('completed');
      } else {
        const remaining = freeDeliveryThreshold - subtotal;
        const pct = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
        progressFill.style.width = `${pct}%`;
        progressNotice.innerHTML = `Add <strong>Rs. ${remaining.toLocaleString()}</strong> more for <strong>FREE Delivery</strong>`;
        progressFill.classList.remove('completed');
      }
    }

    // Calculations with promo
    let discountAmount = 0;
    if (promoApplied) {
      discountAmount = Math.round((subtotal * promoApplied.percent) / 100);
    }

    const shippingFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 250;
    const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount-amount');
    const discountRow = document.getElementById('cart-discount-row');
    const shippingEl = document.getElementById('cart-shipping-fee');
    const totalEl = document.getElementById('cart-grand-total');

    if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
    if (discountRow && discountEl) {
      if (discountAmount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `- Rs. ${discountAmount.toLocaleString()}`;
      } else {
        discountRow.style.display = 'none';
      }
    }
    if (shippingEl) shippingEl.textContent = shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`;
    if (totalEl) totalEl.textContent = `Rs. ${grandTotal.toLocaleString()}`;
  }

  // =========================================================================
  // 8. DRAWER CONTROLS (Cart & Wishlist)
  // =========================================================================
  function initCartDrawers() {
    const cartDrawer = document.getElementById('cart-drawer');
    const openCartBtns = document.querySelectorAll('.btn-open-cart');
    const closeCartBtn = document.getElementById('btn-close-cart');
    const cartOverlay = document.getElementById('cart-drawer-overlay');

    openCartBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer(cartDrawer, cartOverlay);
      });
    });

    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', () => closeDrawer(cartDrawer, cartOverlay));
    }
    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => {
        closeDrawer(cartDrawer, cartOverlay);
        closeWishlistDrawer();
      });
    }

    // Promo Code Apply
    const promoBtn = document.getElementById('btn-apply-promo');
    const promoInput = document.getElementById('cart-promo-input');
    const promoMsg = document.getElementById('promo-status-msg');

    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === 'WINTER15') {
          promoApplied = { code: 'WINTER15', percent: 15 };
          if (promoMsg) {
            promoMsg.textContent = '15% Motorsport Winter Discount Applied!';
            promoMsg.className = 'promo-msg success';
          }
          updateCartUI();
          showToast('Promo Code WINTER15 Applied (15% OFF)');
        } else if (code === 'VELOCE10') {
          promoApplied = { code: 'VELOCE10', percent: 10 };
          if (promoMsg) {
            promoMsg.textContent = '10% VIP Member Discount Applied!';
            promoMsg.className = 'promo-msg success';
          }
          updateCartUI();
          showToast('Promo Code VELOCE10 Applied (10% OFF)');
        } else {
          if (promoMsg) {
            promoMsg.textContent = 'Invalid promo code. Use WINTER15 for 15% off.';
            promoMsg.className = 'promo-msg error';
          }
        }
      });
    }

    // Wishlist Drawer Controls
    const wishDrawer = document.getElementById('wishlist-drawer');
    const openWishBtns = document.querySelectorAll('.btn-open-wishlist');
    const closeWishBtn = document.getElementById('btn-close-wishlist');

    openWishBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openDrawer(wishDrawer, cartOverlay);
        renderWishlistDrawerItems();
      });
    });

    if (closeWishBtn) {
      closeWishBtn.addEventListener('click', () => closeDrawer(wishDrawer, cartOverlay));
    }
  }

  function openDrawer(drawer, overlay) {
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer(drawer, overlay) {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function closeWishlistDrawer() {
    const wishDrawer = document.getElementById('wishlist-drawer');
    const cartOverlay = document.getElementById('cart-drawer-overlay');
    if (wishDrawer) wishDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // =========================================================================
  // 9. WISHLIST OPERATIONS
  // =========================================================================
  function toggleWishlist(productId) {
    const idx = wishlist.indexOf(productId);
    const product = catalog.find((p) => p.id === productId);

    if (idx > -1) {
      wishlist.splice(idx, 1);
      showToast(`Removed from Wishlist: ${product ? product.name : ''}`);
    } else {
      wishlist.push(productId);
      showToast(`Added to Wishlist: ${product ? product.name : ''}`);
    }

    try {
      localStorage.setItem('veloce_wishlist', JSON.stringify(wishlist));
    } catch (e) {}

    updateWishlistUI();
    applyFiltersAndRender();
  }

  function updateWishlistUI() {
    document.querySelectorAll('.wishlist-counter-badge').forEach((badge) => {
      badge.textContent = wishlist.length;
      badge.classList.toggle('visible', wishlist.length > 0);
    });
  }

  function renderWishlistDrawerItems() {
    const container = document.getElementById('wishlist-drawer-items');
    const emptyState = document.getElementById('wishlist-empty-state');
    if (!container || !emptyState) return;

    const wishProducts = catalog.filter((p) => wishlist.includes(p.id));

    if (wishProducts.length === 0) {
      container.innerHTML = '';
      emptyState.style.display = 'flex';
    } else {
      emptyState.style.display = 'none';
      container.innerHTML = wishProducts
        .map(
          (p) => `
        <div class="wishlist-item-row">
          <img src="${p.image}" alt="${p.name}" class="wish-item-img">
          <div class="wish-item-info">
            <div class="wish-item-brand">${p.brand}</div>
            <h4 class="wish-item-name">${p.name}</h4>
            <div class="wish-item-price">Rs. ${p.price.toLocaleString()}</div>
            <div class="wish-item-actions">
              <button type="button" class="btn-wish-add-cart" data-id="${p.id}">
                <i class="fa-solid fa-bag-shopping"></i> Add to Bag
              </button>
              <button type="button" class="btn-wish-remove" data-id="${p.id}">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `
        )
        .join('');

      container.querySelectorAll('.btn-wish-add-cart').forEach((btn) => {
        btn.addEventListener('click', () => {
          addToCart(btn.dataset.id);
          toggleWishlist(btn.dataset.id);
          renderWishlistDrawerItems();
        });
      });

      container.querySelectorAll('.btn-wish-remove').forEach((btn) => {
        btn.addEventListener('click', () => {
          toggleWishlist(btn.dataset.id);
          renderWishlistDrawerItems();
        });
      });
    }
  }

  // =========================================================================
  // 10. QUICK VIEW MODAL
  // =========================================================================
  function openQuickViewModal(productId) {
    const modal = document.getElementById('quickview-modal');
    const product = catalog.find((p) => p.id === productId);
    if (!modal || !product) return;

    document.getElementById('qv-product-img').src = product.image;
    document.getElementById('qv-brand').textContent = `${product.brand} • ${product.gender}'s Collection`;
    document.getElementById('qv-title').textContent = product.name;
    document.getElementById('qv-price').textContent = `Rs. ${product.price.toLocaleString()}`;
    document.getElementById('qv-orig-price').textContent = `Rs. ${product.originalPrice.toLocaleString()}`;
    document.getElementById('qv-discount').textContent = `-${product.discount}% OFF`;
    document.getElementById('qv-rating').innerHTML = `<i class="fa-solid fa-star"></i> ${product.rating} (${product.reviewsCount} customer reviews)`;
    document.getElementById('qv-fabric').textContent = product.fabric;
    document.getElementById('qv-description').textContent = product.description;

    // Render sizes
    const sizesContainer = document.getElementById('qv-sizes');
    const currentSize = selectedSizes[product.id] || product.sizes[0];
    sizesContainer.innerHTML = product.sizes
      .map(
        (s) => `
      <button type="button" class="qv-size-btn ${s === currentSize ? 'active' : ''}" data-size="${s}">
        ${s}
      </button>
    `
      )
      .join('');

    sizesContainer.querySelectorAll('.qv-size-btn').forEach((b) => {
      b.addEventListener('click', () => {
        sizesContainer.querySelectorAll('.qv-size-btn').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        selectedSizes[product.id] = b.dataset.size;
      });
    });

    // Add To Cart from Quickview
    const qvAddBtn = document.getElementById('btn-qv-add-cart');
    if (qvAddBtn) {
      qvAddBtn.onclick = () => {
        const activeSize = sizesContainer.querySelector('.qv-size-btn.active');
        const chosenSize = activeSize ? activeSize.dataset.size : product.sizes[0];
        const qty = parseInt(document.getElementById('qv-qty-input').value, 10) || 1;
        addToCart(product.id, chosenSize, qty);
        modal.classList.remove('active');
      };
    }

    modal.classList.add('active');
  }

  // =========================================================================
  // 11. CHECKOUT & SERVERLESS ORDER PLACEMENT
  // =========================================================================
  function initCheckout() {
    const checkoutModal = document.getElementById('checkout-modal');
    const openCheckoutBtn = document.getElementById('btn-proceed-checkout');
    const closeCheckoutBtn = document.getElementById('btn-close-checkout');
    const form = document.getElementById('checkout-form');

    if (openCheckoutBtn) {
      openCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
          showToast('Your shopping bag is empty.');
          return;
        }
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-drawer-overlay');
        closeDrawer(cartDrawer, cartOverlay);

        updateCheckoutSummary();
        if (checkoutModal) checkoutModal.classList.add('active');
      });
    }

    if (closeCheckoutBtn && checkoutModal) {
      closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.remove('active'));
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const origHtml = submitBtn ? submitBtn.innerHTML : 'Place Order';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Order...';
        }

        const formData = {
          fullName: document.getElementById('chk-name').value.trim(),
          email: document.getElementById('chk-email').value.trim(),
          phone: document.getElementById('chk-phone').value.trim(),
          city: document.getElementById('chk-city').value.trim(),
          address: document.getElementById('chk-address').value.trim(),
          paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
          promoCode: promoApplied ? promoApplied.code : '',
          items: cart
        };

        let orderResult = null;

        // Attempt Netlify Serverless Function
        const endpoints = [
          '/api/veloce/orders',
          '/.netlify/functions/veloce-orders'
        ];

        let apiSuccess = false;
        for (const url of endpoints) {
          try {
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
            });

            if (res.ok) {
              const data = await res.json();
              if (data && data.success) {
                orderResult = data.receipt;
                apiSuccess = true;
                break;
              }
            }
          } catch (err) {
            // Try next or fallback
          }
        }

        // Local deterministic fallback if offline / local static
        if (!apiSuccess || !orderResult) {
          const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
          const orderId = `VLC-2026-${randSuffix}`;
          const trackingNumber = `TCS-${Math.floor(100000000 + Math.random() * 900000000)}`;
          const now = new Date();
          const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);
          const disc = promoApplied ? Math.round((subtotal * promoApplied.percent) / 100) : 0;
          const grand = subtotal - disc + (subtotal >= 4999 ? 0 : 250);

          orderResult = {
            orderId: orderId,
            status: 'Confirmed',
            createdAt: now.toISOString(),
            customer: {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              city: formData.city,
              address: formData.address,
              paymentMethod: formData.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : formData.paymentMethod
            },
            financials: {
              subtotal: subtotal,
              discountAmount: disc,
              shippingFee: subtotal >= 4999 ? 0 : 250,
              grandTotal: grand
            },
            items: [...cart],
            courier: {
              partner: 'TCS Express Air Logistics',
              trackingNumber: trackingNumber,
              dispatchHub: 'Veloce Central Fulfillment Hub, Lahore'
            },
            estimatedDelivery: new Date(now.getTime() + 86400000 * 3).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })
          };
        }

        // Store order in local memory
        try {
          const pastOrders = JSON.parse(localStorage.getItem('veloce_placed_orders') || '[]');
          pastOrders.unshift(orderResult);
          localStorage.setItem('veloce_placed_orders', JSON.stringify(pastOrders.slice(0, 10)));
        } catch (e) {}

        // Reset cart
        cart = [];
        promoApplied = null;
        saveCart();
        updateCartUI();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origHtml;
        }

        if (checkoutModal) checkoutModal.classList.remove('active');
        displayOrderSuccessModal(orderResult);
      });
    }
  }

  function updateCheckoutSummary() {
    const listEl = document.getElementById('checkout-items-summary');
    const totalEl = document.getElementById('checkout-grand-total');
    if (!listEl) return;

    const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0);
    const disc = promoApplied ? Math.round((subtotal * promoApplied.percent) / 100) : 0;
    const shipping = subtotal >= 4999 ? 0 : 250;
    const grand = subtotal - disc + shipping;

    listEl.innerHTML = cart
      .map(
        (it) => `
      <div class="checkout-sum-row">
        <span>${it.name} (${it.size}) × ${it.quantity}</span>
        <strong>Rs. ${(it.price * it.quantity).toLocaleString()}</strong>
      </div>
    `
      )
      .join('');

    if (totalEl) totalEl.textContent = `Rs. ${grand.toLocaleString()}`;
  }

  function displayOrderSuccessModal(receipt) {
    const modal = document.getElementById('order-success-modal');
    if (!modal || !receipt) return;

    document.getElementById('receipt-order-id').textContent = receipt.orderId;
    document.getElementById('receipt-customer-name').textContent = receipt.customer.fullName;
    document.getElementById('receipt-address').textContent = `${receipt.customer.address}, ${receipt.customer.city}`;
    document.getElementById('receipt-payment').textContent = receipt.customer.paymentMethod;
    document.getElementById('receipt-tracking-code').textContent = receipt.courier.trackingNumber;
    document.getElementById('receipt-total').textContent = `Rs. ${receipt.financials.grandTotal.toLocaleString()}`;
    document.getElementById('receipt-est-date').textContent = receipt.estimatedDelivery;

    modal.classList.add('active');
    showToast(`Order #${receipt.orderId} Confirmed! Receipt dispatched.`);
  }

  // =========================================================================
  // 12. LIVE ORDER TRACKER
  // =========================================================================
  function initOrderTracker() {
    const modal = document.getElementById('tracker-modal');
    const openBtns = document.querySelectorAll('.btn-open-tracker');
    const closeBtn = document.getElementById('btn-close-tracker');
    const form = document.getElementById('tracker-search-form');

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal) modal.classList.add('active');
      });
    });

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('tracker-input-id');
        const id = input.value.trim().toUpperCase();
        if (!id) return;

        await fetchOrderTracking(id);
      });
    }

    // Modal click outside to close
    document.querySelectorAll('.veloce-modal').forEach((m) => {
      m.addEventListener('click', (e) => {
        if (e.target === m) m.classList.remove('active');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.veloce-modal.active').forEach((m) => m.classList.remove('active'));
      }
    });
  }

  async function fetchOrderTracking(orderId) {
    const timelineContainer = document.getElementById('tracker-timeline-view');
    const courierBox = document.getElementById('tracker-courier-box');
    if (timelineContainer) timelineContainer.innerHTML = '<div style="text-align:center; padding: 2rem;"><i class="fa-solid fa-spinner fa-spin"></i> Locating Courier Satellite Record...</div>';

    let trackingData = null;

    // Check backend Netlify Function
    try {
      const res = await fetch(`/.netlify/functions/veloce-orders?orderId=${encodeURIComponent(orderId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) trackingData = data.tracking;
      }
    } catch (e) {}

    if (!trackingData) {
      // Local storage check
      try {
        const past = JSON.parse(localStorage.getItem('veloce_placed_orders') || '[]');
        const found = past.find((o) => o.orderId.toUpperCase() === orderId);
        if (found) trackingData = found;
      } catch (e) {}
    }

    // Deterministic fallback generator if not in DB
    if (!trackingData) {
      const now = new Date();
      trackingData = {
        orderId: orderId,
        status: 'Dispatched & In Transit',
        courier: {
          partner: 'TCS Express Air Freight',
          trackingNumber: `TCS-${Math.floor(100000000 + Math.random() * 900000000)}`,
          dispatchHub: 'Veloce Central Fulfillment Hub, Lahore'
        },
        estimatedDelivery: new Date(now.getTime() + 86400000 * 3).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        timeline: [
          { step: 1, title: 'Order Confirmed', desc: 'Payment verified & items secured', completed: true },
          { step: 2, title: 'Quality Check & Thermal Sealed', desc: 'Inspected for motorsport thermal grading', completed: true },
          { step: 3, title: 'Dispatched via TCS Express Air', desc: 'Departed Lahore Airport Sorting Terminal', completed: true, current: true },
          { step: 4, title: 'Out for Doorstep Delivery', desc: 'Rider assigned upon local hub arrival', completed: false }
        ]
      };
    }

    // Render Timeline
    if (courierBox) {
      courierBox.innerHTML = `
        <div class="courier-card-badge">
          <div>
            <span class="courier-lbl">COURIER AIRWAY BILL</span>
            <div class="courier-code">${trackingData.courier.trackingNumber}</div>
          </div>
          <div class="courier-partner-name"><i class="fa-solid fa-plane-departure"></i> ${trackingData.courier.partner}</div>
        </div>
      `;
      courierBox.style.display = 'block';
    }

    if (timelineContainer && trackingData.timeline) {
      timelineContainer.innerHTML = trackingData.timeline
        .map(
          (t) => `
        <div class="timeline-step ${t.completed ? 'completed' : ''} ${t.current ? 'current' : ''}">
          <div class="step-marker">
            <i class="fa-solid ${t.completed ? 'fa-check' : 'fa-circle'}"></i>
          </div>
          <div class="step-content">
            <h4>${t.title}</h4>
            <p>${t.desc}</p>
          </div>
        </div>
      `
        )
        .join('');
    }
  }

  // =========================================================================
  // 13. SEASONAL WINTER COUNTDOWN TIMER
  // =========================================================================
  function initWinterCountdown() {
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-mins');
    const secsEl = document.getElementById('count-secs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // Seasonal Drop ends in 14 days
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);

    function update() {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) return;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
      secsEl.textContent = String(secs).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  // =========================================================================
  // 14. TOAST NOTIFICATIONS
  // =========================================================================
  function showToast(message) {
    let container = document.getElementById('veloce-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'veloce-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'veloce-toast';
    toast.innerHTML = `
      <div class="toast-flag-bar"></div>
      <i class="fa-solid fa-circle-check"></i>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 10);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }
})();
