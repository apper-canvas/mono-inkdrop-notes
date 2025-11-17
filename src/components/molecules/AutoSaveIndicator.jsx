import React, { useEffect, useState } from "react";
import { formatDateSafe } from "@/utils/formatDateSafe";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const AutoSaveIndicator = ({ lastSaved, isSaving = false, hasUnsavedChanges = false, className = "" }) => {
  const getStatusColor = () => {
    if (isSaving) return "text-amber-500";
    if (hasUnsavedChanges) return "text-orange-600";
    if (lastSaved) return "text-green-600";
    return "text-stone-500";
  };

  const getStatusText = () => {
    if (isSaving) return "Saving...";
    if (hasUnsavedChanges) return "Unsaved changes";
    if (!lastSaved) return "Not saved";
    return `Saved ${formatDateSafe(lastSaved)} ago`;
  };

  return (
    <div className={cn("flex items-center gap-2 text-xs", getStatusColor(), className)}>
      {isSaving ? (
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse-dot" />
      ) : hasUnsavedChanges ? (
        <ApperIcon name="AlertCircle" size={12} />
      ) : lastSaved ? (
        <ApperIcon name="Check" size={12} />
      ) : (
        <ApperIcon name="Clock" size={12} />
      )}
      <span className="font-medium">{getStatusText()}</span>
    </div>
);
};

/**
 * AutoSaveIndicator Component
 * @param {boolean} isSaving - Whether the note is currently being saved
 * @param {boolean} hasUnsavedChanges - Whether there are unsaved changes
 * @param {string} lastSaved - ISO timestamp of last save
 * @param {string} className - Additional CSS classes
 */

export default AutoSaveIndicator;