import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sequence = [
  "TEJOVA",
  "Vitality",
  "Nourishment",
  "Lifestyle",
  "Longevity",
  "Expand Your Light"
];

export const EntryExperience = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check session storage to only show once per visit if desired, or play short intro
    const hasSeen = sessionStorage.getItem('tejova_entry_seen');
    if (hasSeen) {
      setVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev < sequence.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            sessionStorage.setItem('tejova_entry_seen', 'true');
          }, 1000);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    setVisible(false);
    sessionStorage.setItem('tejova_entry_seen', 'true');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[#1F4D3B] text-white flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Animated Text Display */}
          <div className="text-center h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={sequence[index]}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-wider text-white"
              >
                {sequence[index]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Subtitle indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            className="text-xs uppercase tracking-[0.3em] text-[#A7B99F] mt-6"
          >
            Conscious Living
          </motion.div>

          {/* Skip Intro Button */}
          <button
            onClick={handleSkip}
            className="absolute bottom-10 text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors py-2 px-4 border border-white/20 rounded-full hover:border-white/50"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
