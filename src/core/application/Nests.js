class Nests {
  constructor(client) {
    this.client = client;
    this.eggs = new Eggs(this.client);
  }

  async list() {
    try {
      const response = await this.client.axios.get("/nests");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async get(id) {
    try {
      const response = await this.client.axios.get(`/nests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

class Eggs {
  constructor(client) {
    this.client = client;
  }

  async list(id) {
    try {
      const response = await this.client.axios.get(`/nests/${id}/eggs`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async get(id, eggId) {
    try {
      const response = await this.client.axios.get(
        `/nests/${id}/eggs/${eggId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Nests;
