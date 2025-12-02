'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  href, 
  loading = false,
  icon,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50 focus:ring-blue-500 blue-glow-hover rounded-full",
    secondary: "glass text-white hover:bg-white/10 focus:ring-blue-500 border border-white/10 rounded-full",
    outline: "border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white focus:ring-blue-500 rounded-full",
    ghost: "text-gray-300 hover:bg-white/5 focus:ring-gray-300 rounded-full",
    destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:shadow-red-500/50 focus:ring-red-500 rounded-full",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  const buttonContent = (
    <>
      {/* Shine effect */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      
      {icon && <span className="mr-2">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );
};

export default AnimatedButton;
