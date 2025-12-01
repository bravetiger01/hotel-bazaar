'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Container({ 
  children, 
  className, 
  animate = false,
  delay = 0,
  ...props 
}) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-100px" },
    variants: containerVariants
  } : {};

  return (
    <Component
      className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
}
