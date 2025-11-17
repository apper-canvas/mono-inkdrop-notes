import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-stone-200 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" size={24} className="text-stone-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="PenTool" size={16} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-stone-800">InkDrop</h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;