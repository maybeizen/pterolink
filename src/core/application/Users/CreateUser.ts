import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

interface CreateUserData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

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
      throw handleApiError(error);
    }
  }
}

export { CreateUser, CreateUserData };
