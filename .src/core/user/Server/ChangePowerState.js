class ChangePowerState {
  constructor(client) {
    this.client = client;
  }

  async start(id) {
    const response = await this.client.axios.post(`/servers/${id}/power`, {
      signal: "start",
    });
    return response.data;
  }

  async stop(id) {
    const response = await this.client.axios.post(`/servers/${id}/power`, {
      signal: "stop",
    });
    return response.data;
  }

  async restart(id) {
    const response = await this.client.axios.post(`/servers/${id}/power`, {
      signal: "restart",
    });
    return response.data;
  }

  async kill(id) {
    const response = await this.client.axios.post(`/servers/${id}/power`, {
      signal: "kill",
    });
    return response.data;
  }
}

export default ChangePowerState;
