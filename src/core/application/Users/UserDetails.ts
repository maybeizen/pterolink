import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

class UserDetails {
  private client: PteroClient;
  private id: number;
  private external: boolean;

  constructor(client: PteroClient, id: number, external: boolean = false) {
    this.client = client;
    this.id = id;
    this.external = external;
  }

  async execute() {
    try {
      const response = this.external
        ? await this.client.axios.get(`/users/external/${this.id}`)
        : await this.client.axios.get(`/users/${this.id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "User",
        identifier: this.id,
        context: "getting user details",
      });
    }
  }
}

export { UserDetails };
