import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Accessible FAQ Accordion component with Framer Motion animations
 * and full keyboard navigation (WAI-ARIA compliance).
 */
export const FaqAccordion = ({ items = [], allowMultiple = false }) => {
  const [openIds, setOpenIds] = useState([items[0]?.id || ""]);

  const toggleItem = (id) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="py-12 text-center text-[#0A2342]/60 font-light">
        No FAQ questions available at this time.
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#B87333]/20 border-y border-[#B87333]/20">
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);
        const headingId = `faq-heading-${item.id || index}`;
        const panelId = `faq-panel-${item.id || index}`;

        return (
          <div key={item.id || index} className="py-6 sm:py-8 transition-colors">
            <h3>
              <button
                type="button"
                id={headingId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="w-full text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B87333] group"
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <span className="font-serif text-sm sm:text-base text-[#B87333] font-semibold mt-0.5 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-lg sm:text-xl lg:text-2xl text-[#0A2342] group-hover:text-[#B87333] transition-colors leading-snug font-medium">
                    {item.title}
                  </span>
                </div>

                <div
                  className={`p-1.5 sm:p-2 rounded-full border border-[#B87333]/30 transition-transform duration-300 shrink-0 mt-1 ${
                    isOpen
                      ? "bg-[#0A2342] text-white border-[#0A2342] rotate-180"
                      : "bg-[#FAF9F6] text-[#0A2342] group-hover:border-[#B87333]"
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headingId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pl-8 sm:pl-12 pr-4 sm:pr-8 pt-4 pb-2 text-sm sm:text-base lg:text-lg text-[#0A2342]/80 font-light leading-relaxed">
                    {item.description}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
