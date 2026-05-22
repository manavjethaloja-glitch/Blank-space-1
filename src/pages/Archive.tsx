import React from 'react';
import { useStore } from '../hooks/useStore';
import { ARCHIVE_COLLECTIONS, PRODUCTS } from '../data';
import { ChevronRight, Calendar, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Archive() {
  const { navigateTo, selectProduct } = useStore();

  const activeArchiveItems = PRODUCTS.filter((p) => p.isLimited).slice(0, 4);

  return (
    <div id="archive-page" className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-grain select-none text-left">
      
      {/* Editorial Header */}
      <div className="flex flex-col gap-3 border-b border-brand-border pb-10 mb-16">
        <span className="font-mono text-xs text-brand-charcoal tracking-[0.3em] uppercase">MUSEUM METRICS REGISTER</span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-brand-black tracking-tight leading-none uppercase font-normal">
          THE ARCHIVE RECORDS
        </h1>
        <p className="font-sans text-sm sm:text-base text-brand-charcoal leading-relaxed max-w-2xl mt-2">
          An interactive chronicle tracing BLANK SPACE’s history of structured garments. Formed using loopback density profiles, engineered zinc-tabs, and certified deadstock materials. Once depleted, patterns undergo physical vault preservation.
        </p>
      </div>

      {/* Main timeline */}
      <div className="relative border-l border-brand-border pl-6 sm:pl-12 ml-4 flex flex-col gap-20">
        
        {ARCHIVE_COLLECTIONS.map((record) => (
          <div
            id={`timeline-card-${record.id}`}
            key={record.id}
            className="relative"
          >
            {/* Round connector bullet */}
            <div className="absolute -left-[31px] sm:-left-[55px] top-1.5 w-[11px] h-[11px] rounded-full border-2 border-brand-black bg-brand-cream z-10" />

            {/* Content card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Text segment column */}
              <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 border border-brand-border bg-white rounded-xl shadow-sm text-left gap-6">
                <div className="flex flex-col gap-4">
                  
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> OUTWARD YEAR: {record.releaseYear}
                    </span>
                    <span className={`font-mono text-[9px] font-bold border px-2 py-0.5 tracking-wider ${
                      record.status === 'LIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                      record.status === 'SOLD OUT' ? 'bg-zinc-100 text-zinc-650 border-zinc-200' : 'bg-brand-card text-brand-charcoal border-brand-border'
                    }`}>
                      {record.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-brand-black leading-tight uppercase font-medium">
                    {record.name}
                  </h3>
                  
                  <p className="font-sans text-xs sm:text-sm text-brand-charcoal leading-relaxed">
                    {record.description}
                  </p>
                </div>

                <div className="border-t border-brand-border pt-6 flex justify-between items-center mt-3">
                  <div className="text-left">
                    <span className="font-mono text-[9px] text-zinc-400 block uppercase tracking-widest">TRACEABLE STATUS</span>
                    <span className="font-mono text-[11px] tracking-wider text-brand-black font-semibold uppercase mt-0.5 inline-block">
                      {record.tag}
                    </span>
                  </div>

                  {record.status === 'LIVE' ? (
                    <button
                      onClick={() => navigateTo('shop')}
                      className="px-5 py-2.5 bg-brand-black text-brand-cream font-mono text-[10px] font-bold tracking-widest uppercase hover:bg-brand-accent hover:text-brand-black transition-colors"
                    >
                      ACQUIRE FROM DROP
                    </button>
                  ) : record.status === 'SOLD OUT' ? (
                    <span className="text-zinc-400 font-mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 p-2 bg-zinc-50 border border-zinc-150">
                      <AlertTriangle className="w-3.5 h-3.5" /> SECURED BY VANGUARD
                    </span>
                  ) : (
                    <span className="text-brand-charcoal font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 border border-dashed border-brand-border">
                      DROPPING SOON LIST
                    </span>
                  )}
                </div>
              </div>

              {/* Graphic/Image panel column */}
              <div className="lg:col-span-5 h-64 lg:h-auto rounded-xl overflow-hidden border border-brand-border shadow-sm">
                <img src={record.bgImage} alt={record.name} className="w-full h-full object-cover select-none" />
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Featured arch artifacts gallery below */}
      <div className="mt-28 border-t border-brand-border pt-16 select-none">
        <h2 className="font-serif text-3xl text-brand-black font-normal tracking-tight uppercase text-center mb-12">
          CRITICAL ARCHIVE SPECIMENS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeArchiveItems.map((item) => (
            <div
              id={`archive-specimen-${item.id}`}
              key={item.id}
              onClick={() => selectProduct(item.id)}
              className="bg-brand-card/25 border border-brand-border p-3 flex flex-col justify-between cursor-pointer hover:border-brand-accent transition-all group rounded-xl"
            >
              <div className="relative h-72 overflow-hidden bg-brand-card border border-brand-border/45 mb-4">
                <img src={item.imagePrimary} alt={item.name} className="w-full h-full object-cover group-hover:scale-103 duration-500" />
                <div className="absolute top-4 left-4 bg-brand-black text-brand-cream font-mono text-[9px] px-2 py-0.5 tracking-wider uppercase">
                  VAULT INDEXED
                </div>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <h4 className="font-sans text-xs font-bold uppercase truncate flex-1">{item.name}</h4>
                <span className="font-mono text-xs font-semibold">₹{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
