import React from 'react';
import { useStore } from '../hooks/useStore';
import { Instagram, Globe, MessageSquare, ArrowUp, Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { navigateTo } = useStore();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="brand-footer" className="bg-brand-black text-brand-cream border-t border-zinc-900 pt-16 pb-12 mt-24 relative select-none bg-grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-zinc-850">
          
          {/* Brand segment */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-2xl font-bold tracking-[0.2em] text-white">BLANK SPACE</h3>
            <p className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
              ARCHIVES REBORN FOR NOW.
            </p>
            <p className="font-sans text-xs text-zinc-400 mt-2 leading-relaxed">
              Limited-run vintage-engineered garments designed to evolve with physical wear. Produced programmatically in restricted archival volumes under conscious facilities.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-brand-accent transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-brand-accent transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-brand-accent transition-all">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-5 text-zinc-400 font-sans text-xs">
            <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-white">COLLECTIONS</h4>
            <button onClick={() => navigateTo('shop')} className="text-left hover:text-white hover:translate-x-1 duration-200 uppercase tracking-wider">shop all garments</button>
            <button onClick={() => navigateTo('archive')} className="text-left hover:text-white hover:translate-x-1 duration-200 uppercase tracking-wider">archive catalog</button>
            <button onClick={() => navigateTo('wishlist')} className="text-left hover:text-white hover:translate-x-1 duration-200 uppercase tracking-wider">your wishlist</button>
            <p className="text-[10px] text-rose-500 font-mono tracking-widest mt-2 uppercase font-semibold">★ RELEASES DROPPING RANDOMLY</p>
          </div>

          {/* Customer support */}
          <div className="flex flex-col gap-5 text-zinc-400 font-sans text-xs">
            <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-white">SUPPORT HUB</h4>
            <button onClick={() => navigateTo('account')} className="text-left hover:text-white hover:translate-x-1 duration-200 uppercase text-xs">ORDER STATUS / ACCOUNT</button>
            <a href="#payment" className="text-left hover:text-white hover:translate-x-1 duration-200 uppercase text-xs">UPI SCREENSHOT UPLOADS</a>
            <a href="#shipping" className="text-left hover:text-white hover:translate-x-1 duration-200 uppercase text-xs">FREE POLISHED SHIPPING OVER ₹1499</a>
            <a href="#returns" className="text-left hover:text-white hover:translate-x-1 duration-200 uppercase text-xs">RARE RETURNS & RESTOCKS GUIDE</a>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-5 text-zinc-400 font-sans text-xs">
            <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-white">THE ARCHIVE LAB</h4>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4.5 h-4.5 text-zinc-650 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">VIP ENQUIRIES</span>
                <span className="text-white mt-1">archives@blankspace.in</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4.5 h-4.5 text-zinc-650 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">SECURITY STATEMENT</span>
                <span className="text-white mt-1">SSL 256-Bit Encrypted UPI manual transactions</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-neutral-500 font-mono text-[10px] tracking-wide gap-4">
          <div className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} BLANK SPACE ARCHIVES PVT. LTD. ALL RIGHTS SECURED.
          </div>
          <div className="flex gap-6 uppercase tracking-wider text-[9px]">
            <a href="#terms" className="hover:text-white text-zinc-600 transition-colors">TERMS OF USE</a>
            <a href="#privacy" className="hover:text-white text-zinc-600 transition-colors">PRIVACY CODE</a>
            <a href="#legal" className="hover:text-white text-zinc-600 transition-colors">TAX/COMPANY REGISTRY</a>
          </div>
          <button
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white group transition-all"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
