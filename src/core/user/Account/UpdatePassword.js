/**
 * Handles password update operations
 * @class
 */
class UpdatePassword {
  /**
   * Creates a new UpdatePassword instance
   * @param {import('../../UserClient.js').default} client - The UserClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Update account password
   * @param {string} current_password - Current account password
   * @param {string} new_password - New account password
   * @returns {Promise<void>}
   * @throws {ValidationError} If the passwords are invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
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
