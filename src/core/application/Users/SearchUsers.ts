import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

/**
 * Handles searching for users in the Pterodactyl API
 *
 * @internal This class is used internally by the Users class
 */
class SearchUsers {
  private client: PteroClient;
  private query: string;

  /**
   * Create a new SearchUsers instance
   *
   * @param client PteroClient instance
   * @param query Search query string
   */
  constructor(client: PteroClient, query: string) {
    this.client = client;
    this.query = query;
  }

  /**
   * Execute the API request to search for users
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.get(`/users`, {
        params: {
          filter: this.query,
        },
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Users",
        identifier: this.query,
        context: "searching users",
      });
    }
  }
}

export { SearchUsers };
