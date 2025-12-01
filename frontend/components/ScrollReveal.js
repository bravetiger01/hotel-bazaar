'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ScrollReveal({ 
  children, 
  className,
  delay = 0,
  direction = 'up',
  ...props 
}) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  };

  const variants = {
    hidden: { 
      opacity: 0,
      ...directions[direction]
    },
    visible: { 
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
