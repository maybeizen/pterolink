import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { UpdateServerDetailsData } from "../../../types/Servers";

class UpdateServerDetails {
  private client: PteroClient;
  private id: string | number;
  private data: UpdateServerDetailsData;

  constructor(
    client: PteroClient,
    id: string | number,
    data: UpdateServerDetailsData
  ) {
    this.client = client;
    this.id = id;
    this.data = data;
  }

  async execute() {
    try {
      const response = await this.client.axios.patch(
        `/servers/${this.id}/details`,
        this.data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "updating server details",
      });
    }
  }
}

export { UpdateServerDetails };
