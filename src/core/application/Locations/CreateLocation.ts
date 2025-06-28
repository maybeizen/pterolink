import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { CreateLocationData } from "../../../types/Locations";

/**
 * Handles creating a new location in the Pterodactyl API
 *
 * @internal This class is used internally by the Locations class
 */
class CreateLocation {
  private client: PteroClient;
  private data: CreateLocationData;

  /**
   * Create a new CreateLocation instance
   *
   * @param client PteroClient instance
   * @param data Location creation data
   */
  constructor(client: PteroClient, data: CreateLocationData) {
    this.client = client;
    this.data = data;
  }

  /**
   * Execute the API request to create a location
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.post("/locations", this.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Location",
        identifier: this.data.short,
        context: "creating location",
      });
    }
  }
}

export { CreateLocation };
