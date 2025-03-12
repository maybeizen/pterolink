import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { CreateServerData } from "../../../types/Servers";

class CreateServer {
  private client: PteroClient;
  private data: CreateServerData;

  constructor(client: PteroClient, data: CreateServerData) {
    this.client = client;
    this.data = data;
  }

  async execute() {
    try {
      const response = await this.client.axios.post("/servers", this.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.data.name,
        context: "creating server",
      });
    }
  }
}

export { CreateServer };
