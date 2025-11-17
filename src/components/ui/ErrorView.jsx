import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ error = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" size={32} className="text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-stone-800 mb-2">Oops! Something went wrong</h3>
      
      <p className="text-stone-600 mb-6 max-w-md leading-relaxed">
        {error}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="RefreshCw" size={18} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorView;