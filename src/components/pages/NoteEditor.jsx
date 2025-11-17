import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDateSafe } from "@/utils/formatDateSafe";
import { noteService } from "@/services/api/noteService";
import { notebookService } from "@/services/api/notebookService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import NotebookSelector from "@/components/molecules/NotebookSelector";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Tags from "@/components/pages/Tags";
import RichTextEditor from "@/components/organisms/RichTextEditor";
import Input from "@/components/atoms/Input";

const NoteEditor = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const isNewNote = !noteId;

const [note, setNote] = useState({
    title_c: "",
    content_c: "",
    notebookId_c: 1,
    tags_c: [],
    images_c: [],
    attachments_c: []
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
  }, [noteId, isNewNote]);
const loadNote = async () => {
    try {
      setLoading(true);
      setError("");
const data = await noteService.getById(noteId);
      setNote(data || {});
      setLastSaved(data?.ModifiedOn);
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
        content_c: content || note.content_c
      };
      let savedNote;
      if (!noteId) {
        savedNote = await noteService.create(noteData);
        await notebookService.updateNoteCount(noteData.notebookId_c, 1);
        if (savedNote) {
          navigate(`/note/${savedNote.Id}`, { replace: true });
          toast.success("Note created successfully");
        }
      } else {
        savedNote = await noteService.update(noteId, noteData);
        toast.success("Note saved successfully");
      }

      if (savedNote) {
        setNote(savedNote);
        setLastSaved(savedNote.ModifiedOn);
      }
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
setNote(prev => ({ ...prev, title_c: e.target.value }));
  };

  const handleContentChange = (content) => {
setNote(prev => ({ ...prev, content_c: content }));
  };

  const handleNotebookChange = (notebookId) => {
setNote(prev => ({ ...prev, notebookId_c: notebookId }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
if (!(note.tags_c || []).includes(newTag)) {
        setNote(prev => ({
          ...prev,
          tags_c: [...(prev.tags_c || []), newTag]
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNote(prev => ({
...prev,
      tags_c: (prev.tags_c || []).filter(tag => tag !== tagToRemove)
    }));
  };

const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    
    try {
await noteService.delete(noteId);
      await notebookService.updateNoteCount(note.notebookId_c, -1);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (err) {
      console.error("Error deleting note:", err);
      toast.error("Failed to delete note");
    }
  };

const handleTogglePin = async () => {
    try {
const updatedNote = await noteService.togglePin(noteId);
      if (updatedNote) {
        setNote(updatedNote);
      }
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
note.isPinned_c
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
value={note.title_c || ""}
              onChange={handleTitleChange}
              placeholder="Enter note title..."
            />

            {/* Notebook */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Notebook
              </label>
              <NotebookSelector
value={note.notebookId_c || 1}
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
{(note.tags_c || []).map(tag => (
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
          <div className="flex items-center gap-4 text-xs text-stone-500 mt-6">
            <span>
Created {formatDateSafe(note.CreatedOn)} ago
            </span>
            <span>
              Last saved {formatDateSafe(lastSaved)} ago
            </span>
          </div>
        </div>
      </div>

      {/* Editor */}
      {/* Editor */}
      <div className="flex-1">
        <RichTextEditor
content={note.content_c || ""}
          onContentChange={handleContentChange}
          onSave={saveNote}
          lastSaved={lastSaved}
        />
      </div>
    </div>
  );
};

export default NoteEditor;