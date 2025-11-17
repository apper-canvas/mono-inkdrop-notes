import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NoteList from "@/components/organisms/NoteList";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { noteService } from "@/services/api/noteService";

const Recent = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadRecentNotes();
  }, []);

  const loadRecentNotes = async () => {
    try {
      setLoading(true);
      setError("");
const data = await noteService.getRecent(20);
      setNotes(data || []);
    } catch (err) {
      setError(err.message || "Failed to load recent notes");
      console.error("Error loading recent notes:", err);
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

  if (error) {
    return (
      <div className="h-full">
        <ErrorView 
          error={error} 
          onRetry={loadRecentNotes}
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
            <h1 className="text-2xl font-bold text-stone-800 mb-1">Recent Notes</h1>
            <p className="text-stone-600">
{notes.length} recently edited {notes.length === 1 ? "note" : "notes"}
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
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {notes.length === 0 ? (
          <Empty
            title="No recent notes"
            description="Notes you've recently edited will appear here. Create your first note to get started."
            actionLabel="Create First Note"
            onAction={handleCreateNote}
            icon="Clock"
          />
        ) : (
          <div className="h-full overflow-y-auto">
<NoteList notes={notes} viewMode="list" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Recent;