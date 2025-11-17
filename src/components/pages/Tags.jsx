import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoteList from "@/components/organisms/NoteList";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { noteService } from "@/services/api/noteService";
import { cn } from "@/utils/cn";

const Tags = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      const filtered = allNotes.filter(note => 
        note.tags.includes(selectedTag)
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(allNotes);
    }
  }, [selectedTag, allNotes]);

  const loadNotes = async () => {
    try {
      setLoading(true);
const notes = await noteService.getAll();
      setAllNotes(notes || []);
      
      // Extract all unique tags
      const allTags = new Set();
notes.forEach(note => {
        (note.tags_c || []).forEach(tag => allTags.add(tag));
      });
      
      // Convert to array with counts
      const tagsWithCounts = Array.from(allTags).map(tag => ({
        name: tag,
        count: notes.filter(note => note.tags.includes(tag)).length
      })).sort((a, b) => b.count - a.count);
      
      setTags(tagsWithCounts);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-stone-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 mb-1">Tags</h1>
            <p className="text-stone-600">
              {selectedTag 
                ? `${filteredNotes.length} notes tagged with "${selectedTag}"` 
                : `${tags.length} unique tags across all notes`
              }
            </p>
          </div>
          
          <button
            onClick={handleCreateNote}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <ApperIcon name="Plus" size={18} />
            New Note
          </button>
        </div>

        {/* Tag Filter */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag("")}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                !selectedTag 
                  ? "bg-amber-100 text-amber-800 border-2 border-amber-300" 
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200 border-2 border-transparent"
              )}
            >
              <ApperIcon name="Tag" size={14} />
              All Tags
              <span className="text-xs bg-white rounded-full px-2 py-0.5">
                {allNotes.length}
              </span>
            </button>
            
{tags.map(tag => (
              <button
                key={tag.name}
                onClick={() => setSelectedTag(tag.name)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedTag === tag.name 
                    ? "bg-amber-100 text-amber-800 border-2 border-amber-300" 
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 border-2 border-transparent"
                )}
              >
                {tag.name}
                <span className="text-xs bg-white rounded-full px-2 py-0.5">
                  {tag.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tags.length === 0 ? (
          <Empty
            title="No tags found"
            description="Start adding tags to your notes to organize and find them easily"
            actionLabel="Create First Note"
            onAction={handleCreateNote}
            icon="Tag"
          />
        ) : filteredNotes.length === 0 && selectedTag ? (
          <Empty
            title="No notes with this tag"
            description={`No notes are tagged with "${selectedTag}". Try selecting a different tag.`}
            actionLabel="Create New Note"
            onAction={handleCreateNote}
            icon="Tag"
          />
        ) : (
          <div className="h-full overflow-y-auto">
            <NoteList notes={filteredNotes} viewMode="list" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tags;