import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const defaultItems = [
  {
    title: 'TEJOVA',
    kicker: 'ORIGIN & RADIANCE',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Vitality',
    kicker: 'PILLAR 01',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Nourishment',
    kicker: 'PILLAR 02',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Lifestyle',
    kicker: 'PILLAR 03',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Longevity',
    kicker: 'PILLAR 04',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Expand Your Light',
    kicker: 'SOVEREIGN PURPOSE',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200'
  }
];

export const EntryExperience = () => {
  const { pagesMap } = useSelector((state) => state.content);
  const homePage = pagesMap?.home;
  const seqSection = homePage?.sections?.find((s) => s.type === 'entry_sequence');

  const items = useMemo(() => {
    const rawItems = seqSection?.items && seqSection.items.length > 0
      ? seqSection.items.filter((i) => i.isVisible !== false)
      : [];

    if (rawItems.length === 0) return defaultItems;

    return rawItems.map((item, idx) => ({
      title: item.title || item.kicker || defaultItems[idx % defaultItems.length].title,
      kicker: item.kicker || item.subtitle || "CONSCIOUS LIVING",
      image: item.image || defaultItems[idx % defaultItems.length].image
    }));
  }, [seqSection]);

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(() => !sessionStorage.getItem('tejova_entry_seen'));

  useEffect(() => {
    if (!visible || items.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev < items.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            sessionStorage.setItem('tejova_entry_seen', 'true');
          }, 1500);
          return prev;
        }
      });
    }, 2300);

    return () => clearInterval(interval);
  }, [visible, items]);

  const handleSkip = () => {
    setVisible(false);
    sessionStorage.setItem('tejova_entry_seen', 'true');
  };

  const currentItem = items[index] || items[0] || defaultItems[0];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[#0A2342] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Animated Background Image Layer */}
          <AnimatePresence mode="wait">
            {currentItem?.image && (
              <motion.div
                key={`bg-${index}-${currentItem.image}`}
                initial={{ opacity: 2, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url(${currentItem.image})` }}
              />
            )}
          </AnimatePresence>

          {/* Dark TEJOVA Midnight Gradient Overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0A2342]/90 via-[#0A2342]/75 to-[#0A2342]/95 pointer-events-none" />

          {/* Animated Text & Kicker Content */}
          <div className="relative z-10 text-center px-6 max-w-4xl flex flex-col items-center justify-center min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${index}-${currentItem.title}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center"
              >
                {currentItem.kicker && (
                  <span className="text-xs uppercase tracking-[0.35em] text-[#D4AF37] mb-3 font-semibold">
                    {currentItem.kicker}
                  </span>
                )}
                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-wider text-white drop-shadow-lg">
                  {currentItem.title}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Skip Intro Button */}
          <button
            onClick={handleSkip}
            className="absolute bottom-10 z-20 text-xs tracking-widest uppercase text-white/80 hover:text-white transition-all py-2.5 px-6 border border-[#B87333]/50 rounded-full hover:border-[#D4AF37] bg-[#0A2342]/40 backdrop-blur-sm"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
