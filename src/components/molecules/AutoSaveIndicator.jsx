import React from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const AutoSaveIndicator = ({
  isSaving = false,
  hasUnsavedChanges = false,
  lastSaved = null,
  className = ''
}) => {
  const getStatusText = () => {
    if (isSaving) return "Saving...";
    if (hasUnsavedChanges) return "Unsaved changes";
    if (lastSaved) return `Saved ${formatDistanceToNow(new Date(lastSaved))} ago`;
    return "Not saved";
  };

  const getStatusColor = () => {
    if (isSaving) return "text-amber-600";
    if (hasUnsavedChanges) return "text-orange-600";
    if (lastSaved) return "text-green-600";
    return "text-stone-500";
  };

  return (
    <div className={cn(`flex items-center gap-2 text-xs ${getStatusColor()}`, className)}>
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

AutoSaveIndicator.propTypes = {
  isSaving: PropTypes.bool,
  hasUnsavedChanges: PropTypes.bool,
  lastSaved: PropTypes.string,
  className: PropTypes.string
};

export default AutoSaveIndicator;