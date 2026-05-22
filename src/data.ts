import { Product } from './types';

// Curated selection of high-end streetwear photography from Unsplash
const IMG_POOL = [
  'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80', // neon cyberpunk style
  'https://images.unsplash.com/photo-1618335829737-2228915674e0?w=800&auto=format&fit=crop&q=80', // dark premium graphic tee/hoodie
  'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80', // creative style
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80', // retro brown streetwear jacket
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&auto=format&fit=crop&q=80', // rugged outdoor streetwear
  'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80', // minimal model wearing oversized fit
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80', // yellow vibrant retro model
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80', // stylish oversized layering
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80', // elegant modern luxury streetwear
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80', // beige minimal aesthetics
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80', // vintage high sneakers
  'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80', // streetwear cap on floor
  'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80', // oversized heavy shirt
  'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80', // chains & industrial style accessories
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80', // pristine knitwear mockup
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80', // modern digital sweater design
  'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80', // folded boxy streetwear tees
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', // classic oversized t-shirt
  'https://images.unsplash.com/photo-1571243144144-6a7e65929b15?w=800&auto=format&fit=crop&q=80', // heavy retro washed denim
  'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&auto=format&fit=crop&q=80', // retro grunge specs & accessories
];

const SECONDARY_IMG_POOL = [
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1532660621034-fa555140e1b0?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
];

// Helper to generate 50 unique ultra-realistic streetwear products
const generateProducts = (): Product[] => {
  const categories: { name: 'Oversized Tees' | 'Shirts' | 'Cargo' | 'Caps' | 'Accessories' | 'Limited'; vibes: ('Y2K' | 'Vintage' | 'Retro' | 'Graphic' | 'Limited')[] }[] = [
    { name: 'Oversized Tees', vibes: ['Y2K', 'Graphic', 'Vintage'] },
    { name: 'Oversized Tees', vibes: ['Graphic', 'Retro'] },
    { name: 'Shirts', vibes: ['Vintage', 'Y2K'] },
    { name: 'Cargo', vibes: ['Y2K', 'Limited'] },
    { name: 'Cargo', vibes: ['Retro', 'Vintage'] },
    { name: 'Caps', vibes: ['Retro', 'Vintage', 'Y2K'] },
    { name: 'Accessories', vibes: ['Limited', 'Y2K'] },
    { name: 'Limited', vibes: ['Limited', 'Graphic', 'Y2K'] },
  ];

  const stories = [
    "Reconstructed from late 90s visual archives, featuring customized heavyweight 380GSM single jersey open-end cotton. Designed in a boxy silhouette, with dropped shoulders, raw-cut industrial double-stitch seams, and an echo screenprint that naturally fades over washes. A direct tribute to minimalist warehouse raves.",
    "A masterclass in technical geometry. Crafted from 420GSM ultra-dense organic loops, this garment underwent an individual sulfur-wash process to cultivate structural fades along stress-points. Styled with a drop shoulder block and finished with hand-burnished steel custom eyelets, reflecting vintage streetwear heritage.",
    "Engineered for tactical utility while honoring archival Y2K activewear. Formed from double-layered parachute ripstop with reinforced paneling. Features 12 industrial-grade heavy zippers, adjustable premium elastic drawstrings and custom molded gunmetal toggle buckles that authorize complete silhouette control.",
    "The peak of collectibility. Manufactured in extremely restricted numbers with deadstock 460GSM brushed loopback cotton. Detailed with a subtle cracked-distress silicone branding, high-density gel-prints, and heavy ribbing at the collars and cuffs. Designed to evolve, distress, and hold structure forever."
  ];

  const materialsList = [
    ["100% Organic Open-End Cotton", "Heavyweight 380GSM Jersey", "Premium Eco-Solvent Screenprint", "Made in limited batches of 100"],
    ["100% Cotton French Terry", "Double-brushed 460GSM weight", "Custom hand-sulfur washed", "Gunmetal finish custom rivets"],
    ["High-density Parachute Nylon Ripstop", "Water-repellent matte finish", "Molded tactical metal zippers", "Reinforced triple-stitch cargo pockets"],
    ["Pre-shrunk Heavy Cotton", "Dual-density raised high silicone print", "Distressed neck ribbing", "Certified deadstock fabric blend"]
  ];

  const names = [
    // Oversized Tees
    { title: "Ghost Sound Graphic Tee", cat: "Oversized Tees", price: 2499, orig: 3999, pools: [1, 2], stock: 8 },
    { title: "Decay Acid-Wash Heavy T-Shirt", cat: "Oversized Tees", price: 2799, orig: 4200, pools: [16, 17], stock: 12 },
    { title: "Muted Echo Boxy T-Shirt", cat: "Oversized Tees", price: 2200, pools: [5, 9], stock: 4 },
    { title: "Static Signal Oversized Tee", cat: "Oversized Tees", price: 2399, orig: 3500, pools: [2, 10], stock: 24 },
    { title: "Resonance Dual Tone Tee", cat: "Oversized Tees", price: 2600, pools: [15, 17], stock: 15 },
    { title: "Cyber Cybernetic Mock Graphic Tee", cat: "Oversized Tees", price: 2900, orig: 4500, pools: [0, 6], stock: 6 },
    { title: "Zero State heavy Knit Tee", cat: "Oversized Tees", price: 2500, pools: [9, 14], stock: 11 },
    { title: "Raw Edge Industrial Tee", cat: "Oversized Tees", price: 2299, pools: [5, 2], stock: 19 },
    { title: "Carbon Wash Vintage Tee", cat: "Oversized Tees", price: 2499, orig: 3900, pools: [1, 5], stock: 3 },
    { title: "Retro Genesis Heavy T-Shirt", cat: "Oversized Tees", price: 2650, pools: [6, 17], stock: 18 },

    // Shirts
    { title: "Warehouse Zip Boxy Shirt", cat: "Shirts", price: 3499, orig: 5999, pools: [12, 16], stock: 7 },
    { title: "Sulfur Wash Camp Collar Shirt", cat: "Shirts", price: 3200, pools: [8, 9], stock: 14 },
    { title: "Decayed Flannel Oversized Overshirt", cat: "Shirts", price: 3999, orig: 6500, pools: [3, 10], stock: 5 },
    { title: "Tactical Pocket Heavy Cotton Shirt", cat: "Shirts", price: 3600, pools: [4, 8], stock: 9 },
    { title: "Asymmetrical Metal Snap Shirt", cat: "Shirts", price: 3800, orig: 5200, pools: [12, 5], stock: 16 },
    { title: "Raw Indigo Utility Denim Shirt", cat: "Shirts", price: 4200, pools: [18, 3], stock: 3 },
    { title: "Minimalist Paneled Shell Shirt", cat: "Shirts", price: 3500, pools: [9, 12], stock: 22 },
    { title: "Structured Poplin Boxy Shirt", cat: "Shirts", price: 3100, pools: [12, 1], stock: 13 },
    { title: "Void Heavy canvas Work Shirt", cat: "Shirts", price: 4400, orig: 6999, pools: [3, 16], stock: 10 },

    // Cargo
    { title: "Parachute Ripstop Cargo Pants", cat: "Cargo", price: 5499, orig: 8999, pools: [4, 7], stock: 4 },
    { title: "Static Distortion Washed Cargo", cat: "Cargo", price: 4999, pools: [18, 10], stock: 11 },
    { title: "Tactical Multi-Pocket Combat Pants", cat: "Cargo", price: 5900, orig: 9500, pools: [4, 8], stock: 9 },
    { title: "Raw Distressed Panel Vintage Jeans", cat: "Cargo", price: 6200, pools: [18, 3], stock: 5 },
    { title: "Slit-Hem Nylon Techwear Cargo", cat: "Cargo", price: 5600, orig: 7800, pools: [0, 4], stock: 15 },
    { title: "Y2K Buckle Strap Cargo Trouser", cat: "Cargo", price: 5299, pools: [7, 13], stock: 2 },
    { title: "Heavyweight Loopback Cargo Joggers", cat: "Cargo", price: 4500, pools: [14, 9], stock: 20 },
    { title: "Muted Desert Combat Cargo Slacks", cat: "Cargo", price: 4800, pools: [9, 4], stock: 8 },
    { title: "Cyber-Grid Double Knee Pants", cat: "Cargo", price: 5999, orig: 8500, pools: [0, 18], stock: 6 },

    // Caps
    { title: "Faded Arch Cap", cat: "Caps", price: 1499, orig: 2499, pools: [11, 19], stock: 18 },
    { title: "Static Distortion vintage Snapback", cat: "Caps", price: 1699, pools: [19, 13], stock: 4 },
    { title: "Industrial Eyelet Heavy Cap", cat: "Caps", price: 1899, orig: 2900, pools: [11, 13], stock: 9 },
    { title: "Metal Tab Minimalist Dad Cap", cat: "Caps", price: 1599, pools: [11, 8], stock: 25 },
    { title: "Y2K Acid-Washed Curved Brim Cap", cat: "Caps", price: 1750, pools: [19, 5], stock: 6 },
    { title: "Cyber-Stitch Distressed Edge Cap", cat: "Caps", price: 1600, pools: [0, 11], stock: 14 },
    { title: "Grid-Weave Water Resistant Cap", cat: "Caps", price: 1950, pools: [4, 11], stock: 12 },
    { title: "Void Minimal Washed Bucket Hat", cat: "Caps", price: 1800, pools: [3, 11], stock: 10 },

    // Accessories
    { title: "Heavy Industrial chain Choker", cat: "Accessories", price: 2199, orig: 3500, pools: [13, 19], stock: 14 },
    { title: "Void Utility Crossbody Harness", cat: "Accessories", price: 3499, pools: [13, 4], stock: 7 },
    { title: "Static Distortion Steel Sunglasses", cat: "Accessories", price: 2899, orig: 4500, pools: [19, 6], stock: 3 },
    { title: "Tactical Webbing Belt w/ Metal Cobras", cat: "Accessories", price: 1999, pools: [13, 7], stock: 30 },
    { title: "Cyber-Hardware Key Hook Carabiner", cat: "Accessories", price: 1200, pools: [13, 0], stock: 45 },
    { title: "Archive Rib Knit Heavy Socks (2-Pack)", cat: "Accessories", price: 1100, pools: [14, 15], stock: 50 },
    { title: "Structured Leather Cardholder w/ D-Ring", cat: "Accessories", price: 2999, orig: 4900, pools: [13, 9], stock: 6 },
    { title: "Industrial Metal Accent Ring Set", cat: "Accessories", price: 1800, pools: [13, 1], stock: 19 },

    // Limited
    { title: "ARCHIVE-01 Heavy Distressed Hoodie", cat: "Limited", price: 7999, orig: 12900, pools: [1, 3], stock: 3, isLimited: true },
    { title: "ARCHIVE-02 Tactical Cargo Shell Set", cat: "Limited", price: 11999, orig: 18000, pools: [4, 7], stock: 1, isLimited: true },
    { title: "ARCHIVE-03 Hybrid Knit Tactical Vest", cat: "Limited", price: 6500, pools: [14, 4], stock: 5, isLimited: true },
    { title: "Y2K Decayed Cyber-Puffer Jacket", cat: "Limited", price: 8999, orig: 14000, pools: [0, 8], stock: 2, isLimited: true },
    { title: "Sulfur-Distressed Knit Sweater", cat: "Limited", price: 6999, pools: [14, 15], stock: 4, isLimited: true },
    { title: "Limited Heavy Stitch Leather Boots", cat: "Limited", price: 14999, orig: 22000, pools: [10, 11], stock: 2, isLimited: true }
  ];

  return names.map((item, index) => {
    const poolSelector = item.pools || [0, 1];
    const imagePrimary = IMG_POOL[poolSelector[0] % IMG_POOL.length];
    const imageHover = SECONDARY_IMG_POOL[poolSelector[1] % SECONDARY_IMG_POOL.length];

    const categoryConfig = categories[index % categories.length];
    const storyIndex = index % stories.length;

    // Create a robust product structure
    return {
      id: `BLANK-${100 + index}`,
      name: item.title,
      description: `${item.title} designed for the digital vanguard. Finished inside our heavy-industrial facility with customized details and unique tactile treatments. Built in restricted, traceable batches.`,
      price: item.price,
      originalPrice: item.orig,
      category: item.cat as any,
      vibes: categoryConfig.vibes,
      imagePrimary,
      imageHover,
      stock: item.stock,
      sizes: ['S', 'M', 'L', 'XL'],
      rating: +(4.5 + (index % 5) * 0.1).toFixed(1),
      reviewCount: 34 + (index * 7) % 150,
      story: stories[storyIndex],
      materials: materialsList[storyIndex],
      isLimited: item.isLimited || item.price > 6000
    };
  });
};

export const PRODUCTS = generateProducts();

export const TESTIMONIALS = [
  {
    id: 't-1',
    author: 'Samarth K.',
    role: 'Collector & Archival Enthusiast',
    rating: 5,
    verified: true,
    text: "BLANK SPACE has genuinely set the premium outerwear standard. The 460GSM loopback on the ARCHIVE-01 hoodie is structured, heavy, and sits perfectly boxy. I have never felt premium fabric matching this level in India.",
    date: "2026-05-18",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: 't-2',
    author: 'Ishaan S.',
    role: 'Vanguard Stylist',
    rating: 5,
    verified: true,
    text: "The Parachute Ripstop Cargos are pure architecture. Full customizable toggle mechanics let me alternate between baggy stacks and utility tapers. Outstanding delivery speed and elite industrial-inspired boxing.",
    date: "2026-04-29",
    avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: 't-3',
    author: 'Aanya M.',
    role: 'Creative Director',
    rating: 5,
    verified: true,
    text: "Was incredibly skeptical about UPI manual checkouts, but their verification was handled in 5 minutes flat! The Ghost Sound Tee captures real Y2K aesthetics and holds its vintage fade flawlessly after 10 washes. Instant order.",
    date: "2026-05-10",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: 't-4',
    author: 'Kabir V.',
    role: 'Sneakerhead & Streetwear Blogger',
    rating: 5,
    verified: true,
    text: "This brand doesn't sell templates; they sell culture. The aesthetic consistency in everything — from their interface, the packaging, down to the heavy custom-stamped zinc buttons is incredible. Fully recommended.",
    date: "2026-05-01",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
  }
];

export const INSTAGRAM_POSTS = [
  { id: 'ig-1', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop&q=80', likes: '1.4k', comments: '98' },
  { id: 'ig-2', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop&q=80', likes: '2.1k', comments: '142' },
  { id: 'ig-3', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=400&fit=crop&q=80', likes: '3.3k', comments: '210' },
  { id: 'ig-4', image: 'https://images.unsplash.com/photo-1618335829737-2228915674e0?w=400&h=400&fit=crop&q=80', likes: '940', comments: '44' },
  { id: 'ig-5', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=400&fit=crop&q=80', likes: '1.8k', comments: '87' },
  { id: 'ig-6', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&q=80', likes: '4.5k', comments: '302' },
];

export const ARCHIVE_COLLECTIONS = [
  {
    id: 'arch-01',
    name: 'Archive 01 / HEAVY INDUSTRIAL',
    releaseYear: '2026',
    status: 'LIVE' as const,
    description: 'Raw boxy weights, engineered steel rivets, loopback fibers. Our foundation piece series.',
    tag: 'LIMITED QUANTITY',
    bgImage: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200'
  },
  {
    id: 'arch-02',
    name: 'Archive 02 / RECONSTRUCTED APOCALYPSE',
    releaseYear: '2025',
    status: 'SOLD OUT' as const,
    description: 'Deconstructed military wear, sulfur wash distressed garments, and technical hardware detailing.',
    tag: '100% DEADSTOCK COVETED',
    bgImage: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200'
  },
  {
    id: 'arch-03',
    name: 'Archive 03 / CYBER VANGUARD',
    releaseYear: '2026 - FALL',
    status: 'COMING SOON' as const,
    description: 'High-density grid fabrics, integrated LED light-reflective fibers, and heat-molded geometric panels.',
    tag: 'RELEASING JUNE 30',
    bgImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1200'
  }
];
