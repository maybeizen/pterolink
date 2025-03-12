import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { ServerListResponse, ServerQueryParams } from "../../../types/Servers";

export class ListServers {
  private client: PteroClient;
  private params: ServerQueryParams;

  constructor(client: PteroClient, params: ServerQueryParams = {}) {
    this.client = client;
    this.params = params;
  }

  async execute(): Promise<ServerListResponse> {
    try {
      const response = await this.client.axios.get("/servers", {
        params: this.params,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Servers",
        context: "listing servers",
      });
    }
  }
}
