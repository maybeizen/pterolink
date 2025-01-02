class AccountDetails {
  constructor(client) {
    this.client = client;
  }

  async get() {
    const response = await this.client.axios.get("/account");
    return response.data;
  }
}

export default AccountDetails;
