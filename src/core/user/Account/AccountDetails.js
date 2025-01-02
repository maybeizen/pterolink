/**
 * Handles account details operations
 * @class
 */
class AccountDetails {
  /**
   * Creates a new AccountDetails instance
   * @param {import('../../UserClient.js').default} client - The UserClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get account details
   * @returns {Promise<Object>} Account details
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async get() {
    const response = await this.client.axios.get("/account");
    return response.data;
  }
}

export default AccountDetails;
