import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { NestResponse } from "../../../types/Nests";

/**
 * Handles retrieving details for a specific nest from the Pterodactyl API
 *
 * @internal This class is used internally by the Nest class
 */
class NestDetails {
  private client: PteroClient;
  private id: string | number;
  private include: string[];

  /**
   * Create a new NestDetails instance
   *
   * @param client PteroClient instance
   * @param id Nest ID to retrieve
   * @param include Optional relationships to include
   */
  constructor(
    client: PteroClient,
    id: string | number,
    include: string[] = []
  ) {
    this.client = client;
    this.id = id;
    this.include = include;
  }

  /**
   * Execute the API request to get nest details
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

      const response = await this.client.axios.get(`/nests/${this.id}`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nest",
        identifier: this.id,
        context: "getting nest details",
      });
    }
  }
}

export { NestDetails };
