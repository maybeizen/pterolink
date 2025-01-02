class TwoFactor {
  constructor(client) {
    this.client = client;
  }

  async details(code) {
    const response = await this.client.axios.get("/account/two-factor", {
      code: code,
    });
    return response.data;
  }

  async enable(code) {
    const response = await this.client.axios.post("/account/two-factor", {
      code: code,
    });
    return response.data;
  }

  async disable(password) {
    const response = await this.client.axios.delete("/account/two-factor", {
      data: {
        password: password,
      },
    });
    return response.data;
  }
}

export default TwoFactor;
