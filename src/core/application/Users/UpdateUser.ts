import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";

interface UpdateUserData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  language?: string;
  password?: string;
}

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
      throw handleApiError(error);
    }
  }
}

export { UpdateUser, UpdateUserData };
