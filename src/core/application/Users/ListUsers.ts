import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors/index";
import {
  PaginatedResponse,
  UserResponse,
  UserQueryParams,
} from "../../../types/Users";

/**
 * Handles listing all users from the Pterodactyl API
 *
 * @internal This class is used internally by the Users class
 */
class ListUsers {
  private client: PteroClient;
  private params: UserQueryParams;

  /**
   * Create a new ListUsers instance
   *
   * @param client PteroClient instance
   * @param params Query parameters for filtering and pagination
   */
  constructor(client: PteroClient, params: UserQueryParams = {}) {
    this.client = client;
    this.params = params;
  }

  /**
   * Execute the API request to list users
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute(): Promise<PaginatedResponse<UserResponse>> {
    try {
      const response = await this.client.axios.get("/users", {
        params: this.params,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Users",
        context: "listing users",
      });
    }
  }
}

export { ListUsers };
