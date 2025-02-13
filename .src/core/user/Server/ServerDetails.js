class ServerDetails {
  constructor(client) {
    this.client = client;
  }

  async get(id) {
    const response = await this.client.axios.get(`/servers/${id}`);
    return response.data;
  }
}

export default ServerDetails;
