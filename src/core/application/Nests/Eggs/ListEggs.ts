import { PteroClient } from "../../../PteroClient";
import { handleApiError } from "../../../../errors";

/**
 * Options for listing eggs
 */
interface ListEggsOptions {
  include?: string;
  page?: number;
}

/**
 * Handles listing all eggs for a nest from the Pterodactyl API
 *
 * @internal This class is used internally by the Eggs class
 */
class ListEggs {
  private client: PteroClient;
  private nestId: string | number;
  private options: ListEggsOptions;

  /**
   * Create a new ListEggs instance
   *
   * @param client PteroClient instance
   * @param nestId Nest ID to list eggs for
   * @param options Query options for filtering and pagination
   */
  constructor(
    client: PteroClient,
    nestId: string | number,
    options: ListEggsOptions = {}
  ) {
    this.client = client;
    this.nestId = nestId;
    this.options = options;
  }

  /**
   * Execute the API request to list eggs
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const params: Record<string, any> = {};

      if (this.options.include) {
        params.include = this.options.include;
      }

      if (this.options.page) {
        params.page = this.options.page;
      }

      const response = await this.client.axios.get(
        `/nests/${this.nestId}/eggs`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Eggs",
        context: "listing eggs",
      });
    }
  }
}

export { ListEggs };
