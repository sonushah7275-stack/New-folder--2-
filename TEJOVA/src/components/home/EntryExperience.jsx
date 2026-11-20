import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const defaultItems = [
  {
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
  },
  {
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200",
  },
  {
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200",
  },
  {
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=1200",
  },
  {
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
  },
];

export const EntryExperience = () => {
  const { pagesMap } = useSelector((state) => state.content);

  const homePage = pagesMap?.home;

  const seqSection = homePage?.sections?.find(
    (section) => section.type === "entry_sequence",
  );

  // CMS-managed images only
  const items = useMemo(() => {
    const rawItems = seqSection?.items?.filter(
      (item) => item.isVisible !== false && item.image,
    );

    if (!rawItems || rawItems.length === 0) {
      return defaultItems;
    }

    return rawItems.map((item, index) => ({
      image: item.image || defaultItems[index % defaultItems.length].image,
    }));
  }, [seqSection]);

  const [index, setIndex] = useState(0);

  const [visible, setVisible] = useState(
    () => !sessionStorage.getItem("tejova_entry_seen"),
  );

  // Reset index if CMS items change
  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  // Automatic image slideshow
  useEffect(() => {
    if (!visible || items.length === 0) return;

    const timeout = setTimeout(() => {
      if (index < items.length - 1) {
        setIndex((prev) => prev + 1);
      } else {
        setVisible(false);
        sessionStorage.setItem("tejova_entry_seen", "true");
      }
    }, 2300);

    return () => clearTimeout(timeout);
  }, [visible, index, items]);

  const handleSkip = () => {
    setVisible(false);
    sessionStorage.setItem("tejova_entry_seen", "true");
  };

  const currentItem = items[index] || items[0];

  return (
    <AnimatePresence>
      {visible && currentItem && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#0A2342] overflow-hidden select-none"
        >
          {/* Full Screen Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`image-${index}`}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.3,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentItem.image})`,
              }}
            />
          </AnimatePresence>

          {/* Subtle Cinematic Overlay */}
          <div className="absolute inset-0 bg-[#0A2342]/15 pointer-events-none" />

          {/* Skip Intro */}
          <button
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-20 text-xs tracking-[0.2em] uppercase text-white/90 hover:text-white transition-all py-3 px-6 border border-white/40 rounded-full hover:border-white bg-black/20 backdrop-blur-md"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
