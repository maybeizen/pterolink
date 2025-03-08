import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import { CreateUserData } from "../../../types/Users";

class CreateUser {
  private client: PteroClient;
  private data: CreateUserData;

  constructor(client: PteroClient, data: CreateUserData) {
    this.client = client;
    this.data = data;
  }

  async execute() {
    try {
      const response = await this.client.axios.post("/users", this.data);
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "User",
        identifier: this.data.username,
        context: "creating user",
      });
    }
  }
}

export { CreateUser };
