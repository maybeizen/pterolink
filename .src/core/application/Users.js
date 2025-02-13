/**
 * Represents the Users API endpoint handler
 * @class
 */
class Users {
  /**
   * Creates a new Users instance
   * @param {import('../Client.js').default} client - The PteroClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * List all users on the panel
   * @returns {Promise<Array<Object>>} Array of user objects
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async list() {
    try {
      const response = await this.client.axios.get("/users");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get details of a specific user
   * @param {number|string} id - The ID of the user
   * @returns {Promise<Object>} User details
   * @throws {NotFoundError} If the user doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async get(id) {
    try {
      const response = await this.client.axios.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new user on the panel
   * @param {Object} data - The user creation data
   * @param {string} data.email - User's email address
   * @param {string} data.username - Username
   * @param {string} data.first_name - User's first name
   * @param {string} data.last_name - User's last name
   * @param {string} [data.password] - User's password (optional if using external auth)
   * @param {boolean} [data.root_admin=false] - Whether the user is a root admin
   * @param {string} [data.language='en'] - User's preferred language
   * @returns {Promise<Object>} Created user details
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async create(data) {
    try {
      const response = await this.client.axios.post("/users", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a user's details
   * @param {number|string} id - The ID of the user to update
   * @param {Object} data - The data to update
   * @param {string} [data.email] - User's email address
   * @param {string} [data.username] - Username
   * @param {string} [data.first_name] - User's first name
   * @param {string} [data.last_name] - User's last name
   * @param {string} [data.password] - User's password
   * @param {boolean} [data.root_admin] - Whether the user is a root admin
   * @param {string} [data.language] - User's preferred language
   * @returns {Promise<Object>} Updated user details
   * @throws {NotFoundError} If the user doesn't exist
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async update(id, data) {
    try {
      const response = await this.client.axios.patch(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a user from the panel
   * This will also delete all servers owned by the user.
   * @param {number|string} id - The ID of the user to delete
   * @returns {Promise<boolean>} True if deletion was successful
   * @throws {NotFoundError} If the user doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async delete(id) {
    try {
      await this.client.axios.delete(`/users/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default Users;
