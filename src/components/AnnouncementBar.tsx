import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, Flame } from 'lucide-react';

export default function AnnouncementBar() {
  const announcements = [
    { text: "LIMITED DROP LIVE • EXCLUSIVE ARCHIVE INFLUENCE", icon: <Flame className="w-3.5 h-3.5" /> },
    { text: "FREE DELIVERY PAN-INDIA FOR ALL ORDERS OVER ₹1499", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { text: "NO RESTOCKS ON ARCHIVE CLOTHING — ONCE COMPLETED, IT DEPARTS FOR GOOD", icon: <Sparkles className="w-3.5 h-3.5" /> }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="announcement-bar"
      className="bg-brand-black text-brand-cream border-b border-zinc-900 py-2.5 px-4 sticky top-0 z-30 overflow-hidden text-xs font-mono tracking-widest text-center select-none shadow-sm flex items-center justify-center gap-2"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-3"
        >
          <span className="text-zinc-500">{announcements[index].icon}</span>
          <span className="uppercase tracking-[0.2em]">{announcements[index].text}</span>
          <span className="text-zinc-500">{announcements[index].icon}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
