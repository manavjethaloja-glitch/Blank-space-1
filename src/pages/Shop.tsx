import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { PRODUCTS } from '../data';
import { Heart, SlidersHorizontal, Grid2X2, Grid3X3, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Shop() {
  const {
    selectProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedVibe,
    setSelectedVibe
  } = useStore();

  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedVibe('All');
    setSearchQuery('');
  };

  // Categories list
  const categories = ['All', 'Oversized Tees', 'Shirts', 'Cargo', 'Caps', 'Accessories', 'Limited'];
  
  // Vibes list
  const vibes = ['All', 'Y2K', 'Vintage', 'Retro', 'Graphic', 'Limited'];

  // Filtering logic
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesVibe = selectedVibe === 'All' || product.vibes.includes(selectedVibe as any);
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.story.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesVibe && matchesSearch;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default (initial index position)
  });

  return (
    <div id="shop-page" className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none bg-grain text-left">
      
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-brand-border pb-8 mb-12">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-brand-charcoal tracking-[0.25em] uppercase">SYSTEM PRODUCT DIRECTORY</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-black tracking-tight leading-none font-normal uppercase">
            THE CATALOGUE
          </h1>
        </div>

        <div className="font-mono text-xs uppercase text-brand-charcoal tracking-widest shrink-0">
          INDEXING <span className="font-sans font-bold text-brand-black">{sortedProducts.length} OF {PRODUCTS.length}</span> PIECES IN VIEW
        </div>
      </div>

      {/* Grid of Categories and Vibes selection (Top Controls) */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
        
        {/* Left segment containing Category & Vibe list */}
        <div className="flex flex-col gap-5 flex-1 w-full">
          {/* Category Scroller */}
          <div className="flex flex-col gap-2 text-left">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-1">CATEGORIES:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  id={`filter-cat-${cat.replace(/\s+/g, '-')}`}
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 font-mono text-[11px] tracking-wider transition-all border ${
                    selectedCategory === cat
                      ? 'bg-brand-black border-brand-black text-brand-cream font-bold'
                      : 'bg-white border-brand-border text-brand-black hover:border-brand-black'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Vibe Scroller */}
          <div className="flex flex-col gap-2 text-left border-t border-brand-border/45 pt-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 mb-1">DESIGN ARCHIVE VIBE:</span>
            <div className="flex flex-wrap gap-2">
              {vibes.map((v) => (
                <button
                  id={`filter-vibe-${v}`}
                  key={v}
                  onClick={() => setSelectedVibe(v)}
                  className={`px-3 py-1.5 font-mono text-[11px] tracking-wider transition-all border ${
                    selectedVibe === v
                      ? 'bg-brand-black border-brand-black text-brand-cream font-bold'
                      : 'bg-white border-brand-border text-brand-black hover:border-brand-black'
                  }`}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right segment containing sorting and column selection */}
        <div className="flex flex-col sm:flex-row gap-6 items-stretch sm:items-end w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-6 lg:pt-0 border-brand-border">
          
          {/* Sorter Selector */}
          <div className="flex flex-col gap-2.5 text-left shrink-0 sm:w-56">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3 h-3" /> SORT ARCHIVE BY:
            </span>
            <select
              id="sort-select-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-brand-border px-3 py-2 font-mono text-xs tracking-wider uppercase text-brand-black focus:outline-none focus:border-brand-accent cursor-pointer self-stretch rounded-none"
            >
              <option value="default">DEFAULT SEQUENCING</option>
              <option value="price-asc">CURRENCY LOW-TO-HIGH</option>
              <option value="price-desc">CURRENCY HIGH-TO-LOW</option>
              <option value="rating">VERIFIED DESIRABILITY RAIT</option>
            </select>
          </div>

          {/* Grid column selection (Desktop only) */}
          <div className="hidden md:flex flex-col gap-2.5 text-left shrink-0">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">GRID VIEW COMPRES:</span>
            <div className="flex border border-brand-border bg-white overflow-hidden">
              {[2, 3, 4].map((cols) => (
                <button
                  key={cols}
                  onClick={() => setGridCols(cols as any)}
                  className={`p-2.5 border-r last:border-r-0 border-brand-border transition-colors ${
                    gridCols === cols ? 'bg-brand-black text-brand-cream' : 'text-zinc-400 hover:text-brand-black'
                  }`}
                  aria-label={`${cols} Grid Column view`}
                >
                  <span className="font-mono text-xs font-bold px-1">{cols}x{cols}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Filter Status Feedback Ticker */}
      {(searchQuery || selectedCategory !== 'All' || selectedVibe !== 'All') && (
        <div className="bg-brand-card/40 border border-brand-border p-4 mb-8 flex flex-wrap justify-between items-center gap-4 select-all">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-charcoal">
            <span>ACTIVE INDEX FILTER:</span>
            {searchQuery && (
              <span className="bg-brand-black text-brand-cream px-2 py-1 text-[10px] font-semibold">SEARCH: "{searchQuery}"</span>
            )}
            {selectedCategory !== 'All' && (
              <span className="bg-brand-black text-brand-cream px-2 py-1 text-[10px] font-semibold">CAT: {selectedCategory}</span>
            )}
            {selectedVibe !== 'All' && (
              <span className="bg-brand-black text-brand-cream px-2 py-1 text-[10px] font-semibold">VIBE: {selectedVibe}</span>
            )}
          </div>
          <button
            onClick={handleClearFilters}
            className="font-mono text-[10px] font-bold text-rose-600 hover:text-rose-800 transition-colors uppercase flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> REMOVE ALL CONFIGS
          </button>
        </div>
      )}

      {/* Actual Product Loop Grid */}
      {sortedProducts.length === 0 ? (
        <div className="py-24 border border-dashed border-brand-border text-center flex flex-col items-center justify-center gap-4">
          <span className="text-zinc-350 text-5xl font-serif">?</span>
          <p className="font-serif text-zinc-500 italic text-xl">No archive garments fit your filters.</p>
          <button
            onClick={handleClearFilters}
            className="text-xs font-mono uppercase tracking-widest border-b border-brand-black pb-0.5 mt-2 hover:text-brand-charcoal hover:border-brand-charcoal"
          >
            DISMISS SELECTION FILTER
          </button>
        </div>
      ) : (
        <div className={`grid grid-cols-2 ${gridCols === 2 ? 'md:grid-cols-2' : gridCols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12`}>
          {sortedProducts.map((product) => (
            <div
              id={`shop-item-${product.id}`}
              key={product.id}
              className="group flex flex-col justify-between"
            >
              <div className="flex flex-col gap-4">
                
                {/* Image framing and Hover overlays */}
                <div
                  className="relative h-80 sm:h-96 w-full overflow-hidden bg-brand-card border border-brand-border rounded-xl cursor-pointer"
                  onClick={() => selectProduct(product.id)}
                >
                  <img
                    src={product.imagePrimary}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-102 group-hover:opacity-0 transition-all duration-500 select-none"
                    loading="lazy"
                  />
                  <img
                    src={product.imageHover}
                    alt={`${product.name} alt angle`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:scale-102 group-hover:opacity-100 transition-all duration-500 select-none"
                    loading="lazy"
                  />

                  {/* Stock counter indicators on visual boundary */}
                  <div className="absolute top-4 left-4 z-10 select-none pointer-events-none">
                    {product.stock < 10 ? (
                      <span className="bg-rose-600 text-white text-[8px] font-mono font-bold px-2 py-0.5 tracking-wider uppercase shadow-md inline-block">
                        ONLY {product.stock} LEFT
                      </span>
                    ) : product.stock < 20 ? (
                      <span className="bg-brand-black text-brand-cream text-[8px] font-mono font-medium px-2 py-0.5 tracking-wider uppercase shadow-md inline-block">
                        LOW STOCK
                      </span>
                    ) : null}
                  </div>

                  {/* Quick checkout footer actions */}
                  <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 'L');
                      }}
                      className="w-full py-2.5 bg-brand-black/95 text-brand-cream font-mono text-[10px] sm:text-[11px] font-semibold tracking-widest hover:bg-brand-accent hover:text-brand-black transition-colors shadow-2xl border border-zinc-800 uppercase"
                    >
                      QUICK ALLOCATE (L)
                    </button>
                  </div>
                </div>

                {/* Subtext description parameters */}
                <div className="flex flex-col text-left gap-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      onClick={() => selectProduct(product.id)}
                      className="font-sans text-xs sm:text-sm font-semibold hover:opacity-75 cursor-pointer line-clamp-1 uppercase text-brand-black"
                    >
                      {product.name}
                    </h3>
                    
                    <button
                      id={`wishlist-shop-${product.id}`}
                      aria-label="Toggle Wishlist"
                      onClick={() => toggleWishlist(product.id)}
                      className="text-zinc-400 hover:text-rose-500 transition-colors shrink-0"
                    >
                      <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Description snippets */}
                  <p className="font-sans text-[11px] text-zinc-500 line-clamp-1">
                    {product.category} • {product.vibes.join(', ')}
                  </p>
                </div>

              </div>

              {/* Price bracket indicators */}
              <div className="flex justify-between items-baseline mt-3 border-t border-brand-border/45 pt-3">
                <span className="font-mono text-[9px] text-zinc-400 tracking-wider">ALLOCATION VALUE</span>
                <div className="flex items-center gap-2">
                  {product.originalPrice && (
                    <span className="font-mono text-xs line-through text-zinc-450">₹{product.originalPrice}</span>
                  )}
                  <span className="font-mono text-sm font-bold text-brand-black">₹{product.price}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
