import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { CreateServerData } from "../../../types/Servers";

/**
 * Handles creating a new server in the Pterodactyl API
 *
 * @internal This class is used internally by the Servers class
 */
class CreateServer {
  private client: PteroClient;
  private data: CreateServerData;

  /**
   * Create a new CreateServer instance
   *
   * @param client PteroClient instance
   * @param data Server creation data
   */
  constructor(client: PteroClient, data: CreateServerData) {
    this.client = client;
    this.data = data;
  }

  /**
   * Execute the API request to create a server
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.post("/servers", this.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.data.name,
        context: "creating server",
      });
    }
  }
}

export { CreateServer };
