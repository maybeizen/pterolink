import { Users } from "./Users";

class ListUsers extends Users {
  constructor(client) {
    super(client);
  }

  async list() {
    const response = await this.client.get("/users");
  }
}

export { ListUsers };
