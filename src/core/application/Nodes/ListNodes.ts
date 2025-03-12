import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { NodeListResponse, NodeQueryParams } from "../../../types/Nodes";

export class ListNodes {
  private client: PteroClient;
  private params: NodeQueryParams;

  constructor(client: PteroClient, params: NodeQueryParams = {}) {
    this.client = client;
    this.params = params;
  }

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
