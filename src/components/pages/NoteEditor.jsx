import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "@/components/atoms/Input";
import RichTextEditor from "@/components/organisms/RichTextEditor";
import NotebookSelector from "@/components/molecules/NotebookSelector";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { noteService } from "@/services/api/noteService";
import { notebookService } from "@/services/api/notebookService";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewNote = !id;

  const [note, setNote] = useState({
    title: "",
    content: "",
    notebookId: 1,
    tags: [],
    images: [],
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!isNewNote) {
      loadNote();
    }
  }, [id, isNewNote]);

  const loadNote = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await noteService.getById(id);
      setNote(data);
      setLastSaved(data.updatedAt);
    } catch (err) {
      setError(err.message || "Failed to load note");
      console.error("Error loading note:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (content = note.content) => {
    try {
      setSaving(true);
      const noteData = {
        ...note,
        content: content || note.content
      };

      let savedNote;
      if (isNewNote) {
        savedNote = await noteService.create(noteData);
        // Update notebook note count
        await notebookService.updateNoteCount(noteData.notebookId, 1);
        navigate(`/note/${savedNote.Id}`, { replace: true });
        toast.success("Note created successfully");
      } else {
        savedNote = await noteService.update(id, noteData);
        toast.success("Note saved successfully");
      }

      setNote(savedNote);
      setLastSaved(savedNote.updatedAt);
      return savedNote;
    } catch (err) {
      console.error("Error saving note:", err);
      toast.error("Failed to save note");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (e) => {
    setNote(prev => ({ ...prev, title: e.target.value }));
  };

  const handleContentChange = (content) => {
    setNote(prev => ({ ...prev, content }));
  };

  const handleNotebookChange = (notebookId) => {
    setNote(prev => ({ ...prev, notebookId }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!note.tags.includes(newTag)) {
        setNote(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    try {
      await noteService.delete(id);
      await notebookService.updateNoteCount(note.notebookId, -1);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Failed to delete note");
    }
  };

  const handleTogglePin = async () => {
    try {
      const updatedNote = await noteService.togglePin(id);
      setNote(updatedNote);
      toast.success(updatedNote.isPinned ? "Note pinned" : "Note unpinned");
    } catch (err) {
      console.error("Error toggling pin:", err);
      toast.error("Failed to update note");
    }
  };

  if (loading) {
    return (
      <div className="h-full p-6">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full">
        <ErrorView 
          error={error} 
          onRetry={loadNote}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-stone-200 bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={20} className="text-stone-600" />
              </button>
              <h1 className="text-xl font-bold text-stone-800">
                {isNewNote ? "New Note" : "Edit Note"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {!isNewNote && (
                <>
                  <button
                    onClick={handleTogglePin}
                    className={`p-2 rounded-lg transition-all ${
                      note.isPinned 
                        ? "bg-amber-100 text-amber-600 hover:bg-amber-200" 
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                    title={note.isPinned ? "Unpin note" : "Pin note"}
                  >
                    <ApperIcon name="Pin" size={18} />
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete note"
                  >
                    <ApperIcon name="Trash2" size={18} />
                  </button>
                </>
              )}

              <button
                onClick={() => saveNote()}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {saving ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title */}
            <Input
              label="Title"
              value={note.title}
              onChange={handleTitleChange}
              placeholder="Enter note title..."
            />

            {/* Notebook */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Notebook
              </label>
              <NotebookSelector
                value={note.notebookId}
                onChange={handleNotebookChange}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {note.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"
                  >
                    <ApperIcon name="X" size={12} />
                  </button>
                </span>
              ))}
            </div>
            <Input
              placeholder="Type a tag and press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
          </div>

          {/* Metadata */}
          {!isNewNote && (
            <div className="mt-6 flex items-center gap-6 text-sm text-stone-500">
              <span>
                Created {formatDistanceToNow(new Date(note.createdAt))} ago
              </span>
              {lastSaved && (
                <span>
                  Last saved {formatDistanceToNow(new Date(lastSaved))} ago
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <RichTextEditor
          content={note.content}
          onContentChange={handleContentChange}
          onSave={saveNote}
          lastSaved={lastSaved}
        />
      </div>
    </div>
  );
};

export default NoteEditor;