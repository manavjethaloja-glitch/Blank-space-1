import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random incremental ticks for natural luxury feel
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="loader-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-zinc-950 p-8 text-neutral-200 select-none bg-grain"
        >
          {/* Top segment */}
          <div className="flex justify-between items-center text-xs font-mono tracking-widest text-zinc-500 uppercase">
            <span>TOKYO / HYDERABAD / NY</span>
            <span>ARCHIVE 01 // RELEASE</span>
          </div>

          {/* Center Title */}
          <div className="flex flex-col items-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-8xl font-serif tracking-widest text-white leading-none text-center font-normal"
            >
              BLANK SPACE
            </motion.h1>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 0.5 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mt-4 text-xs md:text-sm tracking-[0.25em] text-neutral-300 font-sans uppercase font-light"
            >
              ARCHIVES REBORN FOR NOW.
            </motion.p>
          </div>

          {/* Bottom Countdown */}
          <div className="flex justify-between items-end border-t border-zinc-900 pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 font-mono text-[10px] tracking-wider uppercase">ARCHIVE SEQUENCE</span>
              <span className="text-zinc-300 font-mono text-sm">INIT_OK_SYSTEM_LOADING_ACTIVE</span>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <span className="text-7xl md:text-8xl font-serif text-white font-light tracking-tighter leading-none pr-2">
                {String(progress).padStart(3, '0')}
              </span>
              <div className="w-32 h-[1px] bg-zinc-855 overflow-hidden">
                <motion.div
                  className="h-full bg-brand-accent h-[1px]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
