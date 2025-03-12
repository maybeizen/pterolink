import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { UpdateServerBuildData } from "../../../types/Servers";

class UpdateServerBuild {
  private client: PteroClient;
  private id: string | number;
  private data: UpdateServerBuildData;

  constructor(
    client: PteroClient,
    id: string | number,
    data: UpdateServerBuildData
  ) {
    this.client = client;
    this.id = id;
    this.data = data;
  }

  async execute() {
    try {
      const response = await this.client.axios.patch(
        `/servers/${this.id}/build`,
        this.data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "updating server build",
      });
    }
  }
}

export { UpdateServerBuild };
