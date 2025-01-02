/**
 * Handles API key operations
 * @class
 */
class APIKeys {
  /**
   * Creates a new APIKeys instance
   * @param {import('../../UserClient.js').default} client - The UserClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * List all API keys
   * @returns {Promise<Array<Object>>} Array of API key objects
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async list() {
    const response = await this.client.axios.get("/account/api-keys");
    return response.data;
  }

  /**
   * Create a new API key
   * @param {string} description - Description of the API key
   * @param {Array<string>} [allowed_ips=[]] - Array of allowed IP addresses
   * @returns {Promise<Object>} Created API key details
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async create(description, allowed_ips = []) {
    const response = await this.client.axios.post("/account/api-keys", {
      description,
      allowed_ips,
    });
    return response.data;
  }

  /**
   * Delete an API key
   * @param {string} id - The ID of the API key to delete
   * @returns {Promise<void>}
   * @throws {NotFoundError} If the API key doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async delete(id) {
    const response = await this.client.axios.delete(`/account/api-keys/${id}`);
    return response.data;
  }
}

export default APIKeys;
