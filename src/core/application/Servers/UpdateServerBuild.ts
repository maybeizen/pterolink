import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { UpdateServerBuildData } from "../../../types/Servers";

/**
 * Handles updating server build configuration in the Pterodactyl API
 *
 * @internal This class is used internally by the Server class
 */
class UpdateServerBuild {
  private client: PteroClient;
  private id: string | number;
  private data: UpdateServerBuildData;

  /**
   * Create a new UpdateServerBuild instance
   *
   * @param client PteroClient instance
   * @param id Server ID to update
   * @param data Server build update data
   */
  constructor(
    client: PteroClient,
    id: string | number,
    data: UpdateServerBuildData
  ) {
    this.client = client;
    this.id = id;
    this.data = data;
  }

  /**
   * Execute the API request to update server build
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.patch(
        `/servers/${this.id}/build`,
        this.data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "updating server build",
      });
    }
  }
}

export { UpdateServerBuild };
