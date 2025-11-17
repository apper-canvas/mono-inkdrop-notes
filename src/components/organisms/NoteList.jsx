import React, { useEffect, useState } from "react";
import { noteService } from "@/services/api/noteService";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/atoms/Card";
import { cn } from "@/utils/cn";
import { formatDateSafe } from "@/utils/formatDateSafe";
import ApperIcon from "@/components/ApperIcon";

const NoteList = ({ notes, viewMode = "list", onNoteSelect, selectedNoteId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleNoteClick = (note) => {
    if (onNoteSelect) {
      onNoteSelect(note.Id);
    } else {
      navigate(`/note/${note.Id}`);
    }
  };

  const extractTextFromHTML = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-stone-50 rounded-lg p-4 space-y-3">
              <div className="h-5 bg-stone-300 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-stone-200 rounded w-full" />
                <div className="h-4 bg-stone-200 rounded w-5/6" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-stone-300 rounded w-20" />
                <div className="h-4 bg-stone-300 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <ApperIcon name="FileText" size={32} className="text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-stone-800 mb-2">No notes yet</h3>
        <p className="text-stone-600 mb-6">Create your first note to get started</p>
        <button
          onClick={() => navigate("/new")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <ApperIcon name="Plus" size={18} />
          Create Note
        </button>
      </div>
    );
  }

  const gridView = viewMode === "grid";

  return (
    <div className="p-6">
      <div className={cn(
        gridView ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"
      )}>
        {notes.map(note => {
          const previewText = extractTextFromHTML(note.content);
          const hasImages = note.images && note.images.length > 0;
          const hasAttachments = note.attachments && note.attachments.length > 0;
          const isSelected = selectedNoteId === note.Id;

          return (
            <div
              key={note.Id}
              onClick={() => handleNoteClick(note)}
              className={cn(
                "bg-white border border-stone-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-stone-300 group",
                isSelected && "ring-2 ring-amber-500 border-amber-500 shadow-md",
                gridView ? "h-48 flex flex-col" : "flex items-start gap-4"
              )}
            >
              {/* Thumbnail for grid view or left side for list view */}
              {hasImages && (
                <div className={cn(
                  "bg-stone-100 rounded overflow-hidden flex-shrink-0",
                  gridView ? "w-full h-20 mb-3" : "w-16 h-16"
                )}>
                  <img 
                    src={note.images[0].url} 
                    alt={note.images[0].caption || "Note image"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className={cn(
                "flex-1 min-w-0",
                gridView ? "flex flex-col" : ""
              )}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className={cn(
                    "font-semibold text-stone-800 truncate group-hover:text-amber-700 transition-colors",
                    gridView ? "text-base" : "text-lg"
                  )}>
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    {note.isPinned && (
                      <ApperIcon name="Pin" size={14} className="text-amber-600" />
                    )}
                    {hasImages && (
                      <ApperIcon name="Image" size={14} className="text-stone-400" />
                    )}
                    {hasAttachments && (
                      <ApperIcon name="Paperclip" size={14} className="text-stone-400" />
                    )}
                  </div>
                </div>

                {previewText && (
                  <p className={cn(
                    "text-stone-600 leading-relaxed mb-3",
                    gridView ? "text-sm flex-1" : "text-sm"
                  )}>
                    {truncateText(previewText, gridView ? 100 : 150)}
                  </p>
                )}

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.slice(0, gridView ? 2 : 3).map(tag => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > (gridView ? 2 : 3) && (
                      <span className="inline-block px-2 py-1 text-xs text-stone-500">
                        +{note.tags.length - (gridView ? 2 : 3)} more
                      </span>
                    )}
                  </div>
)}

                {/* Meta information */}
                <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100">
                  <span>
                    {note.notebook?.name}
                  </span>
                  <span>
                    {formatDateSafe(note.updatedAt)} ago
                  </span>
                </div>

                {/* Additional metadata with icons */}
                <div className="flex items-center gap-3 text-xs text-stone-500 pt-2">
                  {hasImages && (
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Image" size={12} />
                      {note.images.length}
                    </span>
                  )}
                  {hasAttachments && (
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Paperclip" size={12} />
                      {note.attachments.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NoteList;