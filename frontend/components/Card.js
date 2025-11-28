import { cn } from '@/lib/utils';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;