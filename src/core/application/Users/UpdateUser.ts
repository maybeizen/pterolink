import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { UpdateUserData } from "../../../types/Users";

/**
 * Handles updating an existing user in the Pterodactyl API
 *
 * @internal This class is used internally by the User class
 */
class UpdateUser {
  private client: PteroClient;
  private id: number;
  private data: UpdateUserData;

  /**
   * Create a new UpdateUser instance
   *
   * @param client PteroClient instance
   * @param id User ID to update
   * @param data User update data
   */
  constructor(client: PteroClient, id: number, data: UpdateUserData) {
    this.client = client;
    this.id = id;
    this.data = data;
  }

  /**
   * Execute the API request to update a user
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.patch(
        `/users/${this.id}`,
        this.data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "User",
        identifier: this.id,
        context: "updating user details",
      });
    }
  }
}

export { UpdateUser };
