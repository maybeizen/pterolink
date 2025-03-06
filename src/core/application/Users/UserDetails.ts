import { PteroClient } from "../../PteroClient";

class UserDetails {
  private client: PteroClient;
  private id: number;

  constructor(client: PteroClient, id: number) {
    this.client = client;
    this.id = id;
  }

  async execute() {
    const response = await this.client.axios.get(`/users/${this.id}`);
    return response.data;
  }
}

export { UserDetails };
