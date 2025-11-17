import React, { useState, useRef, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import FileUploadZone from "@/components/molecules/FileUploadZone";
import AutoSaveIndicator from "@/components/molecules/AutoSaveIndicator";
import { cn } from "@/utils/cn";

const RichTextEditor = ({ 
  content = "", 
  onContentChange, 
  onSave, 
  lastSaved, 
  className = "" 
}) => {
  const [editorContent, setEditorContent] = useState(content);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isaving, setIsaving] = useState(false);
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  useEffect(() => {
    // Auto-save functionality
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (hasUnsavedChanges) {
      saveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editorContent, hasUnsavedChanges]);

  const handleAutoSave = async () => {
    if (!hasUnsavedChanges) return;
    
    setIsaving(true);
    try {
      await onSave?.(editorContent);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsaving(false);
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.innerHTML;
    setEditorContent(newContent);
    setHasUnsavedChanges(true);
    onContentChange?.(newContent);
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      
      setToolbarPosition({
        top: rect.top - editorRect.top - 50,
        left: rect.left - editorRect.left + rect.width / 2 - 150
      });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    setShowToolbar(false);
  };

  const handleImageUpload = (uploadedFiles) => {
    const images = uploadedFiles.filter(file => file.type.startsWith("image/"));
    images.forEach(image => {
      const imageTag = `<img src="${image.url}" alt="${image.name}" style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px;" />`;
      const newContent = editorContent + imageTag;
      setEditorContent(newContent);
      setHasUnsavedChanges(true);
      onContentChange?.(newContent);
    });
    setShowUploadZone(false);
  };

  const insertHeading = (level) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString() || "Heading";
      const headingTag = `<h${level}>${selectedText}</h${level}>`;
      
      range.deleteContents();
      const div = document.createElement("div");
      div.innerHTML = headingTag;
      range.insertNode(div.firstChild);
    }
    editorRef.current.focus();
    setShowToolbar(false);
  };

  return (
    <div className={cn("relative h-full flex flex-col", className)}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowUploadZone(!showUploadZone)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-all"
          >
            <ApperIcon name="Plus" size={16} />
            Add Media
          </button>
          
          <button
            onClick={() => execCommand("insertUnorderedList")}
            className="p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-all"
            title="Bullet List"
          >
            <ApperIcon name="List" size={16} />
          </button>
          
          <button
            onClick={() => execCommand("insertOrderedList")}
            className="p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-all"
            title="Numbered List"
          >
            <ApperIcon name="ListOrdered" size={16} />
          </button>
        </div>

        <AutoSaveIndicator 
          lastSaved={lastSaved}
          isaving={isaving}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>

      {/* Upload Zone */}
      {showUploadZone && (
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <FileUploadZone 
            onFileUpload={handleImageUpload}
            acceptedTypes="image/*"
            className="border-stone-300"
          />
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 relative paper-texture">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          onMouseUp={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          className="h-full p-16 focus:outline-none editor-content overflow-y-auto"
          style={{ minHeight: "500px" }}
          dangerouslySetInnerHTML={{ __html: editorContent }}
          suppressContentEditableWarning={true}
        />

        {/* Floating Toolbar */}
        {showToolbar && (
          <div
            className="absolute z-10 bg-stone-800 text-white rounded-lg shadow-lg p-2 flex items-center gap-1"
            style={{
              top: `${toolbarPosition.top}px`,
              left: `${Math.max(0, toolbarPosition.left)}px`,
              transform: "translateX(-50%)"
            }}
          >
            <button
              onClick={() => execCommand("bold")}
              className="p-2 hover:bg-stone-700 rounded transition-colors"
              title="Bold"
            >
              <ApperIcon name="Bold" size={14} />
            </button>
            <button
              onClick={() => execCommand("italic")}
              className="p-2 hover:bg-stone-700 rounded transition-colors"
              title="Italic"
            >
              <ApperIcon name="Italic" size={14} />
            </button>
            <button
              onClick={() => execCommand("underline")}
              className="p-2 hover:bg-stone-700 rounded transition-colors"
              title="Underline"
            >
              <ApperIcon name="Underline" size={14} />
            </button>
            <div className="w-px h-6 bg-stone-600 mx-1" />
            <button
              onClick={() => insertHeading(1)}
              className="px-2 py-1 hover:bg-stone-700 rounded transition-colors text-sm font-bold"
              title="Heading 1"
            >
              H1
            </button>
            <button
              onClick={() => insertHeading(2)}
              className="px-2 py-1 hover:bg-stone-700 rounded transition-colors text-sm font-bold"
              title="Heading 2"
            >
              H2
            </button>
            <button
              onClick={() => insertHeading(3)}
              className="px-2 py-1 hover:bg-stone-700 rounded transition-colors text-sm font-bold"
              title="Heading 3"
            >
              H3
            </button>
            <div className="w-px h-6 bg-stone-600 mx-1" />
            <button
              onClick={() => execCommand("createLink", prompt("Enter URL:"))}
              className="p-2 hover:bg-stone-700 rounded transition-colors"
              title="Add Link"
            >
              <ApperIcon name="Link" size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;