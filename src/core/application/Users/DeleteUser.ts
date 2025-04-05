import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

/**
 * Handles deleting a user from the Pterodactyl API
 *
 * @internal This class is used internally by the User class
 */
class DeleteUser {
  private client: PteroClient;
  private id: number;

  /**
   * Create a new DeleteUser instance
   *
   * @param client PteroClient instance
   * @param id User ID to delete
   */
  constructor(client: PteroClient, id: number) {
    this.client = client;
    this.id = id;
  }

  /**
   * Execute the API request to delete a user
   *
   * @returns Promise resolving when the user is deleted
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      await this.client.axios.delete(`/users/${this.id}`);
    } catch (error) {
      throw handleApiError(error, {
        resource: "User",
        identifier: this.id,
        context: "deleting user",
      });
    }
  }
}

export { DeleteUser };
