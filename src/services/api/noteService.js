import notesData from "@/services/mockData/notes.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let notes = [...notesData];

export const noteService = {
  async getAll() {
    await delay(300);
    return [...notes];
  },

  async getById(id) {
    await delay(200);
    const note = notes.find(n => n.Id === parseInt(id));
    if (!note) {
      throw new Error("Note not found");
    }
    return { ...note };
  },

  async getByNotebook(notebookId) {
    await delay(250);
    return notes.filter(n => n.notebookId === parseInt(notebookId));
  },

  async create(noteData) {
    await delay(400);
    const maxId = Math.max(...notes.map(n => n.Id), 0);
    const newNote = {
      Id: maxId + 1,
      notebookId: noteData.notebookId,
      title: noteData.title || "Untitled Note",
      content: noteData.content || "",
      images: noteData.images || [],
      attachments: noteData.attachments || [],
      tags: noteData.tags || [],
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    return { ...newNote };
  },

  async update(id, noteData) {
    await delay(300);
    const index = notes.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Note not found");
    }
    notes[index] = { 
      ...notes[index], 
      ...noteData, 
      updatedAt: new Date().toISOString() 
    };
    return { ...notes[index] };
  },

  async delete(id) {
    await delay(250);
    const index = notes.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Note not found");
    }
    notes.splice(index, 1);
    return true;
  },

  async search(query) {
    await delay(200);
    if (!query.trim()) {
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    return notes.filter(note => {
      return (
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        note.attachments.some(att => att.name.toLowerCase().includes(searchTerm))
      );
    });
  },

  async togglePin(id) {
    await delay(200);
    const note = notes.find(n => n.Id === parseInt(id));
    if (note) {
      note.isPinned = !note.isPinned;
      note.updatedAt = new Date().toISOString();
    }
    return { ...note };
  },

  async getPinned() {
    await delay(200);
    return notes.filter(n => n.isPinned);
  },

  async getRecent(limit = 10) {
    await delay(200);
    return [...notes]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit);
  }
};