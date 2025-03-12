import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { NodeDetailsResponse } from "../../../types/Nodes";

export class NodeDetails {
  private client: PteroClient;
  private id: number | string;
  private include: string[];

  constructor(
    client: PteroClient,
    id: number | string,
    include: string[] = []
  ) {
    this.client = client;
    this.id = id;
    this.include = include;
  }

  async execute(): Promise<NodeDetailsResponse> {
    try {
      const response = await this.client.axios.get(`/nodes/${this.id}`, {
        params: {
          include: this.include.join(","),
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Node",
        identifier: this.id,
        context: "retrieving node details",
      });
    }
  }
}
