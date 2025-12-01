'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const Input = forwardRef(({ 
  className, 
  type = 'text', 
  label,
  error,
  icon,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <motion.input
          ref={ref}
          type={type}
          className={cn(
            "w-full px-4 py-3 rounded-lg border border-gray-300",
            "bg-white text-gray-900 placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent",
            "transition-all duration-200",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500",
            icon && "pl-10",
            className
          )}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
