import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { ServerListResponse, ServerQueryParams } from "../../../types/Servers";

/**
 * Handles listing all servers from the Pterodactyl API
 *
 * @internal This class is used internally by the Servers class
 */
export class ListServers {
  private client: PteroClient;
  private params: ServerQueryParams;

  /**
   * Create a new ListServers instance
   *
   * @param client PteroClient instance
   * @param params Query parameters for filtering and pagination
   */
  constructor(client: PteroClient, params: ServerQueryParams = {}) {
    this.client = client;
    this.params = params;
  }

  /**
   * Execute the API request to list servers
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute(): Promise<ServerListResponse> {
    try {
      const response = await this.client.axios.get("/servers", {
        params: this.params,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Servers",
        context: "listing servers",
      });
    }
  }
}
