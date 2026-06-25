import React, { useState } from 'react';

export default function SpaceAI() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const ask = () => {
    if (!q.trim()) return;
    setHistory((h) => [...h, `You: ${q}`]);
    // placeholder reply
    setHistory((h) => [...h, `SPACE AI: Suggesting an outfit based on "${q}" — try an oversized black hoodie with metallic accessories.`]);
    setQ('');
  };

  return (
    <div className="fixed right-5 bottom-24 z-50">
      <div className="flex flex-col items-end gap-2">
        {open && (
          <div className="w-80 glass-card p-3 text-sm">
            <div className="h-36 overflow-auto mb-2">
              {history.length === 0 ? (
                <div className="text-zinc-400">Ask SPACE AI for outfit ideas, sizing help, or quick search.</div>
              ) : (
                history.map((h, i) => <div key={i} className={h.startsWith('You:')? 'text-white/90 text-xs' : 'text-zinc-300 text-xs'}>{h}</div>)
              )}
            </div>
            <div className="flex gap-2">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try: black oversized hoodie under ₹1500" className="flex-1 bg-transparent border rounded px-2 py-1 text-white/90" />
              <button onClick={ask} className="accent-btn">Ask</button>
            </div>
          </div>
        )}

        <button onClick={() => setOpen(!open)} className="p-3 rounded-full bg-gradient-to-br from-[#00d1ff] to-[#6ee7ff] shadow-lg text-black">
          SPACE AI
        </button>
      </div>
    </div>
  );
}
