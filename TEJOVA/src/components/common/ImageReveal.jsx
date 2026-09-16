import React from 'react';
import { motion } from 'framer-motion';

export const ImageReveal = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/5]',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-xs bg-[#F7F3E9] ${aspectRatio} ${className} group`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
      />
    </motion.div>
  );
};
