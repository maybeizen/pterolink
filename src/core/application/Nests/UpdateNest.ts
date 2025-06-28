import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { UpdateNestData } from "../../../types/Nests";

/**
 * Handles updating an existing nest in the Pterodactyl API
 *
 * @internal This class is used internally by the Nest class
 */
class UpdateNest {
  private client: PteroClient;
  private id: string | number;
  private data: UpdateNestData;

  /**
   * Create a new UpdateNest instance
   *
   * @param client PteroClient instance
   * @param id Nest ID to update
   * @param data Nest update data
   */
  constructor(client: PteroClient, id: string | number, data: UpdateNestData) {
    this.client = client;
    this.id = id;
    this.data = data;
  }

  /**
   * Execute the API request to update a nest
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.patch(
        `/nests/${this.id}`,
        this.data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nest",
        identifier: this.id,
        context: "updating nest details",
      });
    }
  }
}

export { UpdateNest };
