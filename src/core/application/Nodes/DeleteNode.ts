import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

/**
 * Handles deleting a node from the Pterodactyl API
 *
 * @internal This class is used internally by the Node class
 */
class DeleteNode {
  private client: PteroClient;
  private id: string | number;

  /**
   * Create a new DeleteNode instance
   *
   * @param client PteroClient instance
   * @param id Node ID to delete
   */
  constructor(client: PteroClient, id: string | number) {
    this.client = client;
    this.id = id;
  }

  /**
   * Execute the API request to delete a node
   *
   * @returns Promise resolving when the node is deleted
   * @throws Error if the API request fails
   */
  async execute(): Promise<void> {
    try {
      await this.client.axios.delete(`/nodes/${this.id}`);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Node",
        identifier: this.id,
        context: "deleting node",
      });
    }
  }
}

export { DeleteNode };
