import React from 'react';
import { useStore } from '../hooks/useStore';
import { Button } from '../components/Navbar';
import { Sparkles, Calendar, Globe, ShieldCheck } from 'lucide-react';

export default function About() {
  const { navigateTo } = useStore();

  return (
    <div id="about-page" className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-grain select-none text-left">
      
      {/* Editorial Header */}
      <div className="flex flex-col gap-3 border-b border-brand-border pb-10 mb-16">
        <span className="font-mono text-xs text-brand-charcoal tracking-[0.3em] uppercase">SYSTEM MANIFESTO REGISTER</span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-brand-black tracking-tight leading-none uppercase font-normal">
          BLANK SPACE DESIGN DIARY
        </h1>
        <p className="font-sans text-sm sm:text-base text-brand-charcoal leading-relaxed max-w-2xl mt-2">
          Tracing the conceptual blueprints, sulfur wash treatments, and physical subculture matrices that govern BLANK SPACE streetwear production.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        
        {/* Left column Copy */}
        <div className="flex flex-col justify-between text-left gap-8 py-2">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-xs text-brand-accent tracking-[0.2em] uppercase font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
              THE STRATEGIST MATRIX
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-black uppercase font-medium leading-tight">
              RECONSTRUCTING PHYSICAL ARCHIVES FOR THE DIGITAL VANGUARD.
            </h2>
            <p className="font-sans text-sm text-brand-charcoal leading-relaxed">
              BLANK SPACE was founded on a simple, uncompromising premise: that streetwear should hold weight—both physical and cultural. Our garments are engineered in restricted, traceable batches to counter the disposable, high-volume nature of modern fast commerce.
            </p>
            <p className="font-sans text-sm text-brand-charcoal leading-relaxed">
              We draw inspiration from vintage functional military equipment, late-90s underground club cultures, and brutalist geometric patterns. Each silhouette is customized with heavyweight 380GSM single jersey open-end cotton or dual-brushed 460GSM loopback cotton, designed to shape itself to your movements over time.
            </p>
          </div>

          <div className="flex gap-4 border-t border-brand-border pt-6 mt-4">
            <Button variant="dark" size="md" onClick={() => navigateTo('shop')}>
              OWN THE CURRENT DROP
            </Button>
            <Button variant="outline" size="md" onClick={() => navigateTo('archive')} className="border-brand-border">
              EXPLORE OUR LAUNCHTIMELINE
            </Button>
          </div>
        </div>

        {/* Right column: Bento elements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
          
          <div className="bg-white border border-brand-border p-8 rounded-xl shadow-sm flex flex-col justify-between h-72 text-left bg-grain group hover:border-brand-text transition-all">
            <div className="p-3 bg-brand-cream border border-brand-border rounded-lg self-start">
              <Calendar className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#111] mb-2">ZERO RESTOCK GUARANTEE</h3>
              <p className="font-sans text-xs text-zinc-650 leading-relaxed">Once a series sequence is completed and depleted, patterns undergo archival preservation. Zero restocks maintain collectible integrity.</p>
            </div>
          </div>

          <div className="bg-white border border-brand-border p-8 rounded-xl shadow-sm flex flex-col justify-between h-72 text-left bg-grain group hover:border-brand-text transition-all">
            <div className="p-3 bg-brand-cream border border-brand-border rounded-lg self-start">
              <Globe className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#111] mb-2">METICULOUS SOURCE TRACING</h3>
              <p className="font-sans text-xs text-zinc-650 leading-relaxed">All garments are sourced, treated, sulfur-washed, and assembled at conscious partners operating under ethical labor codes.</p>
            </div>
          </div>

          <div className="bg-white border border-brand-border p-8 rounded-xl shadow-sm flex flex-col justify-between h-72 text-left bg-grain group hover:border-brand-text transition-all sm:col-span-2">
            <div className="p-3 bg-brand-cream border border-brand-border rounded-lg self-start">
              <ShieldCheck className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#111] mb-2">HEAVY COTTON WEIGHT MATRIX</h3>
              <p className="font-sans text-xs text-zinc-650 leading-relaxed">Every piece features heavy open-end jersey threads or loopback loops. Weighing up to 460GSM, our pieces offer unparalleled natural drape, durability, and texture to survive standard washing intervals.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
