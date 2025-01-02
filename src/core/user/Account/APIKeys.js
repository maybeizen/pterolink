class APIKeys {
  constructor(client) {
    this.client = client;
  }

  async list() {
    const response = await this.client.axios.get("/account/api-keys");
    return response.data;
  }

  async create(description, allowed_ips = []) {
    const response = await this.client.axios.post("/account/api-keys", {
      description,
      allowed_ips,
    });
    return response.data;
  }

  async delete(id) {
    const response = await this.client.axios.delete(`/account/api-keys/${id}`);
    return response.data;
  }
}

export default APIKeys;
