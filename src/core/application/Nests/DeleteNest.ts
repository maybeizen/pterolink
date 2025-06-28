import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

/**
 * Handles deleting a nest from the Pterodactyl API
 *
 * @internal This class is used internally by the Nest class
 */
class DeleteNest {
  private client: PteroClient;
  private id: string | number;

  /**
   * Create a new DeleteNest instance
   *
   * @param client PteroClient instance
   * @param id Nest ID to delete
   */
  constructor(client: PteroClient, id: string | number) {
    this.client = client;
    this.id = id;
  }

  /**
   * Execute the API request to delete a nest
   *
   * @returns Promise resolving when the nest is deleted
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      await this.client.axios.delete(`/nests/${this.id}`);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nest",
        identifier: this.id,
        context: "deleting nest",
      });
    }
  }
}

export { DeleteNest };
