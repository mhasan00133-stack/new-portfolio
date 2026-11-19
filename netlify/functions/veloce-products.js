/**
 * Netlify Serverless Function: veloce-products.js
 * Returns filtered and sorted winter & motorsport apparel catalog for VELOCE
 * Accessible at /.netlify/functions/veloce-products and /api/veloce/products
 */

const PRODUCTS = [
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
    colors: [
      { name: 'Rosso Corsa', hex: '#E10600' },
      { name: 'Nero Carbon', hex: '#0E1017' }
    ],
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
    colors: [
      { name: 'Nero Stealth', hex: '#111318' },
      { name: 'Rosso Corsa', hex: '#E10600' }
    ],
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
    colors: [
      { name: 'Rosso Scuderia', hex: '#D60000' },
      { name: 'Bianco Avorio', hex: '#F8FAFC' }
    ],
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
    colors: [
      { name: 'Nero Black', hex: '#0B0D13' },
      { name: 'Modena Yellow', hex: '#FFBE00' }
    ],
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
    colors: [
      { name: 'Nero Elegante', hex: '#181A20' },
      { name: 'Rosso Scuro', hex: '#8B0000' }
    ],
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
    colors: [
      { name: 'Obsidian Black', hex: '#08090C' },
      { name: 'Petronas Cyan Edition', hex: '#00A19B' }
    ],
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
    colors: [
      { name: 'Matte Graphite', hex: '#1E232F' },
      { name: 'Satin Obsidian', hex: '#0D0F14' }
    ],
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
    colors: [
      { name: 'Stealth Noir', hex: '#0A0C10' },
      { name: 'Glacier Silver', hex: '#CBD5E1' }
    ],
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
    colors: [
      { name: 'Carbon Black', hex: '#13161C' },
      { name: 'Steel Melange', hex: '#4B5563' }
    ],
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
    colors: [
      { name: 'Phantom Black', hex: '#12141A' },
      { name: 'Petronas Mist', hex: '#00827C' }
    ],
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
    colors: [
      { name: 'Nardo Black', hex: '#0F1216' },
      { name: 'Vintage Chestnut', hex: '#452B1E' }
    ],
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
    colors: [
      { name: 'Nardo Grey', hex: '#6B7280' },
      { name: 'Mythos Black', hex: '#0A0C10' }
    ],
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
    colors: [
      { name: 'Daytona Grey', hex: '#475569' },
      { name: 'Glacier White', hex: '#F1F5F9' }
    ],
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
    colors: [
      { name: 'Mythos Black', hex: '#111317' },
      { name: 'Tango Red', hex: '#C00000' }
    ],
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
    colors: [
      { name: 'Chalk White', hex: '#F8FAFC' },
      { name: 'Anthracite', hex: '#334155' }
    ],
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
    colors: [
      { name: 'Caramel Tan', hex: '#B45309' },
      { name: 'Midnight Charcoal', hex: '#1E293B' }
    ],
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
    colors: [
      { name: 'Camel Gold', hex: '#D97706' },
      { name: 'Nero Black', hex: '#0F1117' }
    ],
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
    colors: [
      { name: 'Asphalt Black', hex: '#0B0D12' },
      { name: 'Combat Olive', hex: '#3F4E3E' }
    ],
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
    colors: [
      { name: 'Winter Cloud White', hex: '#F1F5F9' },
      { name: 'Midnight Merlot', hex: '#581C87' }
    ],
    fabric: 'Brushed Micro-Modal & Cashmere-Poly Blend (Zero Itch Guarantee)',
    badge: 'Winter Cozy',
    image: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=800&q=80',
    description: 'Buttery-soft essential winter knit designed for layered styling or standalone elegance. Form-flattering ribbed texture that never loses its structure.'
  }
];

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed. Use GET to fetch products.' })
    };
  }

  try {
    const params = event.queryStringParameters || {};
    let filtered = [...PRODUCTS];

    // Filter by single product ID
    if (params.id) {
      const match = filtered.find((p) => p.id === params.id);
      if (match) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, product: match })
        };
      } else {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Product not found.' })
        };
      }
    }

    // Filter by Brand
    if (params.brand && params.brand.toLowerCase() !== 'all') {
      const b = params.brand.toLowerCase();
      filtered = filtered.filter((p) => p.brand.toLowerCase() === b);
    }

    // Filter by Gender
    if (params.gender && params.gender.toLowerCase() !== 'all') {
      const g = params.gender.toLowerCase();
      filtered = filtered.filter((p) => p.gender.toLowerCase() === g || p.gender.toLowerCase() === 'unisex');
    }

    // Filter by Category
    if (params.category && params.category.toLowerCase() !== 'all') {
      const c = params.category.toLowerCase();
      filtered = filtered.filter((p) => p.category.toLowerCase() === c);
    }

    // Search query
    if (params.search && params.search.trim()) {
      const query = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.fabric.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort order
    if (params.sort) {
      if (params.sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (params.sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (params.sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (params.sort === 'discount') {
        filtered.sort((a, b) => b.discount - a.discount);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: filtered.length,
        totalCatalog: PRODUCTS.length,
        brands: ['All', 'Ferrari', 'Mercedes-AMG', 'Audi Sport', 'Veloce'],
        categories: ['All', 'Jackets', 'Puffers', 'Hoodies & Knits', 'Parkas'],
        products: filtered,
        timestamp: new Date().toISOString()
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error loading products', details: err.message })
    };
  }
};
