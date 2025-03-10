import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { UpdateUserData } from "../../../types/Users";

class UpdateUser {
  private client: PteroClient;
  private id: number;
  private data: UpdateUserData;

  constructor(client: PteroClient, id: number, data: UpdateUserData) {
    this.client = client;
    this.id = id;
    this.data = data;
  }

  async execute() {
    try {
      const response = await this.client.axios.patch(
        `/users/${this.id}`,
        this.data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Users",
        identifier: this.id,
        context: "updating user details",
      });
    }
  }
}

export { UpdateUser };
