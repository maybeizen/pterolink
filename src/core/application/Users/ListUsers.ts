import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors/index";
import {
  PaginatedResponse,
  UserResponse,
  UserQueryParams,
} from "../../../types/Users";

class ListUsers {
  private client: PteroClient;
  private params: UserQueryParams;

  constructor(client: PteroClient, params: UserQueryParams = {}) {
    this.client = client;
    this.params = params;
  }

  async execute(): Promise<PaginatedResponse<UserResponse>> {
    try {
      const response = await this.client.axios.get("/users", {
        params: this.params,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Users",
        context: "listing users",
      });
    }
  }
}

export { ListUsers };
