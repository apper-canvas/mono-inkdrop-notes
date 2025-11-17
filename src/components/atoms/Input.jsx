import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border-2 border-stone-300 bg-white px-3 py-2 text-sm font-body placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          error && "border-red-300 focus:border-red-500 focus:ring-red-200",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;