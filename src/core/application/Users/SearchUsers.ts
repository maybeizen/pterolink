import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

class SearchUsers {
  private client: PteroClient;
  private query: string;

  constructor(client: PteroClient, query: string) {
    this.client = client;
    this.query = query;
  }

  async execute() {
    try {
      const response = await this.client.axios.get(`/users`, {
        params: {
          filter: this.query,
        },
      });
      return response.data.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Users",
        identifier: this.query,
        context: "searching users",
      });
    }
  }
}

export { SearchUsers };
