import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { UpdateNodeData } from "../../../types/Nodes";

/**
 * Handles updating an existing node in the Pterodactyl API
 *
 * @internal This class is used internally by the Node class
 */
class UpdateNode {
  private client: PteroClient;
  private id: string | number;
  private data: UpdateNodeData;

  /**
   * Create a new UpdateNode instance
   *
   * @param client PteroClient instance
   * @param id Node ID to update
   * @param data Node update data
   */
  constructor(client: PteroClient, id: string | number, data: UpdateNodeData) {
    this.client = client;
    this.id = id;
    this.data = data;
  }

  /**
   * Execute the API request to update a node
   *
   * @returns Promise resolving to the API response
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      const response = await this.client.axios.patch(
        `/nodes/${this.id}`,
        this.data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Node",
        identifier: this.id,
        context: "updating node details",
      });
    }
  }
}

export { UpdateNode };
