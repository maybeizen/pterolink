import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

/**
 * Handles retrieving details for a specific user from the Pterodactyl API
 *
 * @internal This class is used internally by the User class
 */
class UserDetails {
  private client: PteroClient;
  private id: number;
  private external: boolean;

  /**
   * Create a new UserDetails instance
   *
   * @param client PteroClient instance
   * @param id User ID to retrieve
   * @param external Whether to use the external ID instead of the internal ID
   */
  constructor(client: PteroClient, id: number, external: boolean = false) {
    this.client = client;
    this.id = id;
    this.external = external;
  }

  /**
   * Execute the API request to get user details
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = this.external
        ? await this.client.axios.get(`/users/external/${this.id}`)
        : await this.client.axios.get(`/users/${this.id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "User",
        identifier: this.id,
        context: "getting user details",
      });
    }
  }
}

export { UserDetails };
