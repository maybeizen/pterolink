import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

/**
 * Handles deleting a location from the Pterodactyl API
 *
 * @internal This class is used internally by the Location class
 */
class DeleteLocation {
  private client: PteroClient;
  private id: string | number;

  /**
   * Create a new DeleteLocation instance
   *
   * @param client PteroClient instance
   * @param id Location ID to delete
   */
  constructor(client: PteroClient, id: string | number) {
    this.client = client;
    this.id = id;
  }

  /**
   * Execute the API request to delete a location
   *
   * @returns Promise resolving when the location is deleted
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      await this.client.axios.delete(`/locations/${this.id}`);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Location",
        identifier: this.id,
        context: "deleting location",
      });
    }
  }
}

export { DeleteLocation };
