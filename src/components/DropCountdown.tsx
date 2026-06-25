import React, { useEffect, useState } from 'react';

export default function DropCountdown({ target }: { target: string }) {
  const targetDate = new Date(target).getTime();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, targetDate - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return (
    <div className="flex items-center gap-3 glass-card p-3">
      <div className="text-xs text-zinc-300">Next Drop In</div>
      <div className="font-mono text-lg tracking-wide">{days}d {hrs}h {mins}m {secs}s</div>
    </div>
  );
}
