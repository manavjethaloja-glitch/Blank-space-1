import React, { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { PRODUCTS, TESTIMONIALS } from '../data';
import { Button } from '../components/Navbar';
import { Heart, Star, CheckCircle, Truck, Package, RotateCcw, ShieldCheck, ShoppingBag, Eye, Copy, Check, X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductDetail() {
  const {
    selectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    recentlyViewed,
    selectProduct
  } = useStore();

  const product = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  const [selectedSize, setSelectedSize] = useState('M');
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'reviews'>('details');
  const [copiedId, setCopiedId] = useState(false);

  // Size guide modal state vars
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState('Oversized Tees');
  const [useMetric, setUseMetric] = useState(false); // false = inches, true = cm

  // Set default size and push view history, pre-fill size guide category matching product
  useEffect(() => {
    if (product) {
      setSelectedSize('M');
      if (['Oversized Tees', 'Shirts', 'Cargo', 'Caps', 'Accessories', 'Limited'].includes(product.category)) {
        setSizeGuideCategory(product.category);
      } else {
        setSizeGuideCategory('Oversized Tees');
      }
    }
  }, [product]);

  const handleCopyId = () => {
    if (product) {
      navigator.clipboard.writeText(product.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Safe filtered loop of products with id matching recently viewed list, excluding current product
  const recentProducts = PRODUCTS.filter(
    (p) => recentlyViewed.includes(p.id) && p.id !== product.id
  ).slice(0, 4);

  // Custom static reviews specific to this product
  const productReviews = TESTIMONIALS.slice(0, 3);

  // Stock status logic calculation
  // <20 LOW STOCK, <10 ONLY X LEFT, 0 OUT OF STOCK / SOLD OUT
  let stockBadgeColor = 'bg-brand-black text-brand-cream';
  let stockBadgeText = 'ALLOCATION ACTIVE';
  
  if (product.stock === 0) {
    stockBadgeColor = 'bg-red-100 text-red-700 border border-red-200';
    stockBadgeText = 'SOLD OUT DEFINITELY';
  } else if (product.stock < 10) {
    stockBadgeColor = 'bg-rose-550 text-white animate-pulse';
    stockBadgeText = `ONLY ${product.stock} PIECES LEFT`;
  } else if (product.stock < 20) {
    stockBadgeColor = 'bg-brand-accent text-brand-black';
    stockBadgeText = 'LOW STOCK ALLOCATED';
  }

  return (
    <div id="product-detail-page" className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-grain select-none text-left">
      
      {/* Upper breadcrumb */}
      <div className="flex justify-between items-center border-b border-brand-border pb-5 mb-10 text-xs font-mono uppercase tracking-widest text-brand-charcoal">
        <div className="flex gap-2.5 items-center">
          <span className="cursor-pointer hover:text-brand-black" onClick={() => selectProduct(PRODUCTS[0].id)}>CATALOGUE</span>
          <span>/</span>
          <span className="text-zinc-400">{product.category}</span>
          <span>/</span>
          <span className="text-brand-black font-semibold">{product.name}</span>
        </div>

        <button
          onClick={handleCopyId}
          className="hover:text-brand-black transition-colors flex items-center gap-1.5 cursor-pointer bg-brand-cream border border-brand-border px-2.5 py-1 text-[10px]"
        >
          {copiedId ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" /> ID COPIED
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> ID: {product.id}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left Column: Premium Gallery with hover zoom */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative h-[55vh] sm:h-[70vh] w-full overflow-hidden bg-brand-card border border-brand-border rounded-2xl group">
            
            {/* Absolute overlay elements */}
            <div className="absolute top-6 left-6 z-10 select-none pointer-events-none flex flex-col gap-2">
              <span className={`px-3 py-1 font-mono text-[9px] font-bold tracking-[0.15em] uppercase shadow-lg ${stockBadgeColor}`}>
                {stockBadgeText}
              </span>
              {product.isLimited && (
                <span className="bg-brand-black text-white px-2.5 py-1 font-mono text-[8px] tracking-[0.16em] uppercase shadow-md font-semibold self-start">
                  DEADSTOCK ARCHIVE SPECIAL
                </span>
              )}
            </div>

            <img
              src={product.imagePrimary}
              alt={product.name}
              className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-500 select-none"
            />
            <img
              src={product.imageHover}
              alt={`${product.name} alternate posture`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 select-none"
            />

            {/* Hint overlay */}
            <div className="absolute bottom-5 right-5 z-10 font-mono text-[9px] tracking-widest bg-brand-black/40 text-brand-cream px-2 py-1 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> HOVER TO FLIP GRAPHIC VIEW
            </div>
          </div>

          {/* Sub description indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-brand-border bg-brand-card/25 p-4 rounded-xl flex items-center gap-3">
              <Package className="w-5 h-5 text-brand-accent shrink-0" />
              <div className="text-left font-mono">
                <span className="text-[9px] text-zinc-500 block uppercase">GARMENT CLASSIFICATION</span>
                <span className="text-xs text-brand-black font-semibold uppercase">{product.category}</span>
              </div>
            </div>
            <div className="border border-brand-border bg-brand-card/25 p-4 rounded-xl flex items-center gap-3">
              <Eye className="w-5 h-5 text-brand-accent shrink-0" />
              <div className="text-left font-mono">
                <span className="text-[9px] text-zinc-500 block uppercase">ARCHIVAL VIBE</span>
                <span className="text-xs text-brand-black font-semibold uppercase">{product.vibes.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Options details story */}
        <div className="lg:col-span-5 flex flex-col justify-between text-left gap-8 py-2">
          
          <div className="flex flex-col gap-6">

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-zinc-500 font-mono text-[10px] ml-1 uppercase">({product.reviewCount} VERIFIED CHECKS)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-brand-black tracking-tight leading-tight uppercase font-medium">
                {product.name}
              </h1>
              
              <div className="flex gap-4 items-baseline border-b border-brand-border/60 pb-5 mt-2">
                <span className="font-serif text-3xl font-semibold">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="font-mono text-base line-through text-zinc-400">₹{product.originalPrice}</span>
                )}
              </div>
            </div>

            {/* Sizing Control Block */}
            <div className="flex flex-col gap-3.5 text-left">
              <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-bold">ARMOR SIZE:</span>
                  <button
                    id="size-guide-modal-trigger"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-brand-accent hover:text-brand-black transition-all font-semibold uppercase border-b border-dashed border-brand-accent hover:border-brand-black pb-0.5 cursor-pointer text-[10px]"
                    type="button"
                  >
                    [ SIZE GUIDE ]
                  </button>
                </div>
                <span className="text-brand-accent font-semibold flex items-center gap-1 font-sans">
                  <CheckCircle className="w-3.5 h-3.5 text-brand-accent" /> standard boxy fit applies
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {product.sizes.map((sz) => (
                  <button
                    id={`detail-size-${sz}`}
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3.5 font-mono text-xs font-semibold tracking-wide transition-all border ${
                      selectedSize === sz
                        ? 'bg-brand-black border-brand-black text-brand-cream font-bold'
                        : 'bg-white border-brand-border text-brand-black hover:border-brand-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Shipping details preview banner */}
            <div className="border border-zinc-200 bg-brand-cream/60 p-4 rounded-xl flex flex-col gap-3 font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
              <div className="flex justify-between">
                <span>AVAILABILITY INDEX:</span>
                <span className="text-brand-black font-semibold font-sans text-xs">READY TO PRIORITY DESPATCH</span>
              </div>
              <div className="flex justify-between">
                <span>ESTIMATED HYD TRANSIT:</span>
                <span className="text-brand-black font-semibold font-sans text-xs">2-4 BUSINESS DAYS</span>
              </div>
            </div>

            {/* Dynamic Tabs Block */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex border-b border-brand-border">
                {['details', 'materials', 'reviews'].map((tb) => (
                  <button
                    key={tb}
                    onClick={() => setActiveTab(tb as any)}
                    className={`flex-1 py-3 font-mono text-[10px] sm:text-xs tracking-widest uppercase text-center border-b-2 font-medium cursor-pointer ${
                      activeTab === tb
                        ? 'border-brand-black text-brand-black font-semibold'
                        : 'border-transparent text-zinc-400 hover:text-brand-black'
                    }`}
                  >
                    {tb}
                  </button>
                ))}
              </div>

              {/* Dynamic tab contents rendering */}
              <div className="min-h-32 text-xs leading-relaxed text-brand-charcoal text-left py-2 font-sans">
                {activeTab === 'details' && (
                  <div className="flex flex-col gap-3">
                    <p>{product.description}</p>
                    <p className="font-sans text-xs italic mt-2 text-zinc-500">
                      "Archives Reborn for Now is a product story detailing heavy physical treatments, garment washing variables, and durable stitch construction."
                    </p>
                  </div>
                )}
                {activeTab === 'materials' && (
                  <ul className="flex flex-col gap-2.5">
                    {product.materials.map((m, idx) => (
                      <li key={idx} className="flex items-center gap-2 font-mono text-[11px] text-brand-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                        {m.toUpperCase()}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'reviews' && (
                  <div className="flex flex-col gap-4 max-h-56 overflow-y-auto pr-1">
                    {productReviews.map((rev) => (
                      <div key={rev.id} className="border-b border-brand-border/45 pb-3 last:border-b-0">
                        <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                          <span className="text-brand-black font-bold uppercase">{rev.author}</span>
                          <span className="text-zinc-500">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-amber-500 gap-0.5 mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-[11px] leading-relaxed italic">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Large CTA panel strip */}
          <div className="flex flex-col gap-4 border-t border-brand-border pt-6 mt-4">
            
            <div className="flex gap-3">
              <Button
                id="details-add-to-cart-btn"
                variant="dark"
                size="lg"
                onClick={() => addToCart(product, selectedSize)}
                className="flex-1 flex justify-center items-center gap-3 relative py-4"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>OWN THE DROP</span>
              </Button>
              <button
                id="details-toggle-wishlist-btn"
                aria-label="Wishlist toggle"
                onClick={() => toggleWishlist(product.id)}
                className="p-4 border border-brand-black hover:bg-zinc-50 flex items-center justify-center transition-colors group"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : 'text-brand-black'} group-hover:scale-110 duration-200`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center border-t border-brand-border/45 pt-4">
              <div className="flex flex-col items-center gap-1 font-mono text-[8.5px] text-zinc-500 leading-none">
                <Truck className="w-4 h-4 text-brand-accent mb-0.5" /> FREE DELIVERY &gt; ₹1499
              </div>
              <div className="flex flex-col items-center gap-1 font-mono text-[8.5px] text-zinc-500 leading-none">
                <ShieldCheck className="w-4 h-4 text-brand-accent mb-0.5" /> PRIVACY GUARANTEED
              </div>
              <div className="flex flex-col items-center gap-1 font-mono text-[8.5px] text-zinc-500 leading-none">
                <RotateCcw className="w-4 h-4 text-brand-accent mb-0.5" /> 7 DAY FREE RETURNS
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Recently Viewed Carousel Segment below if exists */}
      {recentProducts.length > 0 && (
        <div className="mt-28 border-t border-brand-border pt-16">
          <h2 className="font-serif text-2xl tracking-tight uppercase mb-10 text-brand-black">
            YOUR RECENT SECURED HISTORY
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((p) => (
              <div
                id={`recent-view-${p.id}`}
                key={p.id}
                onClick={() => selectProduct(p.id)}
                className="cursor-pointer border border-brand-border p-3 flex flex-col justify-between hover:border-brand-accent transition-all bg-white rounded-xl shadow-sm"
              >
                <img src={p.imagePrimary} alt={p.name} className="w-full h-64 object-cover border border-brand-border" />
                <div className="flex justify-between items-baseline mt-3">
                  <span className="font-sans text-xs font-bold uppercase truncate pr-2 flex-1">{p.name}</span>
                  <span className="font-mono text-xs font-semibold">₹{p.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparative Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
              id="size-guide-backdrop"
            />

            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-2xl bg-white border border-brand-border overflow-hidden shadow-2xl z-10 flex flex-col rounded-2xl text-left"
              id="size-guide-modal-content"
            >
              {/* Corner aesthetics markers */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#C8B8A3]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#C8B8A3]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#C8B8A3]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#C8B8A3]" />

              {/* Close Button top-right */}
              <button
                id="size-guide-close-btn"
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-4 right-4 text-zinc-405 hover:text-brand-black transition-colors p-1.5 hover:bg-zinc-100 rounded-full cursor-pointer z-20"
                aria-label="Close size guide"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="bg-[#F8F6F2] px-6 py-5 border-b border-brand-border flex items-center gap-3">
                <Ruler className="w-5 h-5 text-brand-accent shrink-0" />
                <div>
                  <h3 className="font-serif text-lg text-brand-black uppercase tracking-tight font-semibold">
                    MEASUREMENT SPECIFICATION MATRIX
                  </h3>
                  <p className="font-mono text-[9px] text-[#6B6864] uppercase tracking-widest mt-0.5">
                    Comparative guide for optimal streetwear silhouetting
                  </p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6">
                
                {/* Category selectors and Unit toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border pb-4">
                  
                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-1">
                    {['Oversized Tees', 'Shirts', 'Cargo', 'Caps', 'Accessories'].map((cat) => (
                      <button
                        key={cat}
                        id={`size-guide-tab-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => setSizeGuideCategory(cat)}
                        className={`px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase border transition-all cursor-pointer ${
                          sizeGuideCategory === cat
                            ? 'bg-brand-black border-brand-black text-brand-cream font-bold'
                            : 'bg-white border-brand-border text-[#6B6864] hover:text-brand-black hover:border-brand-black'
                        }`}
                        type="button"
                      >
                        {cat === 'Oversized Tees' ? 'Tees & Tops' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Sleek Unit Toggle */}
                  <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg border border-brand-border self-end sm:self-auto font-mono text-[9px] font-bold">
                    <button
                      type="button"
                      onClick={() => setUseMetric(false)}
                      className={`px-2.5 py-1 tracking-wider uppercase transition-all cursor-pointer ${
                        !useMetric ? 'bg-white text-brand-black shadow-sm' : 'text-zinc-400 hover:text-brand-black'
                      }`}
                    >
                      INCHES
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseMetric(true)}
                      className={`px-2.5 py-1 tracking-wider uppercase transition-all cursor-pointer ${
                        useMetric ? 'bg-white text-brand-black shadow-sm' : 'text-zinc-400 hover:text-brand-black'
                      }`}
                    >
                      CM
                    </button>
                  </div>

                </div>

                {/* Measurement Table display */}
                <div className="border border-brand-border shadow-inner bg-white overflow-x-auto">
                  {/* Tops (Oversized Tees / Limited) */}
                  {(sizeGuideCategory === 'Oversized Tees' || sizeGuideCategory === 'Limited') && (
                    <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[400px]">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-brand-border">
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">ARMOR SIZE</th>
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">CHEST WIDTH</th>
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">GARMENT LENGTH</th>
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">SHOULDER WIDTH</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-100 hover:bg-zinc-50/50">
                          <td className="p-3.5 font-extrabold text-brand-black">S</td>
                          <td className="p-3.5">{useMetric ? '111.7 cm' : '44.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '71.1 cm' : '28.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '53.3 cm' : '21.0 in'}</td>
                        </tr>
                        <tr className="border-b border-zinc-100 hover:bg-zinc-50/50 bg-zinc-50/20">
                          <td className="p-3.5 font-extrabold text-brand-black">M (Default)</td>
                          <td className="p-3.5">{useMetric ? '116.8 cm' : '46.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '73.6 cm' : '29.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '55.8 cm' : '22.0 in'}</td>
                        </tr>
                        <tr className="border-b border-zinc-100 hover:bg-zinc-50/50">
                          <td className="p-3.5 font-extrabold text-brand-black">L</td>
                          <td className="p-3.5">{useMetric ? '121.9 cm' : '48.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '76.2 cm' : '30.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '57.1 cm' : '22.5 in'}</td>
                        </tr>
                        <tr className="hover:bg-zinc-50/50">
                          <td className="p-3.5 font-extrabold text-brand-black">XL</td>
                          <td className="p-3.5">{useMetric ? '127.0 cm' : '50.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '78.7 cm' : '31.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '59.7 cm' : '23.5 in'}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {/* Shirts */}
                  {sizeGuideCategory === 'Shirts' && (
                    <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[400px]">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-brand-border">
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">ARMOR SIZE</th>
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">CHEST WIDTH</th>
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">CENTRAL LENGTH</th>
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">SLEEVE LENGTH</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-100 hover:bg-zinc-50/50">
                          <td className="p-3.5 font-extrabold text-brand-black">S</td>
                          <td className="p-3.5">{useMetric ? '106.6 cm' : '42.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '69.8 cm' : '27.5 in'}</td>
                          <td className="p-3.5">{useMetric ? '25.4 cm' : '10.0 in'}</td>
                        </tr>
                        <tr className="border-b border-zinc-100 hover:bg-zinc-50/50 bg-zinc-50/20">
                          <td className="p-3.5 font-extrabold text-brand-black">M</td>
                          <td className="p-3.5">{useMetric ? '111.7 cm' : '44.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '72.3 cm' : '28.5 in'}</td>
                          <td className="p-3.5">{useMetric ? '26.6 cm' : '10.5 in'}</td>
                        </tr>
                        <tr className="border-b border-zinc-100 hover:bg-zinc-50/50">
                          <td className="p-3.5 font-extrabold text-brand-black">L</td>
                          <td className="p-3.5">{useMetric ? '116.8 cm' : '46.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '74.9 cm' : '29.5 in'}</td>
                          <td className="p-3.5">{useMetric ? '27.9 cm' : '11.0 in'}</td>
                        </tr>
                        <tr className="hover:bg-zinc-50/50">
                          <td className="p-3.5 font-extrabold text-brand-black">XL</td>
                          <td className="p-3.5">{useMetric ? '121.9 cm' : '48.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '77.4 cm' : '30.5 in'}</td>
                          <td className="p-3.5">{useMetric ? '29.2 cm' : '11.5 in'}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {/* Cargo */}
                  {sizeGuideCategory === 'Cargo' && (
                    <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[400px]">
                      <thead>
                        <tr className="bg-zinc-50 border-b border-brand-border">
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">ARMOR SIZE</th>
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">WAIST SIZE</th>
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">INSEAM LENGTH</th>
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">OUTSEAM LENGTH</th>
                          <th className="p-3.5 font-bold text-zinc-500 uppercase">LEG OPENING</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-100 hover:bg-zinc-50/50">
                          <td className="p-3.5 font-extrabold text-brand-black">S (30)</td>
                          <td className="p-3.5">{useMetric ? '76.2 cm' : '30.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '76.2 cm' : '30.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '102.8 cm' : '40.5 in'}</td>
                          <td className="p-3.5">{useMetric ? '49.5 cm' : '19.5 in'}</td>
                        </tr>
                        <tr className="border-b border-zinc-100 hover:bg-zinc-50/50 bg-zinc-50/20">
                          <td className="p-3.5 font-extrabold text-brand-black">M (32)</td>
                          <td className="p-3.5">{useMetric ? '81.2 cm' : '32.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '77.4 cm' : '30.5 in'}</td>
                          <td className="p-3.5">{useMetric ? '104.1 cm' : '41.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '50.8 cm' : '20.0 in'}</td>
                        </tr>
                        <tr className="border-b border-zinc-100 hover:bg-zinc-50/50">
                          <td className="p-3.5 font-extrabold text-brand-black">L (34)</td>
                          <td className="p-3.5">{useMetric ? '86.3 cm' : '34.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '78.7 cm' : '31.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '106.6 cm' : '42.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '52.0 cm' : '20.5 in'}</td>
                        </tr>
                        <tr className="hover:bg-zinc-50/50">
                          <td className="p-3.5 font-extrabold text-brand-black">XL (36)</td>
                          <td className="p-3.5">{useMetric ? '91.4 cm' : '36.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '80.0 cm' : '31.5 in'}</td>
                          <td className="p-3.5">{useMetric ? '109.2 cm' : '43.0 in'}</td>
                          <td className="p-3.5">{useMetric ? '53.3 cm' : '21.0 in'}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {/* Caps */}
                  {sizeGuideCategory === 'Caps' && (
                    <div className="p-6 text-center text-zinc-500 font-mono text-xs flex flex-col gap-3 py-10">
                      <p className="font-extrabold text-brand-black text-sm uppercase">ONE SIZE (OS) COVERS ALL MATRIX PANELS</p>
                      <p className="uppercase leading-relaxed max-w-md mx-auto">
                        Adjusts incrementally from <span className="text-brand-black font-semibold">{useMetric ? '54.0 cm' : '21.2 in'}</span> to <span className="text-brand-black font-semibold">{useMetric ? '61.0 cm' : '24.0 in'}</span> circumference via our dual snap gunmetal structural strap mechanism.
                      </p>
                    </div>
                  )}

                  {/* Accessories */}
                  {sizeGuideCategory === 'Accessories' && (
                    <div className="p-6 text-center text-zinc-500 font-mono text-xs flex flex-col gap-3 py-10">
                      <p className="font-extrabold text-brand-black text-sm uppercase">UNIVERSAL WEAPONRY ACCESSORIES SIZE</p>
                      <p className="uppercase leading-relaxed max-w-sm mx-auto">
                        Modular locks and custom strap configurations fit all active streetwear profiles seamlessly without physical constraint.
                      </p>
                    </div>
                  )}
                </div>

                {/* Aesthetic Tips: How to Measure */}
                <div className="bg-[#F8F6F2]/30 border border-brand-border p-4 font-sans text-left rounded-xl">
                  <h4 className="font-serif text-xs text-brand-black font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping" />
                    CHEST & FIT ALIGNMENT STRATEGY
                  </h4>
                  <ul className="flex flex-col gap-2 font-mono text-[9.5px] uppercase tracking-wide text-[#6B6864] list-disc list-inside">
                    <li><strong className="text-brand-black">CHEST WIDTH:</strong> Measure around the fullest area of your chest horizontally, holding the tape snug but uncompressed.</li>
                    <li><strong className="text-brand-black">Oversized Design:</strong> This garment features an intended relaxed, boxy posture, dropping at the shoulders. Pick your true size for a clean look, or size down for standard proportions.</li>
                    <li>Not sure of your size? Reach out to support or prioritize standard medium (M) parameters for general collector compliance.</li>
                  </ul>
                </div>

              </div>

              {/* Close CTAs Footer */}
              <div className="border-t border-brand-border px-6 py-4 flex justify-between items-center bg-zinc-50">
                <span className="font-mono text-[8.5px] text-[#6B6864] uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-accent animate-pulse" /> METALLIC ENVELOPE SECURE PROTOCOL
                </span>
                <button
                  id="size-guide-modal-close-bottom"
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="px-5 py-2.5 bg-brand-black hover:bg-brand-black/90 text-brand-cream font-mono text-[10px] uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-none"
                  type="button"
                >
                  DISMISS METRIC MATRIX
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
