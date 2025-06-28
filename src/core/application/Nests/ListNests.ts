import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { NestsResponse } from "../../../types/Nests";

/**
 * Options for listing nests
 */
interface ListNestsOptions {
  include?: string;
  page?: number;
}

/**
 * Handles listing all nests from the Pterodactyl API
 *
 * @internal This class is used internally by the Nests class
 */
class ListNests {
  private client: PteroClient;
  private options: ListNestsOptions;

  /**
   * Create a new ListNests instance
   *
   * @param client PteroClient instance
   * @param options Query options for filtering and pagination
   */
  constructor(client: PteroClient, options: ListNestsOptions = {}) {
    this.client = client;
    this.options = options;
  }

  /**
   * Execute the API request to list nests
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute(): Promise<NestsResponse> {
    try {
      const params: Record<string, any> = {};

      if (this.options.include) {
        params.include = this.options.include;
      }

      if (this.options.page) {
        params.page = this.options.page;
      }

      const response = await this.client.axios.get("/nests", { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nests",
        context: "listing nests",
      });
    }
  }
}

export { ListNests };
