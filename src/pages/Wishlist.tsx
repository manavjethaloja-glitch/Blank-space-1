import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { PRODUCTS } from '../data';
import { Button } from '../components/Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Wishlist() {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    selectProduct,
    navigateTo
  } = useStore();

  // Local size selection tracking for each item, defaulting to first available or 'M'
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  // Match wishlist IDs against full static products database
  const wishlistedItems = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleAddToCart = (product: any) => {
    const size = selectedSizes[product.id] || product.sizes[0] || 'M';
    addToCart(product, size);
  };

  const handleClearAll = () => {
    // Clear whole wishlist by toggling off each id
    wishlist.forEach((id) => {
      toggleWishlist(id);
    });
  };

  return (
    <div
      id="wishlist-page"
      className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none bg-grain text-left"
    >
      {/* Editorial Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-brand-border pb-8 mb-12">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-brand-charcoal tracking-[0.25em] uppercase">COLLECTOR SPECIFIC STORAGE</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-black tracking-tight leading-none font-normal uppercase">
            MY WISHLIST
          </h1>
        </div>

        <div className="font-mono text-xs uppercase text-brand-charcoal tracking-widest shrink-0">
          SECURED LOCKER <span className="font-sans font-bold text-brand-black">{wishlistedItems.length} OF {PRODUCTS.length}</span> ENSEMBLES
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {wishlistedItems.length === 0 ? (
          /* Empty Locker State with elegant design and quick CTA link */
          <motion.div
            key="empty-wishlist"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="py-24 border border-dashed border-brand-border text-center flex flex-col items-center justify-center gap-6"
          >
            <div className="relative w-16 h-16 flex items-center justify-center border border-brand-border rounded-full bg-white text-zinc-350">
              <Heart className="w-6 h-6 text-zinc-300" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            </div>
            
            <div className="flex flex-col gap-2 max-w-md">
              <h2 className="font-serif text-xl sm:text-2xl text-brand-black uppercase tracking-tight">
                No designs registered to index
              </h2>
              <p className="font-sans text-xs text-zinc-500 leading-relaxed uppercase tracking-wide">
                Your personal allocation ledger is empty. Explore exclusive garments, limited editions, and futuristic cargo sets to complete your profile.
              </p>
            </div>

            <button
              id="empty-wishlist-explore-btn"
              onClick={() => navigateTo('shop')}
              className="mt-4 px-6 py-3 bg-brand-black text-white hover:bg-[#111111]/90 font-mono text-[10px] sm:text-[11.5px] font-semibold tracking-widest uppercase transition-all flex items-center gap-2 rounded-none cursor-pointer"
            >
              DECRYPT CORE CATALOGUE <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </motion.div>
        ) : (
          <div key="active-wishlist" className="flex flex-col gap-8">
            
            {/* Quick action utility bar */}
            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest pb-3 border-b border-brand-border/45">
              <span className="text-zinc-500">SORT BY ACTIVE PRIORITY STATUS</span>
              <button
                id="wishlist-clear-all-btn"
                onClick={handleClearAll}
                className="text-rose-600 hover:text-rose-800 transition-colors uppercase font-bold flex items-center gap-1.5 cursor-pointer text-[10px]"
              >
                <Trash2 className="w-3.5 h-3.5" /> PURGE ENTIRE LEDGER
              </button>
            </div>

            {/* Comprehensive wishlist items layout (Adaptive Grid / List hybrid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedItems.map((product) => {
                const currentSelectedSize = selectedSizes[product.id] || product.sizes[0] || 'M';
                
                return (
                  <motion.div
                    id={`wishlist-garment-${product.id}`}
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    className="border border-brand-border bg-white flex flex-col justify-between group h-full relative"
                  >
                    {/* Corner aesthetics markers */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E0DDD8]" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#E0DDD8]" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#E0DDD8]" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#E0DDD8]" />

                    <div className="p-4 sm:p-5 flex flex-col gap-4">
                      {/* Image Thumbnail & Header controls */}
                      <div className="relative h-64 w-full overflow-hidden bg-brand-card border border-brand-border">
                        <img
                          src={product.imagePrimary}
                          alt={product.name}
                          onClick={() => selectProduct(product.id)}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 cursor-pointer select-none"
                          loading="lazy"
                        />
                        
                        {/* Remove from wishlist floating button */}
                        <button
                          id={`wishlist-remove-${product.id}`}
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-3 right-3 bg-white/70 backdrop-blur-md p-2 hover:bg-white text-rose-500 rounded-full transition-all shadow-md cursor-pointer border border-[#E0DDD8]"
                          title="Remove from Ledger"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Limited / Stock Alerts */}
                        <div className="absolute bottom-3 left-3 select-none pointer-events-none">
                          {product.isLimited && (
                            <span className="bg-brand-black text-brand-cream text-[8px] font-mono tracking-widest uppercase px-1.5 py-0.5 inline-block font-bold">
                              LIMITED RELEASE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product identity details */}
                      <div className="flex flex-col gap-1 text-left">
                        <span className="font-mono text-[9px] text-[#6B6864] uppercase tracking-wider">
                          {product.category}
                        </span>
                        <h3
                          onClick={() => selectProduct(product.id)}
                          className="font-serif text-lg text-brand-black hover:opacity-85 transition-opacity cursor-pointer leading-snug line-clamp-1 uppercase"
                        >
                          {product.name}
                        </h3>
                        
                        <div className="flex justify-between items-baseline mt-1">
                          <span className="font-mono text-[9.5px] text-[#6B6864] uppercase tracking-widest">EXCHANGE INDEX</span>
                          <div className="flex items-center gap-2 font-mono">
                            {product.originalPrice && (
                              <span className="text-xs line-through text-zinc-400">₹{product.originalPrice}</span>
                            )}
                            <span className="text-sm font-bold text-brand-black">₹{product.price}</span>
                          </div>
                        </div>
                      </div>

                      {/* SIZE CONFIGURATION MATRIX (Added product sizes seen here) */}
                      <div className="border-t border-brand-border/45 pt-4 text-left">
                        <label className="font-mono text-[9px] text-[#6B6864] uppercase tracking-[0.15em] block mb-2 font-semibold">
                          SELECT SECURED FIT:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {product.sizes.map((size: string) => {
                            const isSelected = currentSelectedSize === size;
                            return (
                              <button
                                id={`wishlist-size-${product.id}-${size}`}
                                key={size}
                                onClick={() => handleSizeSelect(product.id, size)}
                                className={`h-8 min-w-8 px-2.5 font-mono text-[10px] tracking-wider transition-all border flex items-center justify-center cursor-pointer ${
                                  isSelected
                                    ? 'bg-brand-black border-brand-black text-brand-cream font-extrabold'
                                    : 'bg-white border-brand-border text-brand-black hover:border-brand-black'
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* ACTION AREA: Add to Cart button */}
                    <div className="p-4 sm:p-5 pt-0 border-t border-brand-border/30 mt-auto bg-brand-cream/10">
                      <button
                        id={`wishlist-add-to-cart-${product.id}`}
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-brand-black hover:bg-brand-accent hover:text-brand-black text-brand-cream py-3 font-mono text-[10.5px] font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 border border-brand-black cursor-pointer shadow-sm hover:translate-y-[-1px] active:translate-y-[1px]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        MOVE TO CARGO [{currentSelectedSize}]
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </div>

            {/* Bottom ledger info */}
            <div className="mt-8 pt-8 border-t border-[#E0DDD8] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-[#6B6864]">
              <div className="flex items-center gap-2 leading-relaxed uppercase max-w-xl text-left">
                <ShieldCheck className="w-5 h-5 text-[#C8B8A3] shrink-0" />
                <span>Synchronized ledger secure storage block. Wishlisted apparel parameters are reserved on device client indices pending cart checkout allocation.</span>
              </div>
              
              <button
                id="wishlist-back-to-shop-btn"
                onClick={() => navigateTo('shop')}
                className="hover:text-[#111111] transition-all uppercase tracking-widest font-bold border-b border-dashed border-[#C8B8A3] hover:border-[#111111] pb-0.5 cursor-pointer text-[10.5px]"
              >
                RETURN TO CATALOGUE DIRECTORY
              </button>
            </div>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
