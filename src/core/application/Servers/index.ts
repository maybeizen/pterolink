import { PteroClient } from "../../PteroClient";
import { handleApiError, ValidationError } from "../../../errors";
import {
  ServerAttributes,
  ServerResponse,
  CreateServerData,
  UpdateServerDetailsData,
  UpdateServerBuildData,
  ServerQueryParams,
  ServerFilterOptions,
  PaginatedResult,
} from "../../../types/Servers";

export class Servers {
  #client: PteroClient;

  constructor(client: PteroClient) {
    this.#client = client;
  }

  async all(options: ServerFilterOptions = {}): Promise<Server[]> {
    try {
      const { limit, ...params } = options;

      const countResponse = await this.#client.axios.get("/servers", {
        params: { ...params, per_page: 1 },
      });

      const totalServers = countResponse.data.meta.pagination.total;

      const response = await this.#client.axios.get("/servers", {
        params: { ...params, per_page: totalServers },
      });

      let servers = response.data.data.map(
        (serverData: ServerResponse) =>
          new Server(this.#client, serverData.attributes)
      );

      if (limit && limit > 0) {
        servers = servers.slice(0, limit);
      }

      return servers;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Servers",
        context: "getting all servers",
      });
    }
  }

  async paginate(
    options: ServerFilterOptions = {}
  ): Promise<PaginatedResult<Server>> {
    try {
      const { limit, ...params } = options;
      const page = params.page || 1;
      const perPage = params.per_page || 50;

      const response = await this.#client.axios.get("/servers", {
        params: { ...params, page, per_page: perPage },
      });

      let servers = response.data.data.map(
        (serverData: ServerResponse) =>
          new Server(this.#client, serverData.attributes)
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

      const result: PaginatedResult<Server> = {
        data: servers,
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
        resource: "Servers",
        context: "paginating servers",
      });
    }
  }

  async get(id: string | number, external: boolean = false): Promise<Server> {
    try {
      const endpoint = external ? `/servers/external/${id}` : `/servers/${id}`;
      const response = await this.#client.axios.get(endpoint);
      return new Server(this.#client, response.data.attributes);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: id,
        context: `getting server${external ? " by external ID" : ""}`,
      });
    }
  }

  async create(data: CreateServerData): Promise<Server> {
    try {
      const response = await this.#client.axios.post("/servers", data);
      return new Server(this.#client, response.data.attributes);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: data.name,
        context: "creating server",
      });
    }
  }

  async delete(id: string | number, force: boolean = false): Promise<void> {
    try {
      await this.#client.axios.delete(`/servers/${id}${force ? "/force" : ""}`);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: id,
        context: `${force ? "force " : ""}deleting server`,
      });
    }
  }

  async suspend(id: string | number): Promise<Server> {
    try {
      const response = await this.#client.axios.post(`/servers/${id}/suspend`);
      return new Server(this.#client, response.data.attributes);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: id,
        context: "suspending server",
      });
    }
  }

  async unsuspend(id: string | number): Promise<Server> {
    try {
      const response = await this.#client.axios.post(
        `/servers/${id}/unsuspend`
      );
      return new Server(this.#client, response.data.attributes);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: id,
        context: "unsuspending server",
      });
    }
  }

  async bulkCreate(servers: CreateServerData[]): Promise<Server[]> {
    return Promise.all(servers.map((serverData) => this.create(serverData)));
  }

  async bulkDelete(
    ids: (string | number)[],
    force: boolean = false
  ): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id, force)));
  }
}

export class Server {
  #client: PteroClient;
  attributes: ServerAttributes;

  constructor(client: PteroClient, attributes: ServerAttributes) {
    this.#client = client;
    this.attributes = attributes;
  }

  get getAttributes(): ServerAttributes {
    return this.attributes;
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

  get identifier(): string {
    return this.attributes.identifier;
  }

  get name(): string {
    return this.attributes.name;
  }

  get description(): string {
    return this.attributes.description;
  }

  get suspended(): boolean {
    return this.attributes.suspended;
  }

  get node(): number {
    return this.attributes.node;
  }

  get user(): number {
    return this.attributes.user;
  }

  get allocation(): number {
    return this.attributes.allocation;
  }

  get limits() {
    return (
      this.attributes.limits || {
        memory: 0,
        swap: 0,
        disk: 0,
        io: 0,
        cpu: 0,
        threads: null,
      }
    );
  }

  get featureLimits() {
    return (
      this.attributes.feature_limits || {
        databases: 0,
        allocations: 0,
        backups: 0,
      }
    );
  }

  get createdAt(): Date {
    return new Date(this.attributes.created_at);
  }

  get updatedAt(): Date {
    return new Date(this.attributes.updated_at);
  }

  async getDetails(): Promise<Server> {
    try {
      const response = await this.#client.axios.get(`/servers/${this.id}`);
      this.attributes = response.data.attributes;
      return this;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "getting server details",
      });
    }
  }

  async updateDetails(data: UpdateServerDetailsData): Promise<Server> {
    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    try {
      const response = await this.#client.axios.patch(
        `/servers/${this.id}/details`,
        data
      );
      this.attributes = response.data.attributes;
      return this;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "updating server details",
      });
    }
  }

  async updateBuild(data: UpdateServerBuildData): Promise<Server> {
    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    try {
      const response = await this.#client.axios.patch(
        `/servers/${this.id}/build`,
        data
      );
      this.attributes = response.data.attributes;
      return this;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "updating server build",
      });
    }
  }

  async suspend(): Promise<Server> {
    try {
      const response = await this.#client.axios.post(
        `/servers/${this.id}/suspend`
      );
      this.attributes = response.data.attributes;
      return this;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "suspending server",
      });
    }
  }

  async unsuspend(): Promise<Server> {
    try {
      const response = await this.#client.axios.post(
        `/servers/${this.id}/unsuspend`
      );
      this.attributes = response.data.attributes;
      return this;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: "unsuspending server",
      });
    }
  }

  async delete(force: boolean = false): Promise<void> {
    try {
      await this.#client.axios.delete(
        `/servers/${this.id}${force ? "/force" : ""}`
      );
    } catch (error) {
      throw handleApiError(error, {
        resource: "Server",
        identifier: this.id,
        context: `${force ? "force " : ""}deleting server`,
      });
    }
  }

  public toJSON() {
    return {
      id: this.id,
      externalId: this.externalId,
      uuid: this.uuid,
      identifier: this.identifier,
      name: this.name,
      description: this.description,
      suspended: this.suspended,
      node: this.node,
      user: this.user,
      allocation: this.allocation,
      limits: this.limits,
      featureLimits: this.featureLimits,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public toString(): string {
    return `Server(${this.id}: ${this.name})`;
  }
}
