import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

class UnsuspendServer {
  private client: PteroClient;
  private id: string | number;

  constructor(client: PteroClient, id: string | number) {
    this.client = client;
    this.id = id;
  }

  async execute() {
    try {
      const response = await this.client.axios.post(
        `/servers/${this.id}/unsuspend`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "unsuspending server",
      });
    }
  }
}

export { UnsuspendServer };
