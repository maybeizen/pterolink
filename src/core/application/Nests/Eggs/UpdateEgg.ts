import { PteroClient } from "../../../PteroClient";
import { handleApiError } from "../../../../errors";
import { UpdateEggData } from "../../../../types/Nests";

/**
 * Handles updating an existing egg in the Pterodactyl API
 *
 * @internal This class is used internally by the Egg class
 */
class UpdateEgg {
  private client: PteroClient;
  private nestId: string | number;
  private eggId: string | number;
  private data: UpdateEggData;

  /**
   * Create a new UpdateEgg instance
   *
   * @param client PteroClient instance
   * @param nestId Nest ID that the egg belongs to
   * @param eggId Egg ID to update
   * @param data Egg update data
   */
  constructor(
    client: PteroClient,
    nestId: string | number,
    eggId: string | number,
    data: UpdateEggData
  ) {
    this.client = client;
    this.nestId = nestId;
    this.eggId = eggId;
    this.data = data;
  }

  /**
   * Execute the API request to update an egg
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.patch(
        `/nests/${this.nestId}/eggs/${this.eggId}`,
        this.data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Egg",
        identifier: this.eggId,
        context: "updating egg details",
      });
    }
  }
}

export { UpdateEgg };
