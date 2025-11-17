import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { notebookService } from "@/services/api/notebookService";
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, onClose }) => {
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewNotebookForm, setShowNewNotebookForm] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [newNotebookColor, setNewNotebookColor] = useState("#F59E0B");
  const navigate = useNavigate();

  const predefinedColors = [
    "#F59E0B", "#3B82F6", "#10B981", "#8B5CF6", 
    "#EF4444", "#F97316", "#06B6D4", "#84CC16"
  ];

  useEffect(() => {
    loadNotebooks();
  }, []);

  const loadNotebooks = async () => {
    try {
      setLoading(true);
const data = await notebookService.getAll();
      setNotebooks(data || []);
    } catch (error) {
      console.error("Error loading notebooks:", error);
      toast.error("Failed to load notebooks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotebook = async (e) => {
    e.preventDefault();
    if (!newNotebookName.trim()) return;

    try {
const newNotebook = await notebookService.create({
        name_c: newNotebookName.trim(),
        color_c: newNotebookColor
      });
      setNotebooks([...notebooks, newNotebook]);
      setNewNotebookName("");
      setShowNewNotebookForm(false);
      toast.success("Notebook created successfully");
    } catch (error) {
      console.error("Error creating notebook:", error);
      toast.error("Failed to create notebook");
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-stone-50 border-r border-stone-200">
      {/* Header */}
      <div className="p-6 border-b border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="PenTool" size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-stone-800">InkDrop</h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={18} className="text-stone-600" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => navigate("/new")}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <ApperIcon name="Plus" size={18} />
          <span className="font-medium">New Note</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-amber-100 text-amber-800 border-l-4 border-amber-600" 
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-800"
            )}
          >
            <ApperIcon name="FileText" size={18} />
            <span className="font-medium">All Notes</span>
          </NavLink>

          <NavLink
            to="/recent"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-amber-100 text-amber-800 border-l-4 border-amber-600" 
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-800"
            )}
          >
            <ApperIcon name="Clock" size={18} />
            <span className="font-medium">Recent</span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-amber-100 text-amber-800 border-l-4 border-amber-600" 
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-800"
            )}
          >
            <ApperIcon name="Search" size={18} />
            <span className="font-medium">Search</span>
          </NavLink>

          <NavLink
            to="/tags"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-amber-100 text-amber-800 border-l-4 border-amber-600" 
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-800"
            )}
          >
            <ApperIcon name="Tag" size={18} />
            <span className="font-medium">Tags</span>
          </NavLink>

          <NavLink
            to="/trash"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-amber-100 text-amber-800 border-l-4 border-amber-600" 
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-800"
            )}
          >
            <ApperIcon name="Trash2" size={18} />
            <span className="font-medium">Trash</span>
          </NavLink>
        </nav>

        {/* Notebooks Section */}
        <div className="px-4 py-2 border-t border-stone-200 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-800 uppercase tracking-wider">
              Notebooks
            </h3>
            <button
              onClick={() => setShowNewNotebookForm(true)}
              className="p-1 hover:bg-stone-200 rounded transition-colors"
            >
              <ApperIcon name="Plus" size={16} className="text-stone-600" />
            </button>
          </div>

          {showNewNotebookForm && (
            <form onSubmit={handleCreateNotebook} className="mb-4 p-3 bg-white rounded-lg border border-stone-300">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Notebook name"
                  value={newNotebookName}
                  onChange={(e) => setNewNotebookName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-600">Color:</span>
                  <div className="flex gap-1">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewNotebookColor(color)}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-all",
                          newNotebookColor === color 
                            ? "border-stone-800 scale-110" 
                            : "border-transparent hover:border-stone-400"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-3 py-1 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewNotebookForm(false);
                      setNewNotebookName("");
                    }}
                    className="px-3 py-1 text-stone-600 hover:text-stone-800 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-1">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2">
                    <div className="w-4 h-4 bg-stone-300 rounded-full animate-pulse" />
                    <div className="h-4 bg-stone-300 rounded flex-1 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              notebooks.map(notebook => (
                <NavLink
key={notebook.Id}
                  to={`/notebook/${notebook.Id}`}
                  className={({ isActive }) => cn(
"flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-white text-stone-800 shadow-sm border border-stone-200" 
                      : "text-stone-600 hover:bg-stone-100"
                  )}
                >
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
style={{ backgroundColor: notebook.color_c }}
                  />
<span className="font-medium truncate flex-1">{notebook.name_c}</span>
                  <span className="text-xs text-stone-500 group-hover:text-stone-600">
0
                  </span>
                </NavLink>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 h-full">
        {sidebarContent}
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative w-80 h-full transform transition-transform duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;