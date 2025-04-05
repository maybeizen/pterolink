import { PteroClient } from "../../PteroClient";
import { NotFoundError } from "../../../errors";
import { ValidationError } from "../../../errors/ValidationError";
import {
  ServerAttributes,
  ServerResponse,
  CreateServerData,
  UpdateServerDetailsData,
  UpdateServerBuildData,
} from "../../../types/Servers";
import { ListServers } from "./ListServers";
import { ServerDetails } from "./ServerDetails";
import { CreateServer } from "./CreateServer";
import { UpdateServerDetails } from "./UpdateServerDetails";
import { UpdateServerBuild } from "./UpdateServerBuild";
import { DeleteServer } from "./DeleteServer";
import { SuspendServer } from "./SuspendServer";
import { UnsuspendServer } from "./UnsuspendServer";

/**
 * Manages server operations in the Pterodactyl panel
 */
class Servers {
  #client: PteroClient;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private rateLimit = 5; // Lower rate limit for server operations

  /**
   * Create a new Servers instance
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
   * List all servers
   *
   * @param params Optional query parameters
   * @returns Promise resolving to an array of Server instances
   *
   * @example
   * // Get all servers
   * const servers = await client.servers.list();
   */
  public async list(params = {}) {
    const response = await this.queueRequest(() =>
      new ListServers(this.#client, params).execute()
    );

    return response.data.map(
      (server: ServerResponse) => new Server(this.#client, server.attributes)
    );
  }

  /**
   * Get a server by ID
   *
   * @param id Server ID
   * @param external Whether to use external ID
   * @returns Promise resolving to a Server instance
   *
   * @example
   * // Get server by ID
   * const server = await client.servers.get(1);
   */
  public async get(id: string | number, external: boolean = false) {
    const response = await this.queueRequest(() =>
      new ServerDetails(this.#client, id, external).execute()
    );

    return new Server(this.#client, response.attributes);
  }

  /**
   * Create a new server
   *
   * @param data Server creation data
   * @returns Promise resolving to a Server instance
   *
   * @example
   * // Create a new server
   * const newServer = await client.servers.create({
   *   name: "My Server",
   *   user: 1,
   *   egg: 1,
   *   // other required fields...
   * });
   */
  public async create(data: CreateServerData) {
    const response = await this.queueRequest(() =>
      new CreateServer(this.#client, data).execute()
    );

    return new Server(this.#client, response.attributes);
  }

  public async delete(id: string | number, force: boolean = false) {
    await new DeleteServer(this.#client, id, force).execute();
  }

  public async suspend(id: string | number) {
    const response = await new SuspendServer(this.#client, id).execute();
    return new Server(this.#client, response.attributes);
  }

  public async unsuspend(id: string | number) {
    const response = await new UnsuspendServer(this.#client, id).execute();
    return new Server(this.#client, response.attributes);
  }

  public async bulkCreate(servers: CreateServerData[]) {
    const createdServers = await Promise.all(
      servers.map((serverData) => this.create(serverData))
    );
    return createdServers;
  }

  public async bulkDelete(ids: (string | number)[], force: boolean = false) {
    await Promise.all(ids.map((id) => this.delete(id, force)));
  }
}

/**
 * Represents a single server in the Pterodactyl panel
 */
class Server {
  #client: PteroClient;
  public attributes: ServerAttributes;

  /**
   * Create a new Server instance
   *
   * @param client PteroClient instance
   * @param attributes Server attributes
   */
  constructor(client: PteroClient, attributes: ServerAttributes) {
    this.#client = client;
    this.attributes = attributes;
  }

  /**
   * Get server details
   *
   * @returns Promise resolving to updated Server instance
   *
   * @example
   * // Refresh server details
   * const updatedServer = await server.getDetails();
   */
  public async getDetails() {
    const response = await new ServerDetails(
      this.#client,
      this.attributes.id
    ).execute();

    this.attributes = response.attributes;
    return this;
  }

  /**
   * Update server details
   *
   * @param data Server details update data
   * @returns Promise resolving to updated Server instance
   *
   * @example
   * // Update server name
   * await server.updateDetails({ name: "New Server Name" });
   */
  public async updateDetails(data: UpdateServerDetailsData) {
    if (!this.attributes?.id) {
      throw new NotFoundError("Server", "unknown");
    }

    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    const response = await new UpdateServerDetails(
      this.#client,
      this.attributes.id,
      data
    ).execute();

    this.attributes = response.attributes;
    return this;
  }

  /**
   * Update server build configuration
   *
   * @param data Server build update data
   * @returns Promise resolving to updated Server instance
   *
   * @example
   * // Update server memory limit
   * await server.updateBuild({
   *   limits: { memory: 2048 }
   * });
   */
  public async updateBuild(data: UpdateServerBuildData) {
    if (!this.attributes?.id) {
      throw new NotFoundError("Server", "unknown");
    }

    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    const response = await new UpdateServerBuild(
      this.#client,
      this.attributes.id,
      data
    ).execute();

    this.attributes = response.attributes;
    return this;
  }

  /**
   * Suspend the server
   *
   * @returns Promise resolving to updated Server instance
   *
   * @example
   * // Suspend a server
   * await server.suspend();
   */
  public async suspend() {
    if (!this.attributes?.id) {
      throw new NotFoundError("Server", "unknown");
    }

    await new SuspendServer(this.#client, this.attributes.id).execute();
    this.attributes.suspended = true;
    return this;
  }

  /**
   * Unsuspend the server
   *
   * @returns Promise resolving to updated Server instance
   *
   * @example
   * // Unsuspend a server
   * await server.unsuspend();
   */
  public async unsuspend() {
    if (!this.attributes?.id) {
      throw new NotFoundError("Server", "unknown");
    }

    await new UnsuspendServer(this.#client, this.attributes.id).execute();
    this.attributes.suspended = false;
    return this;
  }

  /**
   * Delete the server
   *
   * @param force Whether to force delete the server
   * @returns Promise resolving when the server is deleted
   *
   * @example
   * // Delete a server
   * await server.delete();
   *
   * // Force delete a server
   * await server.delete(true);
   */
  public async delete(force: boolean = false) {
    if (!this.attributes?.id) {
      throw new NotFoundError("Server", "unknown");
    }

    await new DeleteServer(this.#client, this.attributes.id, force).execute();
  }

  /**
   * Get server ID
   *
   * @returns Server ID
   */
  public getId(): number {
    return this.attributes?.id || 0;
  }

  /**
   * Get server UUID
   *
   * @returns Server UUID
   */
  public getUuid(): string {
    return this.attributes?.uuid || "";
  }

  /**
   * Get server identifier
   *
   * @returns Server identifier
   */
  public getIdentifier(): string {
    return this.attributes?.identifier || "";
  }

  /**
   * Get server name
   *
   * @returns Server name
   */
  public getName(): string {
    return this.attributes?.name || "";
  }

  /**
   * Get server description
   *
   * @returns Server description
   */
  public getDescription(): string {
    return this.attributes?.description || "";
  }

  /**
   * Check if server is suspended
   *
   * @returns True if server is suspended
   */
  public isSuspended(): boolean {
    return this.attributes?.suspended || false;
  }

  /**
   * Get server node ID
   *
   * @returns Node ID
   */
  public getNodeId(): number {
    return this.attributes?.node || 0;
  }

  /**
   * Get server user ID
   *
   * @returns User ID
   */
  public getUserId(): number {
    return this.attributes?.user || 0;
  }

  /**
   * Get server allocation ID
   *
   * @returns Allocation ID
   */
  public getAllocationId(): number {
    return this.attributes?.allocation || 0;
  }

  /**
   * Get server resource limits
   *
   * @returns Server resource limits
   */
  public getLimits() {
    return (
      this.attributes?.limits || {
        memory: 0,
        swap: 0,
        disk: 0,
        io: 0,
        cpu: 0,
        threads: null,
      }
    );
  }

  /**
   * Get server feature limits
   *
   * @returns Server feature limits
   */
  public getFeatureLimits() {
    return (
      this.attributes?.feature_limits || {
        databases: 0,
        allocations: 0,
        backups: 0,
      }
    );
  }

  /**
   * Convert server to a simple object representation
   *
   * @returns Simple object with key server properties
   */
  public toJSON() {
    return {
      id: this.getId(),
      uuid: this.getUuid(),
      identifier: this.getIdentifier(),
      name: this.getName(),
      description: this.getDescription(),
      suspended: this.isSuspended(),
      node: this.getNodeId(),
      user: this.getUserId(),
      limits: this.getLimits(),
      featureLimits: this.getFeatureLimits(),
    };
  }

  /**
   * String representation of the server
   *
   * @returns String representation
   */
  public toString(): string {
    return `Server(${this.getId()}: ${this.getName()})`;
  }
}

export { Servers, Server };
