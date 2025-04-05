import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { CreateUserData } from "../../../types/Users";

/**
 * Handles creating a new user in the Pterodactyl API
 *
 * @internal This class is used internally by the Users class
 */
class CreateUser {
  private client: PteroClient;
  private data: CreateUserData;

  /**
   * Create a new CreateUser instance
   *
   * @param client PteroClient instance
   * @param data User creation data
   */
  constructor(client: PteroClient, data: CreateUserData) {
    this.client = client;
    this.data = data;
  }

  /**
   * Execute the API request to create a user
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.post("/users", this.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "User",
        identifier: this.data.username,
        context: "creating user",
      });
    }
  }
}

export { CreateUser };
