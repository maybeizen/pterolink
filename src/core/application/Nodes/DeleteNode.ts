import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

export class DeleteNode {
  private client: PteroClient;
  private id: number | string;

  constructor(client: PteroClient, id: number | string) {
    this.client = client;
    this.id = id;
  }

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
