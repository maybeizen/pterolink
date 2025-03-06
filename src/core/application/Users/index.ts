import { PteroClient } from "../../PteroClient";
import { NotFoundError } from "../../../errors";
import { ListUsers } from "./ListUsers";
import { UserDetails } from "./UserDetails";
import { CreateUser, CreateUserData } from "./CreateUser";
import { UpdateUser, UpdateUserData } from "./UpdateUser";
import { DeleteUser } from "./DeleteUser";
interface UserAttributes {
  id: number;
  external_id: string | null;
  uuid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  root_admin: boolean;
  "2fa": boolean;
  created_at: string;
  updated_at: string;
}

interface UserResponse {
  object: string;
  attributes: UserAttributes;
}

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

  public async get(id: number) {
    const response = await new UserDetails(this.client, id).execute();
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
}

export { Users, User, UserAttributes, UserResponse };
