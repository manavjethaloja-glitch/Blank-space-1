import React, { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Search, Heart, ShoppingBag, User, X, Menu, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../data';

export default function Navbar() {
  const {
    currentPage,
    navigateTo,
    cart,
    wishlist,
    cartItemsCount,
    cartTotal,
    selectProduct,
    updateCartQuantity,
    removeFromCart,
    isCartOpen,
    setCartOpen,
    isMobileMenuOpen,
    setMobileMenuOpen,
    isSearchOpen,
    setSearchOpen,
    searchQuery,
    setSearchQuery,
    isLoggedIn
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [internalSearch, setInternalSearch] = useState('');

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products matching search term for quick results
  const searchResults = internalSearch
    ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(internalSearch.toLowerCase()) || p.category.toLowerCase().includes(internalSearch.toLowerCase()))
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (internalSearch.trim()) {
      setSearchQuery(internalSearch);
      navigateTo('shop');
      setSearchOpen(false);
    }
  };

  const handleQuickAddSearch = (pId: string) => {
    selectProduct(pId);
    setSearchOpen(false);
  };

  return (
    <>
      <nav
        id="navbar-header"
        className={`fixed top-11 left-0 right-0 z-20 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-cream/80 backdrop-blur-md border-b border-brand-border py-4 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* Menu button for Mobile (Left on Mobile) */}
          <button
            id="mobile-drawer-toggle"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-brand-black hover:opacity-75 focus:outline-none"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>

          {/* Logo (Left on Desktop, Center on Mobile) */}
          <div className="flex-1 md:flex-none text-center md:text-left">
            <button
              id="brand-logo"
              onClick={() => navigateTo('home')}
              className="font-serif text-xl sm:text-2xl font-semibold tracking-[0.2em] cursor-pointer hover:opacity-85"
            >
              BLANK SPACE
            </button>
          </div>

          {/* Nav Links - Desktop (Center) */}
          <div className="hidden md:flex items-center gap-10 text-[11px] font-mono tracking-[0.2em] text-brand-black/90 uppercase">
            <button
              id="nav-shop"
              onClick={() => navigateTo('shop')}
              className={`hover:text-brand-accent transition-colors cursor-pointer relative py-1 ${
                currentPage === 'shop' ? 'text-brand-accent font-medium' : ''
              }`}
            >
              SHOP
              {currentPage === 'shop' && (
                <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-accent" />
              )}
            </button>
            <button
              id="nav-archive"
              onClick={() => navigateTo('archive')}
              className={`hover:text-brand-accent transition-colors cursor-pointer relative py-1 ${
                currentPage === 'archive' ? 'text-brand-accent font-medium' : ''
              }`}
            >
              ARCHIVE
              {currentPage === 'archive' && (
                <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-accent" />
              )}
            </button>
            <button
              id="nav-new-drop"
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  const dropDiv = document.getElementById('new-drop-slider-section');
                  if (dropDiv) {
                    dropDiv.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
              className="hover:text-brand-accent transition-colors cursor-pointer py-1 text-sm font-semibold text-rose-500 uppercase tracking-widest flex items-center gap-1"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              NEW DROP
            </button>
            <button
              id="nav-about"
              onClick={() => navigateTo('about')}
              className={`hover:text-brand-accent transition-colors cursor-pointer relative py-1 ${
                currentPage === 'about' ? 'text-brand-accent font-medium' : ''
              }`}
            >
              ABOUT
              {currentPage === 'about' && (
                <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-accent" />
              )}
            </button>
          </div>

          {/* User controls (Right) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <button
              id="nav-search-btn"
              aria-label="Search items"
              onClick={() => setSearchOpen(true)}
              className="p-1.5 sm:p-2 text-brand-black hover:text-brand-accent transition-colors"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Wishlist */}
            <button
              id="nav-wishlist-btn"
              aria-label="Show wishlist"
              onClick={() => navigateTo('wishlist')}
              className="p-1.5 sm:p-2 text-brand-black hover:text-brand-accent transition-colors relative"
            >
              <Heart className={`w-4.5 h-4.5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              id="nav-account-btn"
              aria-label="View Account"
              onClick={() => navigateTo(isLoggedIn ? 'account' : 'login')}
              className="p-1.5 sm:p-2 text-brand-black hover:text-brand-accent transition-colors"
            >
              <User className={`w-4.5 h-4.5 ${isLoggedIn ? 'text-[#111111] fill-[#111111]/10' : ''}`} />
            </button>

            {/* Cart Drawer Toggle */}
            <button
              id="nav-cart-btn"
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
              className="p-1.5 sm:p-2 bg-brand-black text-brand-cream rounded-full px-3 py-1.5 sm:px-4 sm:py-2 hover:opacity-90 transition-all flex items-center gap-1.5 border border-zinc-900 group"
            >
              <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[10px] tracking-wider font-semibold group-hover:text-brand-accent">{cartItemsCount}</span>
            </button>
          </div>

        </div>
      </nav>

      {/* SEARCH PANEL OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            id="search-panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-brand-black/90 backdrop-blur-md flex flex-col p-6 sm:p-12 md:p-24"
          >
            <div className="max-w-3xl w-full mx-auto flex flex-col h-full justify-start">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">ARCHIVAL SEARCH SYSTEM</span>
                <button
                  id="search-panel-close"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-8 flex gap-4">
                <input
                  id="search-input-field"
                  type="text"
                  placeholder="SEARCH GARMENTS (e.g. Tee, Cargo, Hoodie, Y2K)..."
                  value={internalSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white text-2xl md:text-4xl font-serif tracking-wide border-none placeholder-zinc-700 focus:outline-none focus:ring-0"
                  autoFocus
                />
                <button
                  id="search-submit-btn"
                  type="submit"
                  className="px-6 bg-white text-brand-black font-mono text-xs font-semibold tracking-widest hover:bg-brand-accent hover:text-brand-black transition-all flex items-center gap-1"
                >
                  SEARCH <ArrowRight className="w-3 h-3" />
                </button>
              </form>

              {/* Real-time search previews */}
              <div className="mt-12 overflow-y-auto max-h-[60vh] flex flex-col gap-4">
                {internalSearch ? (
                  searchResults.length > 0 ? (
                    <div>
                      <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">MATCHING PIECES ({searchResults.length})</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.map((product) => (
                          <div
                            id={`search-result-${product.id}`}
                            key={product.id}
                            onClick={() => handleQuickAddSearch(product.id)}
                            className="bg-zinc-900 border border-zinc-800 p-3 flex gap-4 items-center cursor-pointer hover:border-brand-accent transition-colors group"
                          >
                            <img src={product.imagePrimary} alt={product.name} className="w-16 h-16 object-cover border border-zinc-800" />
                            <div className="flex-1 text-left">
                              <h4 className="text-white text-sm font-sans font-medium group-hover:text-brand-accent transition-colors">{product.name}</h4>
                              <p className="font-mono text-xs text-zinc-400 mt-1">₹{product.price}</p>
                              <span className="inline-block mt-1 font-mono text-[9px] bg-zinc-855 text-zinc-400 px-1 py-0.5 uppercase tracking-wider">
                                {product.category}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-500 font-serif text-lg text-center mt-12 italic">No archives matching "{internalSearch}" located.</p>
                  )
                ) : (
                  <div>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-3">SUGGESTED FILTERS</p>
                    <div className="flex flex-wrap gap-2">
                      {['Heavyweight Hoodie', 'Oversized Tee', 'Cargo Pants', 'Nylon', 'Caps'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setInternalSearch(term)}
                          className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-zinc-300 font-mono text-[11px] hover:border-brand-accent transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-brand-black/70 backdrop-blur-sm md:hidden"
            />

            {/* Menu Body */}
            <motion.div
              id="mobile-drawer-body"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 max-w-xs w-full bg-brand-cream z-50 p-6 flex flex-col justify-between shadow-2xl md:hidden bg-grain select-none"
            >
              <div>
                <div className="flex justify-between items-center border-b border-brand-border pb-5 mb-8">
                  <span className="font-serif text-xl font-bold tracking-[0.15em]">BLANK SPACE</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-brand-black hover:opacity-75">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col gap-6 text-base font-medium tracking-widest font-sans uppercase">
                  <button
                    onClick={() => {
                      navigateTo('shop');
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 text-left hover:text-brand-accent border-b border-zinc-150"
                  >
                    SHOP ALL GARMENTS
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('archive');
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 text-left hover:text-brand-accent border-b border-zinc-150"
                  >
                    ARCHIVE TIMELINE
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('home');
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        const dropDiv = document.getElementById('new-drop-slider-section');
                        if (dropDiv) {
                          dropDiv.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    className="p-2 text-left text-rose-600 font-semibold border-b border-zinc-150 flex items-center justify-between"
                  >
                    <span>NEW COVETED DROP</span>
                    <span className="text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded-full">ACTIVE</span>
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('about');
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 text-left hover:text-brand-accent border-b border-zinc-150"
                  >
                    OUR STRATEGY [ABOUT]
                  </button>
                </div>
              </div>

              <div className="border-t border-brand-border pt-6 flex flex-col gap-3">
                <Button variant="dark" size="md" fullWidth onClick={() => navigateTo(isLoggedIn ? 'account' : 'login')}>
                  MY ACCOUNT STATUS
                </Button>
                <div className="text-center font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-2">
                  ARCHIVES REBORN FOR NOW • DELHI / IN
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SHOPPING CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-40 bg-brand-black/70 backdrop-blur-sm"
            />

            {/* Cart Panel */}
            <motion.div
              id="shopping-cart-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 max-w-md w-full bg-brand-cream z-50 p-6 flex flex-col justify-between shadow-2xl bg-grain"
            >
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center border-b border-brand-border pb-5 mb-5 shrink-0">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-black" />
                    <span className="font-serif text-lg font-bold tracking-tight uppercase">YOUR BOX // ({cart.length}) PIECES</span>
                  </div>
                  <button onClick={() => setCartOpen(false)} className="p-2 text-brand-black hover:opacity-75">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart Items Area */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                      <p className="font-serif text-zinc-400 italic text-lg">Your packaging is currently empty.</p>
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          navigateTo('shop');
                        }}
                        className="text-[11px] font-mono tracking-widest uppercase border-b border-brand-black pb-1 hover:text-brand-charcoal hover:border-brand-charcoal font-semibold mt-2"
                      >
                        BROWSE EXCLUSIVE ITEMS
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {cart.map((item, index) => (
                        <div
                          id={`cart-item-${item.product.id}-${item.size}`}
                          key={`${item.product.id}-${item.size}-${index}`}
                          className="flex gap-4 border-b border-zinc-200 pb-5"
                        >
                          <img
                            src={item.product.imagePrimary}
                            alt={item.product.name}
                            className="w-20 h-24 object-cover border border-brand-border bg-brand-card shrink-0 cursor-pointer"
                            onClick={() => {
                              selectProduct(item.product.id);
                              setCartOpen(false);
                            }}
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4
                                  className="font-sans text-xs font-semibold hover:opacity-75 cursor-pointer line-clamp-2 pr-2"
                                  onClick={() => {
                                    selectProduct(item.product.id);
                                    setCartOpen(false);
                                  }}
                                >
                                  {item.product.name}
                                </h4>
                                <button
                                  id={`remove-cart-item-${item.product.id}`}
                                  aria-label="Remove item"
                                  onClick={() => removeFromCart(item.product.id, item.size)}
                                  className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="font-mono text-[9px] text-zinc-500 uppercase mt-1 tracking-wider">
                                Size: <span className="text-zinc-900 font-bold font-sans text-xs">{item.size}</span>
                              </p>
                              {item.product.stock < 10 && (
                                <span className="inline-block mt-1 font-mono text-[9px] text-rose-500 bg-rose-50 px-1 uppercase font-semibold">
                                  ONLY {item.product.stock} PIECES LEFT
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center border border-brand-border bg-brand-cream/50">
                                <button
                                  id={`qty-minus-${item.product.id}`}
                                  aria-label="Decrease quantity"
                                  onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity - 1)}
                                  className="p-1 px-2.5 hover:bg-brand-border text-zinc-600 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 font-mono text-xs">{item.quantity}</span>
                                <button
                                  id={`qty-plus-${item.product.id}`}
                                  aria-label="Increase quantity"
                                  onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity + 1)}
                                  className="p-1 px-2.5 hover:bg-brand-border text-zinc-600 transition-colors"
                                  disabled={item.quantity >= item.product.stock}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="font-mono text-xs font-semibold text-brand-black">
                                ₹{item.product.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Checkout pricing and action button */}
                {cart.length > 0 && (
                  <div className="border-t border-brand-border pt-5 mt-5 shrink-0 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">PIECE SUBTOTAL:</span>
                        <span>₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">PACKAGING/SHIPPING:</span>
                        <span className="text-emerald-600 font-semibold">{cartTotal >= 1499 ? 'FREE' : '₹100'}</span>
                      </div>
                      {cartTotal < 1499 && (
                        <div className="text-[10px] text-rose-600 text-center uppercase tracking-widest mt-1">
                          Add ₹{1499 - cartTotal} more for FREE shipping
                        </div>
                      )}
                      <div className="flex justify-between border-t border-brand-border pt-3 mt-1.5 text-sm font-bold text-brand-black font-sans">
                        <span>TOTAL PAYABLE COVETED RATE:</span>
                        <span className="font-mono text-base font-semibold">₹{cartTotal + (cartTotal >= 1499 ? 0 : 100)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      <Button
                        id="cart-checkout-btn"
                        variant="dark"
                        size="md"
                        fullWidth
                        onClick={() => {
                          setCartOpen(false);
                          navigateTo('checkout');
                        }}
                      >
                        OWN THE DROP
                      </Button>
                      <button
                        onClick={() => setCartOpen(false)}
                        className="text-center font-mono text-[9px] uppercase tracking-widest text-zinc-500 py-1 hover:text-brand-black transition-colors"
                      >
                        CONTINUE EXPLORING ARCHIVES
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Utility Button designed inside this template to reduce import weight and isolate styled elements
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'dark' | 'light' | 'outline' | 'accent' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'dark',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyle = "uppercase font-mono tracking-widest transition-all duration-300 pointer-events-auto rounded-none shrink-0 border uppercase font-medium";
  
  const variants = {
    dark: "bg-brand-black text-brand-cream border-brand-black hover:bg-neutral-800 focus:ring-1 focus:ring-brand-accent",
    light: "bg-brand-cream text-brand-black border-brand-border hover:bg-brand-card",
    outline: "bg-transparent text-brand-black border-brand-black hover:bg-brand-black hover:text-brand-cream",
    accent: "bg-brand-accent text-brand-black border-brand-accent hover:opacity-90",
    disabled: "bg-zinc-200 text-zinc-400 border-zinc-200 cursor-not-allowed uppercase"
  };

  const sizes = {
    sm: "text-[9px] py-1.5 px-3",
    md: "text-[11px] py-3.5 px-7",
    lg: "text-xs py-4 px-9"
  };

  const widthStyle = fullWidth ? "w-full flex justify-center items-center text-center" : "inline-flex items-center justify-center";

  return (
    <button
      className={`${baseStyle} ${variants[props.disabled ? 'disabled' : variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
