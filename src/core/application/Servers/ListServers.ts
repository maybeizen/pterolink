import { PteroClient } from "../../PteroClient";
import { ServerListResponse } from "../../../types/Servers";

export class ListServers {
  private client: PteroClient;

  constructor(client: PteroClient) {
    this.client = client;
  }

  async execute(): Promise<ServerListResponse> {
    const response = await this.client.axios.get("/servers");
    return response.data as ServerListResponse;
  }
}
