import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

class DeleteServer {
  private client: PteroClient;
  private id: string | number;
  private force: boolean;

  constructor(
    client: PteroClient,
    id: string | number,
    force: boolean = false
  ) {
    this.client = client;
    this.id = id;
    this.force = force;
  }

  async execute() {
    try {
      await this.client.axios.delete(
        `/servers/${this.id}${this.force ? "/force" : ""}`
      );
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: `${this.force ? "force " : ""}deleting server`,
      });
    }
  }
}

export { DeleteServer };
