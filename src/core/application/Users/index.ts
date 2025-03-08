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
import { ValidationError } from "../../../errors/ValidationError";
import { Filter } from "./Filter";

class Users {
  #client: PteroClient;
  private cache: Map<number, UserAttributes>;
  private cacheTimeout: number = 5 * 60 * 1000;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private rateLimit = 10;

  constructor(client: PteroClient) {
    this.#client = client;
    this.cache = new Map();
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        await request();
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 / this.rateLimit)
        );
      }
    }

    this.isProcessing = false;
  }

  public async list() {
    const response = await new ListUsers(this.#client).execute();
    const users = response.data.map(
      (user: UserResponse) => new User(this.#client, user.attributes)
    );
    return new Filter(users);
  }

  public async search(query: string) {
    const users = await new SearchUsers(this.#client, query).execute();
    const mappedUsers = users.map(
      (user: UserResponse) => new User(this.#client, user.attributes)
    );
    return new Filter(mappedUsers);
  }

  public async create(data: CreateUserData) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await new CreateUser(this.#client, data).execute();
          resolve(new User(this.#client, response.attributes));
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  public async delete(id: number) {
    await new DeleteUser(this.#client, id).execute();
  }

  public async bulkCreate(users: CreateUserData[]) {
    const createdUsers = await Promise.all(
      users.map((userData) => this.create(userData))
    );
    return createdUsers;
  }

  public async bulkDelete(ids: number[]) {
    await Promise.all(ids.map((id) => this.delete(id)));
  }
}

class User {
  #client: PteroClient;
  public attributes!: UserAttributes;

  constructor(client: PteroClient, attributes?: UserAttributes) {
    this.#client = client;
    if (attributes) {
      this.attributes = attributes;
    }
  }

  public async get(id: number, external: boolean = false) {
    const response = await new UserDetails(
      this.#client,
      id,
      external
    ).execute();
    this.attributes = response.attributes;
    return this;
  }

  public async update(data: UpdateUserData) {
    if (!this.attributes?.id) {
      throw new NotFoundError("User", "unknown");
    }

    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    const response = await new UpdateUser(
      this.#client,
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
    await new DeleteUser(this.#client, this.attributes.id).execute();
  }
}

export { Users, User };
