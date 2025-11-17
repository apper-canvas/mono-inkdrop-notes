import React, { useState, useEffect } from "react";
import NoteList from "@/components/organisms/NoteList";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { noteService } from "@/services/api/noteService";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
    loadRecentNotes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [searchQuery]);

  const loadRecentNotes = async () => {
    try {
const notes = await noteService.getRecent(8);
      setRecentNotes(notes);
    } catch (error) {
      console.error("Error loading recent notes:", error);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
const results = await noteService.search(searchQuery);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-stone-200 bg-white">
        <h1 className="text-2xl font-bold text-stone-800 mb-4">Search Notes</h1>
        
        <div className="relative max-w-2xl">
          <SearchBar
            placeholder="Search by title, content, tags, or file names..."
            value={searchQuery}
            onSearch={setSearchQuery}
            className="w-full"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-200 rounded transition-colors"
            >
              <ApperIcon name="X" size={16} className="text-stone-500" />
            </button>
          )}
        </div>

        {hasSearched && (
          <p className="mt-4 text-stone-600">
            {loading 
              ? "Searching..." 
              : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${searchQuery}"`
            }
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <Loading />
          </div>
        ) : !hasSearched ? (
          // Show recent notes when no search performed
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-stone-800 mb-4">
                Recent Notes
              </h2>
              {recentNotes.length > 0 ? (
                <NoteList notes={recentNotes} viewMode="list" />
              ) : (
                <Empty
                  title="No recent notes"
                  description="Start by creating some notes to see them here"
                  icon="Clock"
                />
              )}
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          // Show search results
          <div className="h-full overflow-y-auto">
            <NoteList notes={searchResults} viewMode="list" />
          </div>
        ) : (
          // No results found
          <Empty
            title="No results found"
            description={`No notes match "${searchQuery}". Try different keywords or check your spelling.`}
            icon="Search"
          />
        )}
      </div>
    </div>
  );
};

export default Search;