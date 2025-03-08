import { PteroClient } from "../../PteroClient";
import { NotFoundError } from "../../../errors";
import { ListUsers } from "./ListUsers";
import { UserDetails } from "./UserDetails";
import { CreateUser } from "./CreateUser";
import { UpdateUser } from "./UpdateUser";
import { DeleteUser } from "./DeleteUser";
import { SearchUsers } from "./SearchUsers";
import {
  UserAttributes,
  UserResponse,
  CreateUserData,
  UpdateUserData,
} from "../../../types/Users";

class Users {
  private client: PteroClient;

  constructor(client: PteroClient) {
    this.client = client;
  }

  public async list() {
    const users = await new ListUsers(this.client).execute();
    return users.map(
      (user: UserResponse) => new User(this.client, user.attributes)
    );
  }

  public async search(query: string) {
    const users = await new SearchUsers(this.client, query).execute();
    return users.map(
      (user: UserResponse) => new User(this.client, user.attributes)
    );
  }

  public async create(data: CreateUserData) {
    const response = await new CreateUser(this.client, data).execute();
    return new User(this.client, response.attributes);
  }

  public async delete(id: number) {
    await new DeleteUser(this.client, id).execute();
  }
}

class User {
  private client: PteroClient;
  public attributes!: UserAttributes;

  constructor(client: PteroClient, attributes?: UserAttributes) {
    this.client = client;
    if (attributes) {
      this.attributes = attributes;
    }
  }

  public async get(id: number, external: boolean = false) {
    const response = await new UserDetails(this.client, id, external).execute();
    this.attributes = response.attributes;
    return this;
  }

  public async update(data: UpdateUserData) {
    if (!this.attributes?.id) {
      throw new NotFoundError("User", this.attributes.id);
    }
    const response = await new UpdateUser(
      this.client,
      this.attributes.id,
      data
    ).execute();
    this.attributes = response.attributes;
    return this;
  }

  public async delete() {
    if (!this.attributes?.id) {
      throw new NotFoundError("User", this.attributes.id);
    }
    await new DeleteUser(this.client, this.attributes.id).execute();
  }

  toJSON() {
    return {
      ...this.attributes,
      client: this.client,
    };
  }
}

export { Users, User };
