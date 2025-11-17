import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";

const Trash = () => {
  const navigate = useNavigate();

  const handleCreateNote = () => {
    navigate("/new");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-stone-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 mb-1">Trash</h1>
            <p className="text-stone-600">
              Deleted notes will appear here
            </p>
          </div>
          
          <button
            onClick={handleCreateNote}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <ApperIcon name="Plus" size={18} />
            New Note
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Empty
          title="Trash is empty"
          description="Deleted notes will appear here. You can restore or permanently delete them from this view."
          actionLabel="Create New Note"
          onAction={handleCreateNote}
          icon="Trash2"
        />
      </div>
    </div>
  );
};

export default Trash;