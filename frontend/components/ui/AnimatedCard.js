'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const AnimatedCard = ({ 
  children, 
  className, 
  hover = true,
  delay = 0,
  ...props 
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden",
        "transition-all duration-300",
        hover && "hover:shadow-xl hover:shadow-lavender/10 hover:-translate-y-1",
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
