import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { UpdateNodeData, NodeDetailsResponse } from "../../../types/Nodes";

export class UpdateNode {
  private client: PteroClient;
  private id: number | string;
  private data: UpdateNodeData;

  constructor(client: PteroClient, id: number | string, data: UpdateNodeData) {
    this.client = client;
    this.id = id;
    this.data = data;
  }

  async execute(): Promise<NodeDetailsResponse> {
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
        context: "updating node",
      });
    }
  }
}
