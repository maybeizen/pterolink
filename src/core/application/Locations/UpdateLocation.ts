import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { UpdateLocationData } from "../../../types/Locations";

/**
 * Handles updating an existing location in the Pterodactyl API
 *
 * @internal This class is used internally by the Location class
 */
class UpdateLocation {
  private client: PteroClient;
  private id: string | number;
  private data: UpdateLocationData;

  /**
   * Create a new UpdateLocation instance
   *
   * @param client PteroClient instance
   * @param id Location ID to update
   * @param data Location update data
   */
  constructor(
    client: PteroClient,
    id: string | number,
    data: UpdateLocationData
  ) {
    this.client = client;
    this.id = id;
    this.data = data;
  }

  /**
   * Execute the API request to update a location
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.patch(
        `/locations/${this.id}`,
        this.data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Location",
        identifier: this.id,
        context: "updating location details",
      });
    }
  }
}

export { UpdateLocation };
