import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NoteList from "@/components/organisms/NoteList";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { noteService } from "@/services/api/noteService";
import { notebookService } from "@/services/api/notebookService";

const NotebookView = () => {
  const { notebookId } = useParams();
  const navigate = useNavigate();
  const [notebook, setNotebook] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    loadNotebook();
    loadNotes();
  }, [notebookId]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery]);

  const loadNotebook = async () => {
    try {
      const data = await notebookService.getById(notebookId);
      setNotebook(data);
    } catch (err) {
      setError(err.message || "Failed to load notebook");
      console.error("Error loading notebook:", err);
    }
  };

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");
const data = await noteService.getByNotebook(notebookId);
      setNotes(data || []);
    } catch (err) {
      setError(err.message || "Failed to load notes");
      console.error("Error loading notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const query = searchQuery.toLowerCase();
const filtered = notes.filter(note => 
      (note.title_c || "").toLowerCase().includes(query) ||
      (note.content_c || "").toLowerCase().includes(query) ||
      (note.tags_c || []).some(tag => (tag || "").toLowerCase().includes(query))
    );
    setFilteredNotes(filtered);
  };

  const handleCreateNote = () => {
    navigate(`/new?notebook=${notebookId}`);
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
          onRetry={() => {
            loadNotebook();
            loadNotes();
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-stone-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
{notebook && (
              <div 
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{ backgroundColor: notebook.color_c }}
              />
            )}
            <div>
<h1 className="text-2xl font-bold text-stone-800 mb-1">
                {notebook?.name_c || "Notebook"}
              </h1>
              <p className="text-stone-600">
{filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-stone-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list" 
                    ? "bg-white shadow-sm text-stone-800" 
                    : "text-stone-600 hover:text-stone-800"
                }`}
                title="List View"
              >
                <ApperIcon name="List" size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid" 
                    ? "bg-white shadow-sm text-stone-800" 
                    : "text-stone-600 hover:text-stone-800"
                }`}
                title="Grid View"
              >
                <ApperIcon name="Grid3X3" size={18} />
              </button>
            </div>

            {/* New Note Button */}
            <button
              onClick={handleCreateNote}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <ApperIcon name="Plus" size={18} />
              New Note
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search notes in this notebook..."
          value={searchQuery}
          onSearch={setSearchQuery}
          className="max-w-md"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {filteredNotes.length === 0 && !searchQuery ? (
          <Empty
            title="No notes in this notebook"
            description="Create your first note in this notebook to get started"
            actionLabel="Create First Note"
            onAction={handleCreateNote}
            icon="FileText"
          />
        ) : filteredNotes.length === 0 && searchQuery ? (
          <Empty
            title="No results found"
            description={`No notes in this notebook match "${searchQuery}". Try different keywords or create a new note.`}
            actionLabel="Create New Note"
            onAction={handleCreateNote}
            icon="Search"
          />
        ) : (
          <div className="h-full overflow-y-auto">
            <NoteList 
notes={filteredNotes}
              viewMode={viewMode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotebookView;