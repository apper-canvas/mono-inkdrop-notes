import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-stone-200 to-stone-300 rounded-lg w-1/3"></div>
        <div className="h-8 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg w-24"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded w-full"></div>
        <div className="h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded w-5/6"></div>
        <div className="h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded w-4/5"></div>
      </div>
      
      {/* Card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-stone-50 rounded-lg p-4 space-y-3 shadow-sm">
            <div className="h-6 bg-gradient-to-r from-stone-300 to-stone-400 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded w-2/3"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded w-16"></div>
              <div className="h-4 bg-gradient-to-r from-stone-200 to-stone-300 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;