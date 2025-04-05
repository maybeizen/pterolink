import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { CreateNodeData } from "../../../types/Nodes";

/**
 * Handles creating a new node in the Pterodactyl API
 *
 * @internal This class is used internally by the Nodes class
 */
class CreateNode {
  private client: PteroClient;
  private data: CreateNodeData;

  /**
   * Create a new CreateNode instance
   *
   * @param client PteroClient instance
   * @param data Node creation data
   */
  constructor(client: PteroClient, data: CreateNodeData) {
    this.client = client;
    this.data = data;
  }

  /**
   * Execute the API request to create a node
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.post("/nodes", this.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Node",
        identifier: this.data.name,
        context: "creating node",
      });
    }
  }
}

export { CreateNode };
