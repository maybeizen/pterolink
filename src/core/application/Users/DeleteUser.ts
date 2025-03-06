import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

class DeleteUser {
  private client: PteroClient;
  private id: number;

  constructor(client: PteroClient, id: number) {
    this.client = client;
    this.id = id;
  }

  async execute() {
    try {
      await this.client.axios.delete(`/users/${this.id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export { DeleteUser };
