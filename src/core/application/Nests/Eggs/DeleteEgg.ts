import { PteroClient } from "../../../PteroClient";
import { handleApiError } from "../../../../errors";

/**
 * Handles deleting an egg from the Pterodactyl API
 *
 * @internal This class is used internally by the Egg class
 */
class DeleteEgg {
  private client: PteroClient;
  private nestId: string | number;
  private eggId: string | number;

  /**
   * Create a new DeleteEgg instance
   *
   * @param client PteroClient instance
   * @param nestId Nest ID that the egg belongs to
   * @param eggId Egg ID to delete
   */
  constructor(
    client: PteroClient,
    nestId: string | number,
    eggId: string | number
  ) {
    this.client = client;
    this.nestId = nestId;
    this.eggId = eggId;
  }

  /**
   * Execute the API request to delete an egg
   *
   * @returns Promise resolving when the egg is deleted
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      await this.client.axios.delete(
        `/nests/${this.nestId}/eggs/${this.eggId}`
      );
    } catch (error) {
      throw handleApiError(error, {
        resource: "Egg",
        identifier: this.eggId,
        context: "deleting egg",
      });
    }
  }
}

export { DeleteEgg };
