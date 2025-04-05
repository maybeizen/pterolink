import { PteroClient } from "../../PteroClient";
import { NotFoundError } from "../../../errors";
import { ValidationError } from "../../../errors/ValidationError";
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

/**
 * Manages user operations in the Pterodactyl panel
 */
class Users {
  #client: PteroClient;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private rateLimit = 10;

  /**
   * Create a new Users instance
   *
   * @param client PteroClient instance
   */
  constructor(client: PteroClient) {
    this.#client = client;
  }

  /**
   * Process the request queue with rate limiting
   *
   * @private
   */
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

  /**
   * Queue a request to be processed with rate limiting
   *
   * @private
   * @param request Function that returns a promise
   * @returns Promise that resolves with the result of the request
   */
  private queueRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  /**
   * List all users in the panel
   *
   * @param params Optional query parameters
   * @returns Promise resolving to an array of User instances
   *
   * @example
   * // Get all users
   * const users = await client.users.list();
   */
  async list(params = {}) {
    const response = await this.queueRequest(() =>
      new ListUsers(this.#client, params).execute()
    );

    return response.data.map((userData) => {
      const user = new User(this.#client);
      user.attributes = userData.attributes;
      return user;
    });
  }

  /**
   * Search for users by a query string
   *
   * @param query Search query
   * @returns Promise resolving to an array of User instances
   *
   * @example
   * // Search for users with "admin" in their username or email
   * const adminUsers = await client.users.search("admin");
   */
  async search(query: string) {
    const results = await this.queueRequest(() =>
      new SearchUsers(this.#client, query).execute()
    );

    return results.map((userData: any) => {
      const user = new User(this.#client);
      user.attributes = userData.attributes;
      return user;
    });
  }

  /**
   * Get a user by ID
   *
   * @param id User ID
   * @param external Whether to use external ID
   * @returns Promise resolving to a User instance
   *
   * @example
   * // Get user with ID 1
   * const user = await client.users.get(1);
   */
  async get(id: number, external: boolean = false) {
    const response = await this.queueRequest(() =>
      new UserDetails(this.#client, id, external).execute()
    );

    const user = new User(this.#client);
    user.attributes = response.attributes;
    return user;
  }

  /**
   * Create a new user
   *
   * @param data User creation data
   * @returns Promise resolving to the created User instance
   *
   * @example
   * // Create a new user
   * const newUser = await client.users.create({
   *   username: "newuser",
   *   email: "user@example.com",
   *   first_name: "New",
   *   last_name: "User",
   *   password: "securepassword"
   * });
   */
  async create(data: CreateUserData) {
    const response = await this.queueRequest(() =>
      new CreateUser(this.#client, data).execute()
    );

    const user = new User(this.#client);
    user.attributes = response.attributes;
    return user;
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

/**
 * Represents a user in the Pterodactyl panel
 */
class User {
  #client: PteroClient;
  attributes: UserAttributes;

  /**
   * Create a new User instance
   *
   * @param client PteroClient instance
   */
  constructor(client: PteroClient) {
    this.#client = client;
    this.attributes = {} as UserAttributes;
  }

  /**
   * Get user ID
   *
   * @returns User ID
   */
  public getId(): number {
    return this.attributes?.id || 0;
  }

  /**
   * Get user external ID
   *
   * @returns User external ID or null
   */
  public getExternalId(): string | null {
    return this.attributes?.external_id;
  }

  /**
   * Get user UUID
   *
   * @returns User UUID
   */
  public getUuid(): string {
    return this.attributes?.uuid || "";
  }

  /**
   * Get username
   *
   * @returns Username
   */
  public getUsername(): string {
    return this.attributes?.username || "";
  }

  /**
   * Get user email
   *
   * @returns User email
   */
  public getEmail(): string {
    return this.attributes?.email || "";
  }

  /**
   * Get user first name
   *
   * @returns User first name
   */
  public getFirstName(): string {
    return this.attributes?.first_name || "";
  }

  /**
   * Get user last name
   *
   * @returns User last name
   */
  public getLastName(): string {
    return this.attributes?.last_name || "";
  }

  /**
   * Get user full name
   *
   * @returns User full name
   */
  public getFullName(): string {
    return `${this.getFirstName()} ${this.getLastName()}`.trim();
  }

  /**
   * Check if user is an admin
   *
   * @returns True if user is an admin
   */
  public isAdmin(): boolean {
    return this.attributes?.root_admin || false;
  }

  /**
   * Check if user has 2FA enabled
   *
   * @returns True if 2FA is enabled
   */
  public has2FA(): boolean {
    return this.attributes?.["2fa"] || false;
  }

  /**
   * Get user creation date
   *
   * @returns Creation date string
   */
  public getCreatedAt(): string {
    return this.attributes?.created_at || "";
  }

  /**
   * Get user last update date
   *
   * @returns Last update date string
   */
  public getUpdatedAt(): string {
    return this.attributes?.updated_at || "";
  }

  /**
   * Update user details
   *
   * @param data User update data
   * @returns Promise resolving to the updated User instance
   *
   * @example
   * // Update user email
   * await user.update({ email: "newemail@example.com" });
   */
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

  /**
   * Delete the user
   *
   * @returns Promise resolving when the user is deleted
   *
   * @example
   * // Delete the user
   * await user.delete();
   */
  public async delete() {
    if (!this.attributes?.id) {
      throw new NotFoundError("User", "unknown");
    }
    await new DeleteUser(this.#client, this.attributes.id).execute();
  }

  /**
   * Convert user to a simple object representation
   *
   * @returns Simple object with key user properties
   */
  public toJSON() {
    return {
      id: this.getId(),
      uuid: this.getUuid(),
      username: this.getUsername(),
      email: this.getEmail(),
      firstName: this.getFirstName(),
      lastName: this.getLastName(),
      fullName: this.getFullName(),
      isAdmin: this.isAdmin(),
      has2FA: this.has2FA(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  /**
   * String representation of the user
   *
   * @returns String representation
   */
  public toString(): string {
    return `User(${this.getId()}: ${this.getUsername()})`;
  }
}

export { Users, User };
