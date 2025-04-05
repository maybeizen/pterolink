import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { UpdateServerDetailsData } from "../../../types/Servers";

/**
 * Handles updating server details in the Pterodactyl API
 *
 * @internal This class is used internally by the Server class
 */
class UpdateServerDetails {
  private client: PteroClient;
  private id: string | number;
  private data: UpdateServerDetailsData;

  /**
   * Create a new UpdateServerDetails instance
   *
   * @param client PteroClient instance
   * @param id Server ID to update
   * @param data Server details update data
   */
  constructor(
    client: PteroClient,
    id: string | number,
    data: UpdateServerDetailsData
  ) {
    this.client = client;
    this.id = id;
    this.data = data;
  }

  /**
   * Execute the API request to update server details
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.patch(
        `/servers/${this.id}/details`,
        this.data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "updating server details",
      });
    }
  }
}

export { UpdateServerDetails };
