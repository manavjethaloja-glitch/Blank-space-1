import React, { useState } from 'react';

const aesthetics = ['Midnight Street', 'Minimal Core', 'Neo Tokyo', 'Vintage Revival', 'Luxury Edge', 'Creative Chaos'];
const energies = ['Calm', 'Confident', 'Bold', 'Mysterious', 'Experimental'];
const fits = ['Oversized', 'Relaxed', 'Regular', 'Tailored'];
const budgets = ['Entry', 'Standard', 'Premium', 'Exclusive'];

export default function StyleDNA() {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState({ aesthetic: '', energy: '', color: '', fit: '', budget: '' });
  const [result, setResult] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const finalize = () => {
    const id = `${choice.aesthetic || 'Midnight'} ${choice.energy || 'Creator'}`;
    const handles = ['The Midnight Creator','The Urban Visionary','The Silent Rebel','The Future Icon','The Luxe Nomad'];
    const pick = handles[Math.abs(id.length) % handles.length];
    setResult(pick);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_#06101a,_#050505)] text-white">
      <div className="max-w-3xl w-full glass-card">
        <div className="p-8">
          <h2 className="text-3xl font-serif mb-3">Discover Your Blank Identity</h2>
          <p className="text-sm text-zinc-300 mb-6">A short, immersive style quiz to personalize Blank Space for you.</p>

          {!result ? (
            <div>
              {step === 0 && (
                <div>
                  <p className="font-mono text-xs uppercase text-zinc-400 mb-3">Choose your aesthetic</p>
                  <div className="grid grid-cols-2 gap-3">
                    {aesthetics.map((a) => (
                      <button key={a} onClick={() => setChoice(c => ({ ...c, aesthetic: a }))} className={`p-3 text-left rounded-lg border ${choice.aesthetic===a ? 'border-brand-accent bg-white/6' : 'border-zinc-800'}`}>{a}</button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <p className="font-mono text-xs uppercase text-zinc-400 mb-3">Choose your energy</p>
                  <div className="flex gap-3 flex-wrap">
                    {energies.map((e) => (
                      <button key={e} onClick={() => setChoice(c => ({ ...c, energy: e }))} className={`p-3 rounded-full ${choice.energy===e ? 'bg-brand-accent text-black' : 'bg-white/4'}`}>{e}</button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="font-mono text-xs uppercase text-zinc-400 mb-3">Pick your colors</p>
                  <div className="flex gap-3 items-center">
                    {['#000000','#ffffff','#00d1ff','#c0c0c0','#8b5cf6'].map((col) => (
                      <button key={col} onClick={() => setChoice(c => ({ ...c, color: col }))} style={{ background: col }} className={`w-12 h-12 rounded-full border ${choice.color===col ? 'ring-2 ring-brand-accent' : ''}`} />
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <p className="font-mono text-xs uppercase text-zinc-400 mb-3">Your perfect fit</p>
                  <div className="flex gap-3">
                    {fits.map((f) => (
                      <button key={f} onClick={() => setChoice(c => ({ ...c, fit: f }))} className={`p-3 rounded-md ${choice.fit===f ? 'bg-white/6 border-brand-accent' : 'bg-white/4'}`}>{f}</button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <p className="font-mono text-xs uppercase text-zinc-400 mb-3">Your budget</p>
                  <div className="flex gap-3">
                    {budgets.map((b) => (
                      <button key={b} onClick={() => setChoice(c => ({ ...c, budget: b }))} className={`p-3 rounded-md ${choice.budget===b ? 'bg-white/6 border-brand-accent' : 'bg-white/4'}`}>{b}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between items-center">
                <div>
                  {step > 0 && <button onClick={prev} className="mr-3 text-sm">Back</button>}
                  {step < 4 && <button onClick={next} className="text-sm font-semibold">Next →</button>}
                </div>
                {step === 4 && <button onClick={finalize} className="accent-btn">Reveal My Identity</button>}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-2xl font-serif mb-2">{result}</h3>
              <p className="text-sm text-zinc-300 mb-6">A personalized Blank Space identity tailored to your aesthetic.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => { window.location.hash = ''; window.location.reload(); }} className="p-3 bg-white/6 rounded-md">Return Home</button>
                <button onClick={() => { window.location.hash = '#/shop'; window.location.reload(); }} className="accent-btn">Explore Picks</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
