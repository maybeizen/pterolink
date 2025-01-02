import Server from "./Server/index.js";
import Account from "./Account/index.js";

/**
 * Handles server-related operations for the user
 * @class
 */
class Servers {
  /**
   * Creates a new Servers instance
   * @param {import('../UserClient.js').default} client - The UserClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * List all servers the user has access to
   * @returns {Promise<Array<Object>>} Array of server objects
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async list() {
    const response = await this.client.axios.get("/servers");
    return response.data.data;
  }

  /**
   * List panel permissions
   * @returns {Promise<Object>} Server permissions object
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async permissions() {
    const response = await this.client.axios.get("/permissions");
    return response.data;
  }

  /**
   * Get a specific server instance
   * @param {string} serverId - The ID of the server
   * @returns {Server} Server instance
   */
  get(serverId) {
    return new Server(this.client, serverId);
  }
}

export { Server, Account, Servers };
