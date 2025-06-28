import { PteroClient } from "../../PteroClient";
import { handleApiError } from "../../../errors";
import {
  UserAttributes,
  UserResponse,
  CreateUserData,
  UpdateUserData,
  UserQueryParams,
  PaginatedResponse,
} from "../../../types/Users";

export interface UserFilterOptions extends UserQueryParams {
  limit?: number;
  adminsOnly?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    count: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
    links: {
      next: string | null;
      previous: string | null;
    };
  };
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage?: () => Promise<PaginatedResult<T>>;
  fetchPreviousPage?: () => Promise<PaginatedResult<T>>;
}

export class Users {
  #client: PteroClient;

  constructor(client: PteroClient) {
    this.#client = client;
  }

  async all(options: UserFilterOptions = {}): Promise<User[]> {
    try {
      const { limit, adminsOnly, ...params } = options;

      const countResponse = await this.#client.axios.get("/users", {
        params: { ...params, per_page: 1 },
      });

      const totalUsers = countResponse.data.meta.pagination.total;

      const response = await this.#client.axios.get("/users", {
        params: { ...params, per_page: totalUsers },
      });

      let users = response.data.data.map(
        (userData: UserResponse) => new User(this.#client, userData.attributes)
      );

      if (adminsOnly) {
        users = users.filter((user: User) => user.isAdmin);
      }

      if (limit && limit > 0) {
        users = users.slice(0, limit);
      }

      return users;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Users",
        context: "getting all users",
      });
    }
  }

  async paginate(
    options: UserFilterOptions = {}
  ): Promise<PaginatedResult<User>> {
    try {
      const { limit, adminsOnly, ...params } = options;
      const page = params.page || 1;
      const perPage = params.per_page || 50;

      const response = await this.#client.axios.get("/users", {
        params: { ...params, page, per_page: perPage },
      });

      let users = response.data.data.map(
        (userData: UserResponse) => new User(this.#client, userData.attributes)
      );

      if (adminsOnly) {
        users = users.filter((user: User) => user.isAdmin);
      }

      const pagination = {
        total: response.data.meta.pagination.total,
        count: response.data.meta.pagination.count,
        perPage: response.data.meta.pagination.per_page,
        currentPage: response.data.meta.pagination.current_page,
        totalPages: response.data.meta.pagination.total_pages,
        links: {
          next: response.data.meta.pagination.links.next || null,
          previous: response.data.meta.pagination.links.prev || null,
        },
      };

      const hasNextPage = pagination.currentPage < pagination.totalPages;
      const hasPreviousPage = pagination.currentPage > 1;

      const result: PaginatedResult<User> = {
        data: users,
        pagination,
        hasNextPage,
        hasPreviousPage,
      };

      if (hasNextPage) {
        result.fetchNextPage = () =>
          this.paginate({
            ...options,
            page: pagination.currentPage + 1,
            per_page: pagination.perPage,
          });
      }

      if (hasPreviousPage) {
        result.fetchPreviousPage = () =>
          this.paginate({
            ...options,
            page: pagination.currentPage - 1,
            per_page: pagination.perPage,
          });
      }

      return result;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Users",
        context: "paginating users",
      });
    }
  }

  async search(query: string): Promise<User[]> {
    try {
      const response = await this.#client.axios.get("/users", {
        params: { filter: query },
      });

      console.log("Search results:", response.data);

      return response.data.data.map(
        (userData: UserResponse) => new User(this.#client, userData.attributes)
      );
    } catch (error) {
      throw handleApiError(error, {
        resource: "Users",
        identifier: query,
        context: "searching users",
      });
    }
  }

  async searchPaginated(
    query: string,
    page: number = 1,
    perPage: number = 50
  ): Promise<PaginatedResult<User>> {
    try {
      const response = await this.#client.axios.get("/users", {
        params: {
          filter: query,
          page,
          per_page: perPage,
        },
      });

      const users = response.data.data.map(
        (userData: UserResponse) => new User(this.#client, userData.attributes)
      );

      const pagination = {
        total: response.data.meta.pagination.total,
        count: response.data.meta.pagination.count,
        perPage: response.data.meta.pagination.per_page,
        currentPage: response.data.meta.pagination.current_page,
        totalPages: response.data.meta.pagination.total_pages,
        links: {
          next: response.data.meta.pagination.links.next || null,
          previous: response.data.meta.pagination.links.prev || null,
        },
      };

      const hasNextPage = pagination.currentPage < pagination.totalPages;
      const hasPreviousPage = pagination.currentPage > 1;

      const result: PaginatedResult<User> = {
        data: users,
        pagination,
        hasNextPage,
        hasPreviousPage,
      };

      if (hasNextPage) {
        result.fetchNextPage = () =>
          this.searchPaginated(
            query,
            pagination.currentPage + 1,
            pagination.perPage
          );
      }

      if (hasPreviousPage) {
        result.fetchPreviousPage = () =>
          this.searchPaginated(
            query,
            pagination.currentPage - 1,
            pagination.perPage
          );
      }

      return result;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Users",
        identifier: query,
        context: "searching users with pagination",
      });
    }
  }

  async get(id: number, external: boolean = false): Promise<User> {
    try {
      const endpoint = external ? `/users/external/${id}` : `/users/${id}`;
      const response = await this.#client.axios.get(endpoint);
      return new User(this.#client, response.data.attributes);
    } catch (error) {
      throw handleApiError(error, {
        resource: "User",
        identifier: id,
        context: `getting user${external ? " by external ID" : ""}`,
      });
    }
  }

  async create(data: CreateUserData): Promise<User> {
    try {
      const response = await this.#client.axios.post("/users", data);
      return new User(this.#client, response.data.attributes);
    } catch (error) {
      throw handleApiError(error, {
        resource: "User",
        identifier: data.username,
        context: "creating user",
      });
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.#client.axios.delete(`/users/${id}`);
    } catch (error) {
      throw handleApiError(error, {
        resource: "User",
        identifier: id,
        context: "deleting user",
      });
    }
  }

  async bulkCreate(users: CreateUserData[]): Promise<User[]> {
    return Promise.all(users.map((userData) => this.create(userData)));
  }

  async bulkDelete(ids: number[]): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id)));
  }
}

export class User {
  #client: PteroClient;
  attributes: UserAttributes;

  constructor(client: PteroClient, attributes: UserAttributes) {
    this.#client = client;
    this.attributes = attributes;
  }

  get id(): number {
    return this.attributes.id;
  }
  get externalId(): string | null {
    return this.attributes.external_id;
  }
  get uuid(): string {
    return this.attributes.uuid;
  }
  get username(): string {
    return this.attributes.username;
  }
  get email(): string {
    return this.attributes.email;
  }
  get firstName(): string {
    return this.attributes.first_name;
  }
  get lastName(): string {
    return this.attributes.last_name;
  }
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
  get language(): string {
    return this.attributes.language;
  }
  get isAdmin(): boolean {
    return this.attributes.root_admin;
  }
  get has2FA(): boolean {
    return this.attributes["2fa"];
  }
  get createdAt(): Date {
    return new Date(this.attributes.created_at);
  }
  get updatedAt(): Date {
    return new Date(this.attributes.updated_at);
  }

  async update(data: UpdateUserData): Promise<User> {
    try {
      const response = await this.#client.axios.patch(
        `/users/${this.id}`,
        data
      );
      return new User(this.#client, response.data.attributes);
    } catch (error) {
      throw handleApiError(error, {
        resource: "User",
        identifier: this.id,
        context: "updating user",
      });
    }
  }

  async delete(): Promise<void> {
    try {
      await this.#client.axios.delete(`/users/${this.id}`);
    } catch (error) {
      throw handleApiError(error, {
        resource: "User",
        identifier: this.id,
        context: "deleting user",
      });
    }
  }

  toJSON() {
    return {
      id: this.id,
      externalId: this.externalId,
      uuid: this.uuid,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      language: this.language,
      isAdmin: this.isAdmin,
      has2FA: this.has2FA,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  toString(): string {
    return `User(${this.id}: ${this.username})`;
  }
}
