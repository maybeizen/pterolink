import { PteroClient } from "../../../PteroClient";
import { handleApiError } from "../../../../errors";

/**
 * Handles retrieving details for a specific egg from the Pterodactyl API
 *
 * @internal This class is used internally by the Egg class
 */
class EggDetails {
  private client: PteroClient;
  private nestId: string | number;
  private eggId: string | number;
  private include: string[];

  /**
   * Create a new EggDetails instance
   *
   * @param client PteroClient instance
   * @param nestId Nest ID that the egg belongs to
   * @param eggId Egg ID to retrieve
   * @param include Optional relationships to include
   */
  constructor(
    client: PteroClient,
    nestId: string | number,
    eggId: string | number,
    include: string[] = []
  ) {
    this.client = client;
    this.nestId = nestId;
    this.eggId = eggId;
    this.include = include;
  }

  /**
   * Execute the API request to get egg details
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const params: Record<string, any> = {};

      if (this.include.length > 0) {
        params.include = this.include.join(",");
      }

      const response = await this.client.axios.get(
        `/nests/${this.nestId}/eggs/${this.eggId}`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Egg",
        identifier: this.eggId,
        context: "getting egg details",
      });
    }
  }
}

export { EggDetails };
