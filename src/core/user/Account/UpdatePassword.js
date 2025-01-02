class UpdatePassword {
  constructor(client) {
    this.client = client;
  }

  async update(current_password, new_password) {
    const response = await this.client.axios.put("/account/password", {
      current_password,
      password: new_password,
      password_confirmation: new_password,
    });
    return response.data;
  }
}

export default UpdatePassword;
