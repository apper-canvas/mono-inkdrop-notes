import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const AutoSaveIndicator = ({ 
  lastSaved, 
  issaving = false, 
  hasUnsavedChanges = false,
  className = "" 
}) => {
const getStatusText = () => {
    if (issaving) return "Saving...";
    if (hasUnsavedChanges) return "Unsaved changes";
    if (lastSaved) return `Saved ${formatDistanceToNow(new Date(lastSaved))} ago`;
    return "Not saved";
  };

const getStatusColor = () => {
    if (issaving) return "text-amber-600";
    if (hasUnsavedChanges) return "text-orange-600";
    if (lastSaved) return "text-green-600";
    return "text-stone-500";
  };

<div className={`flex items-center gap-2 text-xs ${getStatusColor()} ${className}`}>
      {issaving ? (
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse-dot" />
      ) : hasUnsavedChanges ? (
        <ApperIcon name="AlertCircle" size={12} />
      ) : lastSaved ? (
        <ApperIcon name="Check" size={12} />
      ) : (
        <ApperIcon name="Clock" size={12} />
      )}
      <span className="font-medium">{getStatusText()}</span>
      <span className="font-medium">{getStatusText()}</span>
    </div>
  );
};

export default AutoSaveIndicator;