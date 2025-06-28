import { PteroClient } from "../../../PteroClient";
import { handleApiError } from "../../../../errors";
import { CreateEggData } from "../../../../types/Nests";

/**
 * Handles creating a new egg in the Pterodactyl API
 *
 * @internal This class is used internally by the Eggs class
 */
class CreateEgg {
  private client: PteroClient;
  private nestId: string | number;
  private data: CreateEggData;

  /**
   * Create a new CreateEgg instance
   *
   * @param client PteroClient instance
   * @param nestId Nest ID to create the egg under
   * @param data Egg creation data
   */
  constructor(
    client: PteroClient,
    nestId: string | number,
    data: CreateEggData
  ) {
    this.client = client;
    this.nestId = nestId;
    this.data = data;
  }

  /**
   * Execute the API request to create an egg
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.post(
        `/nests/${this.nestId}/eggs`,
        this.data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Egg",
        identifier: this.data.name,
        context: "creating egg",
      });
    }
  }
}

export { CreateEgg };
