import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

/**
 * Handles unsuspending a server in the Pterodactyl API
 *
 * @internal This class is used internally by the Server class
 */
class UnsuspendServer {
  private client: PteroClient;
  private id: string | number;

  /**
   * Create a new UnsuspendServer instance
   *
   * @param client PteroClient instance
   * @param id Server ID to unsuspend
   */
  constructor(client: PteroClient, id: string | number) {
    this.client = client;
    this.id = id;
  }

  /**
   * Execute the API request to unsuspend a server
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.post(
        `/servers/${this.id}/unsuspend`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "unsuspending server",
      });
    }
  }
}

export { UnsuspendServer };
