import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../components/Navbar';
import { PRODUCTS, TESTIMONIALS, INSTAGRAM_POSTS, ARCHIVE_COLLECTIONS } from '../data';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import SpaceAI from '../components/SpaceAI';
import BottomNav from '../components/BottomNav';
import DropCountdown from '../components/DropCountdown';
import { Sparkles, Heart, ArrowRight, ArrowLeft, Star, ChevronLeft, ChevronRight, CheckCircle2, Shield, Truck, RotateCcw } from 'lucide-react';

type HomeProps = {
  onShop: () => void;
  onArchive: () => void;
  onCart: () => void;
  onWishlist: () => void;
};

export default function Home({
  onShop,
  onArchive,
  onCart,
  onWishlist,
}: HomeProps) {
  const navigateTo = (page: string) => {
  if (page === "shop") onShop();
  if (page === "archive") onArchive();
  if (page === "wishlist") onWishlist();
};

  const selectProduct = (id: string) => {
    console.log("selected product:", id);
  };

  const addToCart = (product: any, size?: string) => {
  onCart();
};

  const toggleWishlist = (id: string) => {
  onWishlist();
};

  const isInWishlist = (id: string) => false;

  const setSelectedVibe = (vibe: string) => {
    console.log("vibe:", vibe);
  };

  const setSelectedCategory = (category: string) => {
    console.log("category:", category);
  };

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Parallax ref for hero image
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Showcase a select limited-run hero product (e.g., ARCHIVE-01 Heavy Distressed Hoodie)
  const featuredProduct = PRODUCTS.find((p) => p.id === 'BLANK-144') || PRODUCTS[4]; // Let's use Archive 01 Distressed Hoodie
  const [featuredSelectedSize, setFeaturedSelectedSize] = useState('M');

  // Filter 6 hot items for the "New Drop" slider
  const newDropItems = PRODUCTS.filter((p) => p.isLimited || p.stock < 10).slice(0, 6);

  // Slider controls for New Drop Scroll
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmt = 400;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmt : scrollAmt,
        behavior: 'smooth'
      });
    }
  };

  const handleVibeClick = (vibe: string) => {
    setSelectedVibe(vibe);
    setSelectedCategory('All');
    navigateTo('shop');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div id="home-page" className="select-none bg-grain pb-12">
      
      {/* 04 — fullscreen EDITORIAL HERO */}
      <section
        id="hero-campaign-section"
        ref={heroRef}
        className="min-h-screen relative flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 pt-32 pb-16 max-w-7xl mx-auto overflow-hidden text-brand-black"
      >
        {/* Left column (Text & Copy) */}
        <div className="flex-1 max-w-2xl flex flex-col gap-8 text-left z-10 md:pr-12">
          
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs text-brand-charcoal tracking-[0.3em] uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
              ARCHIVAL RELEASES IN SESSION
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif text-brand-black tracking-tight leading-[0.95] font-normal">
              ARCHIVES REBORN <br />
              <span className="font-light italic text-brand-charcoal">FOR NOW.</span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-brand-charcoal leading-relaxed max-w-lg mt-3">
              Limited-run vintage-engineered garments inspired by forgotten physical subculture archives and customized with heavy raw modern materials. Built once. Never restocked.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mt-2">
            <Button
              id="hero-cta-own-drop"
              variant="dark"
              size="lg"
              onClick={() => navigateTo('shop')}
              className="flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <span>OWN THE DROP</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Button>
            <Button
              id="hero-cta-create-style"
              variant="outline"
              size="lg"
              onClick={() => { window.location.hash = '#/style-dna'; window.location.reload(); }}
              className="border-brand-border"
            >
              Create Your Style
            </Button>
            <Button
              id="hero-cta-view-archive"
              variant="outline"
              size="lg"
              onClick={() => navigateTo('archive')}
              className="border-brand-border"
            >
              VIEW ARCHIVE
            </Button>
          </div>

          {/* Social Social-Proof Panel */}
          <div className="flex items-center gap-4 border-t border-brand-border pt-6 mt-4">
            <div className="flex -space-x-2.5">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50"
              ].map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`Collector-${i}`}
                  className="w-8 h-8 rounded-full border border-brand-cream object-cover shrink-0"
                />
              ))}
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center text-amber-500 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-mono text-[10px] text-brand-charcoal uppercase tracking-widest mt-1">
                <span className="text-brand-black font-semibold font-sans">2,400+ COLLECTORS</span> TRUST THE SYSTEM
              </span>
            </div>
          </div>

        </div>

        {/* Right column (Visuals) */}
        <div className="flex-1 w-full mt-12 md:mt-0 relative flex items-center justify-center h-[50vh] md:h-[70vh]">
          {/* Big backdrop shape representing container cards */}
          <div className="absolute inset-0 bg-brand-card rounded-3xl -rotate-1 scale-95 border border-brand-border/40 select-none pointer-events-none" />
          
          {/* Parallax container containing main model and products */}
          <div className="relative w-full h-full flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[90%] h-[90%] rounded-2xl overflow-hidden border border-brand-border bg-neutral-200 shadow-md group"
            >
              <img
                src="https://images.unsplash.com/photo-1618335829737-2228915674e0?w=1000&auto=format&fit=crop&q=80"
                alt="BLANK SPACE Streetwear Look"
                className="w-full h-full object-cover group-hover:scale-105 duration-700 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Overlay Label on Image */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white select-none">
                <div className="flex flex-col text-left gap-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-accent">featured drop</span>
                  <span className="font-serif text-xl tracking-wide uppercase font-semibold">GHOST INDUSTRIAL HOOD</span>
                </div>
                <button
                  onClick={() => selectProduct('BLANK-144')}
                  className="p-3 bg-brand-cream text-brand-black hover:bg-brand-accent transition-all hover:scale-105 rounded-full shadow-lg"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Float Badge/Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute -bottom-2 -left-2 sm:bottom-12 sm:left-4 bg-brand-cream border border-brand-border/80 p-4 shadow-xl flex items-center gap-3 backdrop-blur-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=120"
                alt="Cyber-Puffer look"
                className="w-11 h-11 object-cover border border-brand-border bg-brand-card"
              />
              <div className="flex flex-col text-left gap-0.5">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">RARE STOCK LIMIT</span>
                <span className="text-rose-600 font-bold text-xs font-mono">ONLY 3 PIECES REMAIN</span>
                <span className="text-[10px] text-zinc-700 uppercase">Y2K CYBER-PUFFER</span>
              </div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* 05 — SHOP BY VIBE */}
      <section id="shop-by-vibe-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-brand-border">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="font-mono text-xs text-brand-charcoal tracking-[0.25em] uppercase">CURATED PERSPECTIVES</span>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-black tracking-tight leading-none font-normal">
            SHOP BY ARCHIVAL VIBE
          </h2>
          <div className="w-16 h-[1.5px] bg-brand-accent mt-1" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {[
            { tag: 'Y2K', title: 'Y2K FUTURISM', image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500', count: 12 },
            { tag: 'Vintage', title: 'VINTAGE WASH', image: 'https://images.unsplash.com/photo-1571243144144-6a7e65929b15?w=500', count: 15 },
            { tag: 'Retro', title: 'RETRO CORE', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500', count: 18 },
            { tag: 'Graphic', title: 'GRAPHIC LAB', image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500', count: 10 },
            { tag: 'Limited', title: 'DEADSTOCK PIECES', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500', count: 6 }
          ].map((vibe, index) => (
            <div
              id={`vibe-card-${vibe.tag}`}
              key={vibe.tag}
              onClick={() => handleVibeClick(vibe.tag)}
              className="relative h-80 rounded-xl overflow-hidden cursor-pointer group border border-brand-border/60 hover:border-brand-accent/80 transition-all shadow-sm"
            >
              <img
                src={vibe.image}
                alt={vibe.title}
                className="w-full h-full object-cover group-hover:scale-105 group-hover:blur-[1px] duration-500 hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/75 via-brand-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 text-left text-brand-cream">
                <span className="font-mono text-[9px] tracking-widest text-brand-accent uppercase font-semibold">{vibe.count} ITEMS AVAILABLE</span>
                <h3 className="font-serif text-lg tracking-wide uppercase mt-1 leading-snug font-medium">{vibe.title}</h3>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] mt-2 group-hover:text-brand-accent transition-colors">
                  BROWSE NOW <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 06 — NEW DROP SECTION */}
      <section id="new-drop-slider-section" className="py-24 bg-brand-card/30 border-y border-brand-border select-none relative bg-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
          <div className="flex flex-col text-left gap-3">
            <span className="font-mono text-xs text-brand-charcoal tracking-[0.25em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block animate-ping"></span>
              IMMEDIATE ALLOCATION
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-black tracking-tight leading-none font-normal">
              COVETED RECENT RELEASES
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => scrollSlider('left')}
              className="p-3 bg-brand-cream border border-brand-border hover:bg-brand-black hover:text-white hover:border-brand-black transition-all shadow-sm"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider('right')}
              className="p-3 bg-brand-cream border border-brand-border hover:bg-brand-black hover:text-white hover:border-brand-black transition-all shadow-sm"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="hidden md:flex items-center">
            <DropCountdown target="2026-12-01T12:00:00Z" />
          </div>
        </div>

        {/* Horizontal Card Slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 px-4 md:px-[6%] py-4 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newDropItems.map((product) => (
            <div
              id={`quick-drop-${product.id}`}
              key={product.id}
              className="w-72 sm:w-80 shrink-0 bg-brand-cream border border-brand-border p-3 flex flex-col justify-between snap-start group shadow-sm hover:border-brand-accent relative"
            >
              {/* Badges Overlay */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 select-none pointer-events-none">
                {product.isLimited && (
                  <span className="bg-brand-black text-brand-cream text-[8.5px] font-mono font-medium py-1 px-2 tracking-[0.16em] uppercase">
                    DEADSTOCK RELEASE
                  </span>
                )}
                {product.stock < 10 && (
                  <span className="bg-rose-600 text-white text-[8px] font-mono font-bold py-0.5 px-2 tracking-[0.1em] uppercase">
                    ONLY {product.stock} LEFT
                  </span>
                )}
              </div>

              {/* Product Visual */}
              <div
                className="relative h-96 overflow-hidden bg-brand-card border border-brand-border/45 cursor-pointer"
                onClick={() => selectProduct(product.id)}
              >
                <img
                  src={product.imagePrimary}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-500 select-none"
                />
                <img
                  src={product.imageHover}
                  alt={`${product.name} view 2`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 select-none"
                />
                
                {/* Adding hover add-to-cart strip */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 'L');
                    }}
                    className="w-full py-2.5 bg-brand-black/95 text-brand-cream font-mono text-[10px] sm:text-[11px] font-semibold tracking-widest hover:bg-brand-accent hover:text-brand-black transition-colors shadow-xl border border-zinc-800 uppercase"
                  >
                    QUICK SECURE REQ (L)
                  </button>
                </div>
              </div>

              {/* Product Summary */}
              <div className="mt-4 flex flex-col text-left gap-1">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className="font-sans text-xs font-semibold uppercase hover:text-brand-charcoal cursor-pointer line-clamp-1 flex-1"
                    onClick={() => selectProduct(product.id)}
                  >
                    {product.name}
                  </h3>
                  <button
                    id={`wishlist-drop-${product.id}`}
                    aria-label="Add to Wishlist"
                    onClick={() => toggleWishlist(product.id)}
                    className="text-zinc-400 hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-2 border-t border-brand-border/45 pt-2">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">ALLOCATED PRICE</span>
                  <div className="flex items-center gap-2">
                    {product.originalPrice && (
                      <span className="font-mono text-xs line-through text-zinc-400">₹{product.originalPrice}</span>
                    )}
                    <span className="font-mono text-xs font-bold text-brand-black">₹{product.price}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 07 — ARCHIVE TIMELINE */}
      <section id="archive-timeline-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-brand-border">
        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <span className="font-mono text-xs text-brand-charcoal tracking-[0.25em] uppercase">SYSTEM RELEASE HISTORY</span>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-black tracking-tight leading-none font-normal">
            ARCHIVE RELEASE CALENDAR
          </h2>
          <div className="w-16 h-[1.5px] bg-brand-accent mt-1" />
        </div>

        <div className="flex flex-col gap-8">
          {ARCHIVE_COLLECTIONS.map((record, idx) => (
            <div
              id={`timeline-${record.id}`}
              key={record.id}
              className="flex flex-col lg:flex-row items-stretch border border-brand-border/60 hover:border-brand-border transition-all group"
            >
              
              {/* Image panel */}
              <div className="lg:w-1/3 h-64 lg:h-auto overflow-hidden relative bg-brand-card">
                <img src={record.bgImage} alt={record.name} className="w-full h-full object-cover group-hover:scale-105 duration-700" />
                <div className="absolute inset-0 bg-brand-black/35 pointer-events-none" />
                <div className="absolute top-6 left-6 bg-brand-cream/90 backdrop-blur-sm border border-brand-border px-3 py-1 font-mono text-[10px] tracking-widest text-[#111] uppercase font-bold">
                  {record.releaseYear}
                </div>
              </div>

              {/* Text specifications panel */}
              <div className="flex-1 p-8 sm:p-12 flex flex-col justify-between text-left gap-6 bg-white/40">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] hover:text-brand-accent transition-colors bg-brand-black text-brand-cream px-2 py-0.5 font-bold uppercase tracking-wider">
                      {record.tag}
                    </span>
                    <span className={`font-mono text-[10px] font-bold border px-2 py-0.5 tracking-wider ${
                      record.status === 'LIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-250 animate-pulse' :
                      record.status === 'SOLD OUT' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-brand-card text-brand-charcoal border-brand-border'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-2xl md:text-3xl text-brand-black leading-snug tracking-tight font-medium uppercase mt-1">
                    {record.name}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-brand-charcoal leading-relaxed max-w-xl">
                    {record.description}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-brand-border pt-6">
                  <button
                    onClick={() => {
                      navigateTo(record.status === 'LIVE' ? 'shop' : 'archive');
                    }}
                    className="text-[11px] font-mono font-semibold tracking-widest uppercase flex items-center gap-2 group-hover:text-brand-accent transition-colors pb-1 border-b border-transparent group-hover:border-brand-accent"
                  >
                    {record.status === 'LIVE' ? 'ACQUIRE FROM DROP' : 'EXPLORE SYSTEM ARCHIVES'} 
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      <SpaceAI />
      <BottomNav />

      {/* 08 — FEATURED PRODUCT SHOWCASE */}
      <section id="featured-showcase-section" className="py-24 bg-brand-card/25 border-b border-brand-border bg-grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <span className="font-mono text-xs text-brand-charcoal tracking-[0.25em] uppercase">COLLECTOR SPECIAL RELEASE</span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-black tracking-tight leading-none font-normal">
              FEATURED HARNESS
            </h2>
            <div className="w-16 h-[1.5px] bg-brand-accent mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Image column */}
            <div className="md:col-span-6 bg-brand-cream border border-brand-border p-4 flex flex-col relative group rounded-2xl">
              <div className="absolute top-6 left-6 z-10 bg-brand-black text-brand-cream text-[9px] py-1 px-3 tracking-[0.15em] font-mono uppercase">
                ARCHIVE DROP HERO
              </div>

              <div
                className="h-[50vh] sm:h-[60vh] overflow-hidden bg-brand-card border border-brand-border/45 cursor-pointer"
                onClick={() => selectProduct(featuredProduct.id)}
              >
                <img
                  src={featuredProduct.imagePrimary}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 duration-700 select-none"
                />
              </div>
            </div>

            {/* Right details column */}
            <div className="md:col-span-6 flex flex-col justify-between text-left gap-8 py-2">
              <div className="flex flex-col gap-6">
                
                {/* Visual feedback metrics */}
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-rose-500 font-bold tracking-widest tracking-[0.16em] uppercase animate-pulse shrink-0">
                    ★ CRITICAL LOW STOCK
                  </span>
                  <div className="h-[1px] bg-brand-border flex-grow" />
                  <span className="font-mono text-xs text-zinc-500 uppercase">{featuredProduct.rating} / 5.0 Rating</span>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-3xl sm:text-4xl text-brand-black font-normal tracking-tight uppercase leading-none">
                    {featuredProduct.name}
                  </h3>
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-3xl text-brand-black font-semibold">₹{featuredProduct.price}</span>
                    {featuredProduct.originalPrice && (
                      <span className="font-mono text-sm line-through text-zinc-400">₹{featuredProduct.originalPrice}</span>
                    )}
                  </div>
                </div>

                <p className="font-sans text-xs sm:text-sm text-brand-charcoal leading-relaxed">
                  {featuredProduct.story}
                </p>

                {/* Sizes Segment */}
                <div className="flex flex-col gap-3 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Select Required Armor Size:</span>
                    <span className="font-mono text-[10px] text-brand-accent tracking-widest font-bold">Standard Boxy sizing applies</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5">
                    {featuredProduct.sizes.map((sz) => (
                      <button
                        id={`size-showcase-${sz}`}
                        key={sz}
                        onClick={() => setFeaturedSelectedSize(sz)}
                        className={`py-3 font-mono text-xs font-semibold tracking-wide transition-all border ${
                          featuredSelectedSize === sz
                            ? 'bg-brand-black border-brand-black text-brand-cream font-bold'
                            : 'bg-white border-brand-border text-brand-black hover:border-brand-black'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Area */}
              <div className="flex flex-col gap-4 mt-4 border-t border-brand-border pt-6">
                <Button
                  id="featured-own-btn"
                  variant="dark"
                  size="lg"
                  fullWidth
                  onClick={() => addToCart(featuredProduct, featuredSelectedSize)}
                  className="flex items-center justify-center gap-3 relative py-4"
                >
                  <span>OWN THE DROP</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pre-shrunk 100% Cotton
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 380GSM Industrial Weight
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 10 — WHY BLANK SPACE / KEY ATTRIBUTES */}
      <section id="why-blank-space-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-brand-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
          {[
            {
              id: 'feat-1',
              title: 'PREMIUM COTTON WEIGHTS',
              para: 'Each archive item undergoes individual high-volume loopback configuration, creating heavy-density drape weights up to 460GSM that persist.',
              icon: <Shield className="w-5 h-5 text-brand-accent" />
            },
            {
              id: 'feat-2',
              title: 'STRICT DEADSTOCK RELEASE',
              para: 'Zero restock practices, limited physical allocations, traceable custom labels. Authentic collectible design designed for subculture longevity.',
              icon: <Sparkles className="w-5 h-5 text-brand-accent" />
            },
            {
              id: 'feat-3',
              title: 'RAPID TRACKABLE DHL SHIPPING',
              para: 'Priority dispatch mechanics that guarantee direct pan-India shipping, fully trace-tracked via premium custom courier API endpoints.',
              icon: <Truck className="w-5 h-5 text-brand-accent" />
            },
            {
              id: 'feat-4',
              title: 'FREE CONSCIOUS RETURNS',
              para: 'Hassle-free 7-day courier collection if your box needs custom size adaptation. Customer support handled efficiently under standard business hours.',
              icon: <RotateCcw className="w-5 h-5 text-brand-accent" />
            }
          ].map((attr) => (
            <div
              id={`attr-car-${attr.id}`}
              key={attr.id}
              className="bg-brand-card/30 border border-brand-border p-8 text-left flex flex-col justify-between h-72 gap-6 hover:border-brand-accent transition-all group rounded-xl bg-grain"
            >
              <div className="p-3 bg-brand-cream border border-brand-border rounded-lg inline-block self-start shadow-sm group-hover:bg-brand-black group-hover:text-brand-cream transition-colors duration-300">
                {attr.icon}
              </div>
              <div>
                <h3 className="font-mono text-[11px] font-bold text-brand-black tracking-widest uppercase mb-2">
                  {attr.title}
                </h3>
                <p className="font-sans text-xs text-zinc-600 leading-relaxed">
                  {attr.para}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11 — PREMIUM REVIEWS CAROUSEL */}
      <section id="reviews-carousel-section" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 select-none">
        
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="font-mono text-xs text-brand-charcoal tracking-[0.25em] uppercase">SYSTEM VERIFICATION</span>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-black tracking-tight leading-none font-normal">
            COLLECTOR FEEDBACK
          </h2>
          <div className="w-16 h-[1.5px] bg-brand-accent mt-1" />
        </div>

        <div className="relative border border-brand-border bg-white rounded-3xl p-8 sm:p-14 text-center flex flex-col items-center justify-between gap-8 shadow-xl bg-grain">
          
          <div className="absolute top-8 right-8 text-7xl font-light font-serif text-brand-border select-none leading-none pointer-events-none">
            “
          </div>

          <div className="flex items-center text-amber-500 justify-center gap-1">
            {[...Array(TESTIMONIALS[currentReviewIndex].rating)].map((_, idx) => (
              <Star key={idx} className="w-4 h-4 fill-current" />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentReviewIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-serif text-lg md:text-xl text-brand-black leading-relaxed max-w-3xl italic font-normal"
            >
              {TESTIMONIALS[currentReviewIndex].text}
            </motion.p>
          </AnimatePresence>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <img
                src={TESTIMONIALS[currentReviewIndex].avatar}
                alt={TESTIMONIALS[currentReviewIndex].author}
                className="w-11 h-11 rounded-full border border-brand-border object-cover select-none shrink-0 pointer-events-none"
              />
              <div className="flex flex-col text-left">
                <span className="font-sans text-xs font-bold text-brand-black uppercase tracking-wide">
                  {TESTIMONIALS[currentReviewIndex].author}
                </span>
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">
                  {TESTIMONIALS[currentReviewIndex].role}
                </span>
              </div>
            </div>

            <span className="inline-flex mt-2 items-center gap-1.5 font-mono text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" /> VERIFIED COLLECTOR ALLOCATION
            </span>
          </div>

          {/* Carousel Arrows */}
          <div className="flex gap-2 justify-center mt-4">
            <button
              onClick={() => {
                setCurrentReviewIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
              }}
              className="p-2.5 bg-brand-cream border border-brand-border hover:bg-brand-black hover:text-white transition-all rounded-full"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentReviewIndex((prev) => (prev + 1) % TESTIMONIALS.length);
              }}
              className="p-2.5 bg-brand-cream border border-brand-border hover:bg-brand-black hover:text-white transition-all rounded-full"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </section>

      {/* 12 — INSTAGRAM EDITORIAL WALL */}
      <section id="instagram-wall-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-brand-border">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="font-mono text-xs text-brand-charcoal tracking-[0.25em] uppercase">COMMUNITY INDEX</span>
          <h2 className="text-4xl md:text-5xl font-serif text-brand-black tracking-tight leading-none font-normal">
            #BLANKSPACESTATUS
          </h2>
          <div className="w-16 h-[1.5px] bg-brand-accent mt-1" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <div
              id={`ig-wall-${post.id}`}
              key={post.id}
              className="relative h-64 overflow-hidden group border border-brand-border bg-zinc-900 rounded-lg cursor-pointer shadow-sm shadow-black/5"
            >
              <img
                src={post.image}
                alt="Instagram lookbook model"
                className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-40 duration-500 ease-out select-none"
              />
              <div className="absolute inset-0 bg-brand-black/70 opacity-0 group-hover:opacity-100 duration-300 flex flex-col justify-center items-center text-brand-cream font-mono">
                <span className="text-xs uppercase tracking-widest text-brand-accent mb-2">LOOKBOOK STYLE</span>
                <span className="text-xs font-semibold">{post.likes} LIKES</span>
                <span className="text-[10px] mt-1 text-zinc-400">{post.comments} ENQUIRIES</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13 — NEWSLETTER ARCHIVE ACCESS */}
      <section id="newsletter-signup-section" className="py-24 max-w-5xl mx-auto px-4 sm:px-6 select-none">
        <div className="bg-brand-black border border-zinc-910 p-10 sm:p-16 text-center text-brand-cream relative overflow-hidden rounded-3xl bg-grain">
          
          <div className="absolute top-0 left-0 w-32 h-32 bg-zinc-910/10 rounded-full blur-3xl select-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-zinc-910/10 rounded-full blur-3xl select-none" />

          <div className="max-w-xl w-full mx-auto flex flex-col gap-6 z-10 relative">
            <span className="font-mono text-[10px] sm:text-xs text-brand-accent tracking-[0.3em] uppercase">VANGUARD ALLIANCE</span>
            <h2 className="text-4xl font-serif text-white tracking-tight leading-none font-normal font-light">
              JOIN THE ARCHIVE
            </h2>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
              Subscribe to immediate allocation tickers. Gain private priority codes and exclusive 10% discount credentials on your introductory checkout order.
            </p>

            <AnimatePresence mode="wait">
              {!newsletterSubscribed ? (
                <motion.form
                  onSubmit={handleNewsletterSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 flex flex-col sm:flex-row gap-3 border border-zinc-800 p-2 bg-zinc-950/70 backdrop-blur-sm self-stretch rounded-none"
                >
                  <input
                    id="newsletter-email-input"
                    type="email"
                    required
                    placeholder="ENTER YOUR PROTOCOL EMAIL..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-transparent px-4 py-3 placeholder-zinc-650 text-white font-mono text-xs focus:outline-none focus:ring-0 uppercase tracking-widest border-none text-center sm:text-left"
                  />
                  <button
                    id="newsletter-subscribe-btn"
                    type="submit"
                    className="bg-white text-brand-black font-mono text-xs font-semibold tracking-widest uppercase hover:bg-brand-accent hover:text-brand-black transition-colors px-6 py-3 shrink-0"
                  >
                    ACQUIRE CODE
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 bg-zinc-910/40 border border-zinc-800 p-6 flex flex-col items-center gap-3"
                >
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-mono text-sm uppercase tracking-widest text-white">ACCESS GRANTED</h4>
                  <p className="font-mono text-[11px] text-zinc-450 uppercase leading-relaxed">
                    Use VIP code <span className="font-sans font-bold text-white text-base underline decoration-brand-accent decoration-2 select-all">BLANK10</span> for 10% off at UPI checkouts. Ticker credentials sent.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

    </div>
  );
}
