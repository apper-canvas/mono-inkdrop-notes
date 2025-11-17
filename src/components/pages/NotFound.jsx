import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50">
      <div className="text-center space-y-6 p-8">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="FileQuestion" size={48} className="text-white" />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-stone-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-stone-700 mb-3">Page Not Found</h2>
          <p className="text-stone-600 max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or may have been moved. 
            Let's get you back to your notes.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <ApperIcon name="Home" size={18} />
            Go Home
          </button>
          
          <button
            onClick={() => navigate("/new")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 hover:border-stone-400 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ApperIcon name="Plus" size={18} />
            Create Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;