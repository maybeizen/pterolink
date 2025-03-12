import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { CreateNodeData, NodeDetailsResponse } from "../../../types/Nodes";

export class CreateNode {
  private client: PteroClient;
  private data: CreateNodeData;

  constructor(client: PteroClient, data: CreateNodeData) {
    this.client = client;
    this.data = data;
  }

  async execute(): Promise<NodeDetailsResponse> {
    try {
      const response = await this.client.axios.post("/nodes", this.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Node",
        context: "creating node",
      });
    }
  }
}
