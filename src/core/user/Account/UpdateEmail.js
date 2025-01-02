class Email {
  constructor(client) {
    this.client = client;
  }

  async update(email, password) {
    const response = await this.client.axios.put("/account/email", {
      email,
      password,
    });
    return response.data;
  }
}

export default Email;
