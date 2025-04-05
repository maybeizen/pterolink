import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { NodeListResponse, NodeQueryParams } from "../../../types/Nodes";

/**
 * Handles listing all nodes from the Pterodactyl API
 *
 * @internal This class is used internally by the Nodes class
 */
class ListNodes {
  private client: PteroClient;
  private params: NodeQueryParams;

  /**
   * Create a new ListNodes instance
   *
   * @param client PteroClient instance
   * @param params Query parameters for filtering and pagination
   */
  constructor(client: PteroClient, params: NodeQueryParams = {}) {
    this.client = client;
    this.params = params;
  }

  /**
   * Execute the API request to list nodes
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute(): Promise<NodeListResponse> {
    try {
      const response = await this.client.axios.get("/nodes", {
        params: this.params,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nodes",
        context: "listing nodes",
      });
    }
  }
}

export { ListNodes };
