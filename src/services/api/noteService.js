import { getApperClient } from "@/services/apperClient";

export const noteService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords("notes_c", {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "notebookId_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "attachments_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "isPinned_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "Tags" } }
        ],
        pagingInfo: { limit: 500, offset: 0 }
      });

      if (!response.success) {
        console.error("Failed to fetch notes:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching notes:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const response = await apperClient.getRecordById("notes_c", parseInt(id), {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "notebookId_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "attachments_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "isPinned_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "Tags" } }
        ]
      });

      if (!response.success) {
        console.error("Note not found:", response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching note by ID:", error?.response?.data?.message || error);
      return null;
    }
  },

  async getByNotebook(notebookId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords("notes_c", {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "notebookId_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "attachments_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "isPinned_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "notebookId_c",
            Operator: "EqualTo",
            Values: [parseInt(notebookId)]
          }
        ],
        pagingInfo: { limit: 500, offset: 0 }
      });

      if (!response.success) {
        console.error("Failed to fetch notes by notebook:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching notes by notebook:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(noteData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const payload = {
        records: [
          {
            title_c: noteData.title || "Untitled Note",
            content_c: noteData.content || "",
            notebookId_c: parseInt(noteData.notebookId),
            images_c: noteData.images || [],
            attachments_c: noteData.attachments || [],
            tags_c: noteData.tags || [],
            isPinned_c: noteData.isPinned || false
          }
        ]
      };

      const response = await apperClient.createRecord("notes_c", payload);

      if (!response.success) {
        console.error("Failed to create note:", response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create note:`, failed);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error creating note:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, noteData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const payload = {
        records: [
          {
            Id: parseInt(id),
            ...(noteData.title_c !== undefined && { title_c: noteData.title_c }),
            ...(noteData.title !== undefined && { title_c: noteData.title }),
            ...(noteData.content_c !== undefined && { content_c: noteData.content_c }),
            ...(noteData.content !== undefined && { content_c: noteData.content }),
            ...(noteData.notebookId_c !== undefined && { notebookId_c: parseInt(noteData.notebookId_c) }),
            ...(noteData.notebookId !== undefined && { notebookId_c: parseInt(noteData.notebookId) }),
            ...(noteData.images_c !== undefined && { images_c: noteData.images_c }),
            ...(noteData.images !== undefined && { images_c: noteData.images }),
            ...(noteData.attachments_c !== undefined && { attachments_c: noteData.attachments_c }),
            ...(noteData.attachments !== undefined && { attachments_c: noteData.attachments }),
            ...(noteData.tags_c !== undefined && { tags_c: noteData.tags_c }),
            ...(noteData.tags !== undefined && { tags_c: noteData.tags }),
            ...(noteData.isPinned_c !== undefined && { isPinned_c: noteData.isPinned_c }),
            ...(noteData.isPinned !== undefined && { isPinned_c: noteData.isPinned })
          }
        ]
      };

      const response = await apperClient.updateRecord("notes_c", payload);

      if (!response.success) {
        console.error("Failed to update note:", response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update note:`, failed);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error updating note:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return false;
      }

      const response = await apperClient.deleteRecord("notes_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete note:", response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting note:", error?.response?.data?.message || error);
      return false;
    }
  },

  async search(query) {
    try {
      if (!query.trim()) {
        return [];
      }

      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const searchTerm = query.toLowerCase();

      const response = await apperClient.fetchRecords("notes_c", {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "notebookId_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "attachments_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "isPinned_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        where: [
          {
            FieldName: "title_c",
            Operator: "Contains",
            Values: [searchTerm]
          }
        ],
        pagingInfo: { limit: 500, offset: 0 }
      });

      if (!response.success) {
        console.error("Failed to search notes:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching notes:", error?.response?.data?.message || error);
      return [];
    }
  },

  async togglePin(id) {
    try {
      const note = await this.getById(id);
      if (!note) {
        return null;
      }

      const newPinnedState = !note.isPinned_c;
      const updated = await this.update(id, { isPinned_c: newPinnedState });
      return updated;
    } catch (error) {
      console.error("Error toggling pin:", error?.response?.data?.message || error);
      return null;
    }
  },

  async getPinned() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords("notes_c", {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "notebookId_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "attachments_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "isPinned_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        where: [
          {
            FieldName: "isPinned_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ],
        pagingInfo: { limit: 500, offset: 0 }
      });

      if (!response.success) {
        console.error("Failed to fetch pinned notes:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching pinned notes:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getRecent(limit = 10) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords("notes_c", {
        fields: [
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "notebookId_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "attachments_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "isPinned_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          {
            fieldName: "ModifiedOn",
            sorttype: "DESC"
          }
        ],
        pagingInfo: { limit, offset: 0 }
      });

      if (!response.success) {
        console.error("Failed to fetch recent notes:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent notes:", error?.response?.data?.message || error);
      return [];
    }
  }
};