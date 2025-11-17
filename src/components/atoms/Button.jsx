import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98";
  
  const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 focus:ring-amber-500 shadow-md hover:shadow-lg",
    secondary: "bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 focus:ring-stone-500 shadow-sm hover:shadow-md",
    ghost: "text-stone-600 hover:text-stone-800 hover:bg-stone-100 focus:ring-stone-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-md hover:shadow-lg"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm gap-2",
    default: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-3"
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;