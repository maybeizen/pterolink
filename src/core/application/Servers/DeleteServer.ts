import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

/**
 * Handles deleting a server from the Pterodactyl API
 *
 * @internal This class is used internally by the Servers class
 */
class DeleteServer {
  private client: PteroClient;
  private id: string | number;
  private force: boolean;

  /**
   * Create a new DeleteServer instance
   *
   * @param client PteroClient instance
   * @param id Server ID to delete
   * @param force Whether to force delete the server
   */
  constructor(
    client: PteroClient,
    id: string | number,
    force: boolean = false
  ) {
    this.client = client;
    this.id = id;
    this.force = force;
  }

  /**
   * Execute the API request to delete a server
   *
   * @returns Promise resolving when the server is deleted
   * @throws Error if the API request fails
   */
  async execute() {
    try {
      await this.client.axios.delete(
        `/servers/${this.id}${this.force ? "/force" : ""}`
      );
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: `${this.force ? "force " : ""}deleting server`,
      });
    }
  }
}

export { DeleteServer };
