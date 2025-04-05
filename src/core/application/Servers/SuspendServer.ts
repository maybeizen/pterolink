import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

/**
 * Handles suspending a server in the Pterodactyl API
 *
 * @internal This class is used internally by the Server class
 */
class SuspendServer {
  private client: PteroClient;
  private id: string | number;

  /**
   * Create a new SuspendServer instance
   *
   * @param client PteroClient instance
   * @param id Server ID to suspend
   */
  constructor(client: PteroClient, id: string | number) {
    this.client = client;
    this.id = id;
  }

  /**
   * Execute the API request to suspend a server
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.post(
        `/servers/${this.id}/suspend`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "suspending server",
      });
    }
  }
}

export { SuspendServer };
