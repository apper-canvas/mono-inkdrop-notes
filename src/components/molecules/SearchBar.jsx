import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  placeholder = "Search notes...", 
  onSearch, 
  value = "", 
  className = "" 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    onSearch && onSearch(e.target.value);
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "relative flex items-center border-2 rounded-lg transition-all duration-200",
        isFocused 
          ? "border-amber-500 ring-2 ring-amber-200" 
          : "border-stone-300 hover:border-stone-400"
      )}>
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 text-stone-400" 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full h-10 pl-10 pr-4 text-sm font-display bg-transparent focus:outline-none placeholder:text-stone-400"
        />
      </div>
    </div>
  );
};

export default SearchBar;