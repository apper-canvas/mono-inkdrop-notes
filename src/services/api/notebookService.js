import notebooksData from "@/services/mockData/notebooks.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let notebooks = [...notebooksData];

export const notebookService = {
  async getAll() {
    await delay(300);
    return [...notebooks];
  },

  async getById(id) {
    await delay(200);
    const notebook = notebooks.find(n => n.Id === parseInt(id));
    if (!notebook) {
      throw new Error("Notebook not found");
    }
    return { ...notebook };
  },

  async create(notebookData) {
    await delay(400);
    const maxId = Math.max(...notebooks.map(n => n.Id), 0);
    const newNotebook = {
      Id: maxId + 1,
      name: notebookData.name,
      color: notebookData.color,
      createdAt: new Date().toISOString(),
      noteCount: 0
    };
    notebooks.push(newNotebook);
    return { ...newNotebook };
  },

  async update(id, notebookData) {
    await delay(300);
    const index = notebooks.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Notebook not found");
    }
    notebooks[index] = { ...notebooks[index], ...notebookData };
    return { ...notebooks[index] };
  },

  async delete(id) {
    await delay(250);
    const index = notebooks.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Notebook not found");
    }
    notebooks.splice(index, 1);
    return true;
  },

  async updateNoteCount(notebookId, increment) {
    await delay(100);
    const notebook = notebooks.find(n => n.Id === parseInt(notebookId));
    if (notebook) {
      notebook.noteCount = Math.max(0, notebook.noteCount + increment);
    }
    return notebook;
  }
};