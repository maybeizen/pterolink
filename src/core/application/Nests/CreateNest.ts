import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { CreateNestData } from "../../../types/Nests";

/**
 * Handles creating a new nest in the Pterodactyl API
 *
 * @internal This class is used internally by the Nests class
 */
class CreateNest {
  private client: PteroClient;
  private data: CreateNestData;

  /**
   * Create a new CreateNest instance
   *
   * @param client PteroClient instance
   * @param data Nest creation data
   */
  constructor(client: PteroClient, data: CreateNestData) {
    this.client = client;
    this.data = data;
  }

  /**
   * Execute the API request to create a nest
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.post("/nests", this.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nest",
        identifier: this.data.name,
        context: "creating nest",
      });
    }
  }
}

export { CreateNest };
