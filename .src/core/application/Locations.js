/**
 * Represents the Locations API endpoint handler
 * @class
 */
class Locations {
  /**
   * Creates a new Locations instance
   * @param {import('../Client.js').default} client - The ApplicationClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * List all locations on the panel
   * @returns {Promise<Array<Object>>} Array of location objects
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async list() {
    try {
      const response = await this.client.axios.get("/locations");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get details of a specific location
   * @param {number|string} id - The ID of the location
   * @returns {Promise<Object>} Location details
   * @throws {NotFoundError} If the location doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async get(id) {
    try {
      const response = await this.client.axios.get(`/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new location
   * @param {Object} data - The location creation data
   * @param {string} data.short - Short identifier for the location
   * @param {string} data.long - Long name for the location
   * @returns {Promise<Object>} Created location details
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async create(data) {
    try {
      const response = await this.client.axios.post("/locations", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a location's details
   * @param {number|string} id - The ID of the location to update
   * @param {Object} data - The data to update
   * @param {string} [data.short] - Short identifier for the location
   * @param {string} [data.long] - Long name for the location
   * @returns {Promise<Object>} Updated location details
   * @throws {NotFoundError} If the location doesn't exist
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async update(id, data) {
    try {
      const response = await this.client.axios.patch(`/locations/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a location
   * @param {number|string} id - The ID of the location to delete
   * @returns {Promise<boolean>} True if the location was deleted successfully
   * @throws {NotFoundError} If the location doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async delete(id) {
    try {
      await this.client.axios.delete(`/locations/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default Locations;
