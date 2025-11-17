import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoteList from "@/components/organisms/NoteList";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { noteService } from "@/services/api/noteService";
import { toast } from "react-toastify";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("updated");
  const navigate = useNavigate();

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchQuery, sortBy]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");
const data = await noteService.getAll();
      setNotes(data || []);
    } catch (err) {
      setError(err.message || "Failed to load notes");
      console.error("Error loading notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortNotes = () => {
    let filtered = [...notes];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
filtered = filtered.filter(note => 
        (note.title_c || "").toLowerCase().includes(query) ||
        (note.content_c || "").toLowerCase().includes(query) ||
        (note.tags_c || []).some(tag => (tag || "").toLowerCase().includes(query))
      );
    }

    // Sort notes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "created":
return new Date(b.CreatedOn) - new Date(a.CreatedOn);
        case "updated":
          return new Date(b.ModifiedOn) - new Date(a.ModifiedOn);
        case "title":
          return (a.title_c || "").localeCompare(b.title_c || "");
        case "pinned":
          if (a.isPinned_c && !b.isPinned_c) return -1;
          if (!a.isPinned_c && b.isPinned_c) return 1;
          return new Date(b.ModifiedOn) - new Date(a.ModifiedOn);
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

    setFilteredNotes(filtered);
  };

  const handleCreateNote = () => {
    navigate("/new");
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
          onRetry={loadNotes}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-stone-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 mb-1">All Notes</h1>
            <p className="text-stone-600">
{filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
            </p>
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

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="title">Title A-Z</option>
              <option value="pinned">Pinned First</option>
            </select>

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
          placeholder="Search notes, content, and tags..."
          value={searchQuery}
          onSearch={setSearchQuery}
          className="max-w-md"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {filteredNotes.length === 0 && !searchQuery ? (
          <Empty
            title="No notes yet"
            description="Create your first note to get started capturing your thoughts and ideas"
            actionLabel="Create First Note"
            onAction={handleCreateNote}
            icon="FileText"
          />
        ) : filteredNotes.length === 0 && searchQuery ? (
          <Empty
            title="No results found"
            description={`No notes match "${searchQuery}". Try different keywords or create a new note.`}
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

export default Home;