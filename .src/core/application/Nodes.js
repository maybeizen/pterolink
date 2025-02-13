/**
 * Represents the Nodes API endpoint handler
 * @class
 */
class Nodes {
  /**
   * Creates a new Nodes instance
   * @param {import('../Client.js').default} client - The ApplicationClient instance
   */
  constructor(client) {
    this.client = client;
    this.allocations = new Allocations(this.client);
  }

  /**
   * List all nodes on the panel
   * @returns {Promise<Array<Object>>} Array of node objects
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async list() {
    try {
      const response = await this.client.axios.get("/nodes");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get details of a specific node
   * @param {number|string} id - The ID of the node
   * @returns {Promise<Object>} Node details
   * @throws {NotFoundError} If the node doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async get(id) {
    try {
      const response = await this.client.axios.get(`/nodes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Display the Wings configuration for a node
   * @param {number|string} id - The ID of the node
   * @returns {Promise<Object>} Wings configuration
   * @throws {NotFoundError} If the node doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async config(id) {
    try {
      const response = await this.client.axios.get(
        `/nodes/${id}/configuration`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new node on the panel
   * @param {Object} data - The node creation data
   * @param {string} data.name - Name of the node
   * @param {string} data.description - Short description of the node
   * @param {number} data.location_id - ID of the location to create the node on
   * @param {string} data.fqdn - Fully Qualified Domain Name (node.example.com)
   * @param {string} data.scheme - Connection scheme (http/https)
   * @param {number} data.memory - Total memory in MB
   * @param {number} data.memory_overallocate - Memory overallocation percentage
   * @param {number} data.disk - Total disk space in MB
   * @param {number} data.disk_overallocate - Disk overallocation percentage
   * @param {number} data.upload_size - Maximum upload size in MB
   * @param {string} data.daemon_base - Base directory for daemon
   * @param {number} data.daemon_sftp - SFTP port
   * @param {number} data.daemon_listen - Daemon listen port
   * @returns {Promise<Object>} Created node details
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async create(data) {
    try {
      const response = await this.client.axios.post("/nodes", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a node's details
   * @param {number|string} id - The ID of the node to update
   * @param {Object} data - The data to update
   * @param {string} [data.name] - Name of the node
   * @param {string} [data.description] - Description of the node
   * @param {number} [data.location_id] - ID of the location
   * @param {string} [data.fqdn] - Fully Qualified Domain Name
   * @param {string} [data.scheme] - Connection scheme (http/https)
   * @param {number} [data.memory] - Total memory in MB
   * @param {number} [data.memory_overallocate] - Memory overallocation percentage
   * @param {number} [data.disk] - Total disk space in MB
   * @param {number} [data.disk_overallocate] - Disk overallocation percentage
   * @param {number} [data.upload_size] - Maximum upload size in MB
   * @param {string} [data.daemon_base] - Base directory for daemon
   * @param {number} [data.daemon_sftp] - SFTP port
   * @param {number} [data.daemon_listen] - Daemon listen port
   * @returns {Promise<Object>} Updated node details
   * @throws {NotFoundError} If the node doesn't exist
   * @throws {ValidationError} If the provided data is invalid
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async update(id, data) {
    try {
      const response = await this.client.axios.patch(`/nodes/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a node from the panel
   * This only works if the node contains no servers.
   * @param {number|string} id - The ID of the node to delete
   * @returns {Promise<boolean>} True if deletion was successful
   * @throws {NotFoundError} If the node doesn't exist
   * @throws {UnauthorizedError} If the API key is invalid
   * @throws {PteroError} If the API request fails
   */
  async delete(id) {
    try {
      await this.client.axios.delete(`/nodes/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

class Allocations {
  constructor(client) {
    this.client = client;
  }

  async list(id) {
    try {
      const response = await this.client.axios.get(`/nodes/${id}/allocations`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async create(id, data) {
    try {
      const response = await this.client.axios.post(
        `/nodes/${id}/allocations`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id, allocationId) {
    try {
      await this.client.axios.delete(
        `/nodes/${id}/allocations/${allocationId}`
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default Nodes;
