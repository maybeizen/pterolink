/**
 * Represents the Servers API endpoint handler
 * @class
 */
class Servers {
  /**
   * Creates a new Servers instance
   * @param {import('../Client.js').default} client - The ApplicationClient instance
   */
  constructor(client) {
    this.client = client;
    this.details = new Details(client);
    this.startup = new Startup(client);
    this.build = new Build(client);
    this.database = new Database(client);
  }

  /**
   * List all servers on the panel
   * @returns {Promise<Array<Object>>} Array of server objects
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async list() {
    const response = await this.client.axios.get("/servers");
    return response.data.data;
  }

  /**
   * Get details of a specific server
   * @param {number|string} id - The ID of the server
   * @returns {Promise<Object>} Server details
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async get(id) {
    const response = await this.client.axios.get(`/servers/${id}`);
    return response.data;
  }

  /**
   * Get details of a server by external ID
   * @param {number|string} id - The external ID of the server
   * @returns {Promise<Object>} Server details
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async getExternal(id) {
    const response = await this.client.axios.get(`/servers/external/${id}`);
    return response.data;
  }

  /**
   * Create a new server
   * @param {Object} data - The server creation data
   * @param {string} data.name - Server name
   * @param {string} data.user - User ID that will own the server
   * @param {string} data.egg - Egg ID that will be used to run the server
   * @param {string} data.docker_image - Docker image that will be used to run the server
   * @param {string} data.startup - Startup command for the server
   * @param {Object} data.limits - Server resource limits
   * @param {number} data.limits.memory - Memory limit in MB
   * @param {number} data.limits.swap - Swap limit in MB
   * @param {number} data.limits.disk - Disk limit in MB
   * @param {number} data.limits.io - Block IO weight
   * @param {number} data.limits.cpu - CPU limit percentage
   * @returns {Promise<Object>} Created server details
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async create(data) {
    const response = await this.client.axios.post("/servers", data);
    return response.data;
  }

  /**
   * Suspend a server
   * @param {number|string} id - The ID of the server to suspend
   * @returns {Promise<Object>} Response data
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async suspend(id) {
    const response = await this.client.axios.post(`/servers/${id}/suspend`);
    return response.data;
  }

  /**
   * Unsuspend a server
   * @param {number|string} id - The ID of the server to unsuspend
   * @returns {Promise<Object>} Response data
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async unsuspend(id) {
    const response = await this.client.axios.post(`/servers/${id}/unsuspend`);
    return response.data;
  }

  /**
   * Reinstall a server
   * @param {number|string} id - The ID of the server to reinstall
   * @returns {Promise<Object>} Response data
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async reinstall(id) {
    const response = await this.client.axios.post(`/servers/${id}/reinstall`);
    return response.data;
  }

  /**
   * Delete a server
   * @param {number|string} id - The ID of the server to delete
   * @returns {Promise<Object>} Response data
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async delete(id) {
    const response = await this.client.axios.delete(`/servers/${id}`);
    return response.data;
  }

  /**
   * Force delete a server
   * @param {number|string} id - The ID of the server to force delete
   * @returns {Promise<Object>} Response data
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async forceDelete(id) {
    const response = await this.client.axios.delete(`/servers/${id}/force`);
    return response.data;
  }
}

/**
 * Handles server database operations
 * @class
 */
class Database {
  /**
   * @param {import('../Client.js').default} client - The ApplicationClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * List all databases for a server
   * @param {number|string} id - The ID of the server
   * @returns {Promise<Array<Object>>} Array of database objects
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async list(id) {
    const response = await this.client.axios.get(`/servers/${id}/databases`);
    return response.data.data;
  }

  /**
   * Get details of a specific database
   * @param {number|string} id - The ID of the server
   * @param {number|string} databaseId - The ID of the database
   * @returns {Promise<Object>} Database details
   * @throws {NotFoundError} If the server or database doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async details(id, databaseId) {
    const response = await this.client.axios.get(
      `/servers/${id}/databases/${databaseId}`
    );
    return response.data;
  }

  /**
   * Create a new database for a server
   * @param {number|string} id - The ID of the server
   * @param {Object} data - The database creation data
   * @param {string} data.database - The name of the database
   * @param {string} data.remote - The remote connection string
   * @returns {Promise<Object>} Created database details
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async create(id, data) {
    const response = await this.client.axios.post(
      `/servers/${id}/databases`,
      data
    );
    return response.data;
  }

  /**
   * Reset a database password
   * @param {number|string} id - The ID of the server
   * @param {number|string} databaseId - The ID of the database
   * @returns {Promise<Object>} Response data with new password
   * @throws {NotFoundError} If the server or database doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async resetPassword(id, databaseId) {
    const response = await this.client.axios.post(
      `/servers/${id}/databases/${databaseId}/reset-password`
    );
    return response.data;
  }

  /**
   * Delete a database
   * @param {number|string} id - The ID of the server
   * @param {number|string} databaseId - The ID of the database to delete
   * @returns {Promise<Object>} Response data
   * @throws {NotFoundError} If the server or database doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async delete(id, databaseId) {
    const response = await this.client.axios.delete(
      `/servers/${id}/databases/${databaseId}`
    );
    return response.data;
  }
}

/**
 * Handles server details operations
 * @class
 */
class Details {
  /**
   * @param {import('../Client.js').default} client - The ApplicationClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Update server details
   * @param {number|string} id - The ID of the server
   * @param {Object} data - The data to update
   * @param {string} [data.name] - The name of the server
   * @param {string} [data.user] - The ID of the user who owns the server
   * @param {string} [data.external_id] - External ID of the server
   * @param {string} [data.description] - Description of the server
   * @returns {Promise<Object>} Updated server details
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async update(id, data) {
    const response = await this.client.axios.patch(
      `/servers/${id}/details`,
      data
    );
    return response.data;
  }
}

/**
 * Handles server build configuration operations
 * @class
 */
class Build {
  /**
   * @param {import('../Client.js').default} client - The ApplicationClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Update server build configuration
   * @param {number|string} id - The ID of the server
   * @param {Object} data - The build configuration data
   * @param {number} [data.allocation] - The primary allocation ID
   * @param {Array<number>} [data.add_allocations] - Allocation IDs to add
   * @param {Array<number>} [data.remove_allocations] - Allocation IDs to remove
   * @param {Object} [data.limits] - Resource limits
   * @returns {Promise<Object>} Updated server build configuration
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async update(id, data) {
    const response = await this.client.axios.patch(
      `/servers/${id}/build`,
      data
    );
    return response.data;
  }
}

/**
 * Handles server startup configuration operations
 * @class
 */
class Startup {
  /**
   * @param {import('../Client.js').default} client - The ApplicationClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Update server startup configuration
   * @param {number|string} id - The ID of the server
   * @param {Object} data - The startup configuration data
   * @param {string} [data.startup] - Startup command
   * @param {string} [data.egg] - ID of the egg to use
   * @param {string} [data.image] - Docker image to use
   * @param {Object} [data.environment] - Environment variables
   * @param {boolean} [data.skip_scripts] - Whether to skip egg scripts
   * @returns {Promise<Object>} Updated server startup configuration
   * @throws {NotFoundError} If the server doesn't exist
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async update(id, data) {
    const response = await this.client.axios.patch(
      `/servers/${id}/startup`,
      data
    );
    return response.data;
  }
}

export default Servers;
