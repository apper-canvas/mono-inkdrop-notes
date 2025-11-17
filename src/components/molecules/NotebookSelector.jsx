import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { notebookService } from "@/services/api/notebookService";

const NotebookSelector = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotebooks();
  }, []);

  const loadNotebooks = async () => {
    try {
      setLoading(true);
      const data = await notebookService.getAll();
      setNotebooks(data);
    } catch (error) {
      console.error("Error loading notebooks:", error);
    } finally {
      setLoading(false);
    }
  };

const selectedNotebook = notebooks.find(n => n.Id === value);
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border-2 border-stone-300 rounded-lg hover:border-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          {selectedNotebook ? (
<>
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedNotebook.color_c }}
              />
              <span className="font-medium text-stone-800">
                {selectedNotebook.name_c}
              </span>
            </>
          ) : (
            <span className="text-stone-500">Select notebook...</span>
          )}
        </div>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-stone-400"
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-stone-300 rounded-lg shadow-lg">
          {loading ? (
            <div className="p-3 text-sm text-stone-500">Loading notebooks...</div>
          ) : notebooks.length === 0 ? (
            <div className="p-3 text-sm text-stone-500">No notebooks found</div>
          ) : (
            <div className="py-1">
              {notebooks.map(notebook => (
<button
                  key={notebook.Id}
                  onClick={() => {
                    onChange(notebook.Id);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-stone-50 transition-colors duration-150"
                >
<div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: notebook.color_c }}
                  />
                  <span className="font-medium text-stone-800">
                    {notebook.name_c}
                  </span>
                  <span className="ml-auto text-xs text-stone-500">
                    0 notes
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotebookSelector;