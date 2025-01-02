/**
 * Handles two-factor authentication operations
 * @class
 */
class TwoFactor {
  /**
   * Creates a new TwoFactor instance
   * @param {import('../../UserClient.js').default} client - The UserClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get 2FA details
   * @param {string} code - The 2FA code
   * @returns {Promise<Object>} 2FA details
   * @throws {ValidationError} If the code is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async details(code) {
    const response = await this.client.axios.get("/account/two-factor", {
      code: code,
    });
    return response.data;
  }

  /**
   * Enable 2FA
   * @param {string} code - The 2FA code
   * @returns {Promise<Object>} 2FA setup details including recovery codes
   * @throws {ValidationError} If the code is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async enable(code) {
    const response = await this.client.axios.post("/account/two-factor", {
      code: code,
    });
    return response.data;
  }

  /**
   * Disable 2FA
   * @param {string} password - Account password
   * @returns {Promise<void>}
   * @throws {ValidationError} If the password is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
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
