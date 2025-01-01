class Locations {
  constructor(client) {
    this.client = client;
  }

  async list() {
    try {
      const response = await this.client.axios.get("/locations");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async get(id) {
    try {
      const response = await this.client.axios.get(`/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const response = await this.client.axios.post("/locations", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await this.client.axios.patch(`/locations/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.client.axios.delete(`/locations/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default Locations;
