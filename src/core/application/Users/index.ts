import { PteroClient } from "../../PteroClient";
import { ListUsers } from "./ListUsers";
import { UserDetails } from "./UserDetails";

class Users {
  private client: PteroClient;

  constructor(client: PteroClient) {
    this.client = client;
  }

  public list() {
    return new ListUsers(this.client).execute();
  }
}

class User {
  private client: PteroClient;

  constructor(client: PteroClient) {
    this.client = client;
  }

  public get(id: number) {
    return new UserDetails(this.client, id).execute();
  }
}

export { Users, User };
