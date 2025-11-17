import { getApperClient } from "@/services/apperClient";

export const notebookService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords("notebooks_c", {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        pagingInfo: { limit: 500, offset: 0 }
      });

      if (!response.success) {
        console.error("Failed to fetch notebooks:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching notebooks:", error?.response?.data?.message || error);
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

      const response = await apperClient.getRecordById("notebooks_c", parseInt(id), {
        fields: [
          { field: { Name: "name_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      });

      if (!response.success) {
        console.error("Notebook not found:", response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching notebook by ID:", error?.response?.data?.message || error);
      return null;
    }
  },

  async create(notebookData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const payload = {
        records: [
          {
            name_c: notebookData.name || "Untitled Notebook",
            color_c: notebookData.color || "#F59E0B"
          }
        ]
      };

      const response = await apperClient.createRecord("notebooks_c", payload);

      if (!response.success) {
        console.error("Failed to create notebook:", response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create notebook:`, failed);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error creating notebook:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, notebookData) {
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
            ...(notebookData.name_c !== undefined && { name_c: notebookData.name_c }),
            ...(notebookData.name !== undefined && { name_c: notebookData.name }),
            ...(notebookData.color_c !== undefined && { color_c: notebookData.color_c }),
            ...(notebookData.color !== undefined && { color_c: notebookData.color })
          }
        ]
      };

      const response = await apperClient.updateRecord("notebooks_c", payload);

      if (!response.success) {
        console.error("Failed to update notebook:", response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update notebook:`, failed);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error updating notebook:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord("notebooks_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Failed to delete notebook:", response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting notebook:", error?.response?.data?.message || error);
      return false;
    }
  },

  async updateNoteCount(notebookId, increment) {
    // Note count is typically managed by the backend through relationships
    // This method is kept for API compatibility but may not be needed with backend automation
    try {
      const notebook = await this.getById(notebookId);
      if (!notebook) {
        return null;
      }
      return notebook;
    } catch (error) {
      console.error("Error updating note count:", error?.response?.data?.message || error);
      return null;
    }
  }
};