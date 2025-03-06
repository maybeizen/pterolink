import { PteroClient } from "../../PteroClient";

class ListUsers {
  private client: PteroClient;

  constructor(client: PteroClient) {
    this.client = client;
  }

  async execute() {
    const response = await this.client.axios.get("/users");
    return response.data.data;
  }
}

export { ListUsers };
