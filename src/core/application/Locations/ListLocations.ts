import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import {
  LocationListResponse,
  LocationQueryParams,
} from "../../../types/Locations";

/**
 * Handles listing all locations from the Pterodactyl API
 *
 * @internal This class is used internally by the Locations class
 */
class ListLocations {
  private client: PteroClient;
  private params: LocationQueryParams;

  /**
   * Create a new ListLocations instance
   *
   * @param client PteroClient instance
   * @param params Query parameters for filtering and pagination
   */
  constructor(client: PteroClient, params: LocationQueryParams = {}) {
    this.client = client;
    this.params = params;
  }

  /**
   * Execute the API request to list locations
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute(): Promise<LocationListResponse> {
    try {
      const response = await this.client.axios.get("/locations", {
        params: this.params,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Locations",
        context: "listing locations",
      });
    }
  }
}

export { ListLocations };
