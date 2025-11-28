import Link from 'next/link';
import { cn } from '@/lib/utils';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  href, 
  loading = false,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-lavender text-white hover:bg-opacity-90 focus:ring-lavender",
    secondary: "bg-darkblue text-white hover:bg-opacity-90 focus:ring-darkblue",
    outline: "border-2 border-lavender text-lavender hover:bg-lavender hover:text-white focus:ring-lavender",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "text-darkblue hover:bg-gray-100 focus:ring-gray-300",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const classes = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={loading} {...props}>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;