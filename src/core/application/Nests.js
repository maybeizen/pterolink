/**
 * Represents the Nests API endpoint handler
 * @class
 */
class Nests {
  /**
   * Creates a new Nests instance
   * @param {import('../Client.js').default} client - The ApplicationClient instance
   */
  constructor(client) {
    this.client = client;
    this.eggs = new Eggs(this.client);
  }

  /**
   * List all nests on the panel
   * @returns {Promise<Array<Object>>} Array of nest objects
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async list() {
    try {
      const response = await this.client.axios.get("/nests");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get details of a specific nest
   * @param {number|string} id - The ID of the nest
   * @returns {Promise<Object>} Nest details
   * @throws {NotFoundError} If the nest doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async get(id) {
    try {
      const response = await this.client.axios.get(`/nests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Represents the Eggs API endpoint handler
 * @class
 */
class Eggs {
  /**
   * Creates a new Eggs instance
   * @param {import('../Client.js').default} client - The ApplicationClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * List all eggs in a nest
   * @param {number|string} id - The ID of the nest
   * @returns {Promise<Array<Object>>} Array of egg objects
   * @throws {NotFoundError} If the nest doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async list(id) {
    try {
      const response = await this.client.axios.get(`/nests/${id}/eggs`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get details of a specific egg
   * @param {number|string} id - The ID of the nest
   * @param {number|string} eggId - The ID of the egg
   * @returns {Promise<Object>} Egg details
   * @throws {NotFoundError} If the nest or egg doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async get(id, eggId) {
    try {
      const response = await this.client.axios.get(
        `/nests/${id}/eggs/${eggId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Nests;
