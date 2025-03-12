import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

class ServerDetails {
  private client: PteroClient;
  private id: string | number;
  private external: boolean;

  constructor(
    client: PteroClient,
    id: string | number,
    external: boolean = false
  ) {
    this.client = client;
    this.id = id;
    this.external = external;
  }

  async execute() {
    try {
      const response = this.external
        ? await this.client.axios.get(`/servers/external/${this.id}`)
        : await this.client.axios.get(`/servers/${this.id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "getting server details",
      });
    }
  }
}

export { ServerDetails };
