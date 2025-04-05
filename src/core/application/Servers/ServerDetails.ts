import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

/**
 * Handles retrieving details for a specific server from the Pterodactyl API
 *
 * @internal This class is used internally by the Server class
 */
class ServerDetails {
  private client: PteroClient;
  private id: string | number;
  private external: boolean;

  /**
   * Create a new ServerDetails instance
   *
   * @param client PteroClient instance
   * @param id Server ID to retrieve
   * @param external Whether to use the external ID instead of the internal ID
   */
  constructor(
    client: PteroClient,
    id: string | number,
    external: boolean = false
  ) {
    this.client = client;
    this.id = id;
    this.external = external;
  }

  /**
   * Execute the API request to get server details
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = this.external
        ? await this.client.axios.get(`/servers/external/${this.id}`)
        : await this.client.axios.get(`/servers/${this.id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "getting server details",
      });
    }
  }
}

export { ServerDetails };
