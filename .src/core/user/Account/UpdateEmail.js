/**
 * Handles email update operations
 * @class
 */
class Email {
  /**
   * Creates a new Email instance
   * @param {import('../../UserClient.js').default} client - The UserClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Update account email
   * @param {string} email - New email address
   * @param {string} password - Current account password
   * @returns {Promise<void>}
   * @throws {ValidationError} If the email or password is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async update(email, password) {
    const response = await this.client.axios.put("/account/email", {
      email,
      password,
    });
    return response.data;
  }
}

export default Email;
