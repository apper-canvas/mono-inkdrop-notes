import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by creating your first item", 
  actionLabel = "Get Started",
  onAction,
  icon = "FileText",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 text-center ${className}`}>
      <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-amber-500" />
      </div>
      
      <h3 className="text-2xl font-semibold text-stone-800 mb-3">{title}</h3>
      
      <p className="text-stone-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;