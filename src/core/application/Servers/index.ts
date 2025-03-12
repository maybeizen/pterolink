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
import { Filter } from "./Filter";

class Servers {
  #client: PteroClient;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private rateLimit = 5; // Lower rate limit for server operations

  constructor(client: PteroClient) {
    this.#client = client;
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
    const response = await new ListServers(this.#client).execute();
    const servers = response.data.map(
      (server: ServerResponse) => new Server(this.#client, server.attributes)
    );
    return new Filter(servers);
  }

  public async get(id: string | number, external: boolean = false) {
    const server = new Server(this.#client);
    return server.get(id, external);
  }

  public async create(data: CreateServerData): Promise<Server> {
    return new Promise<Server>((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await new CreateServer(this.#client, data).execute();
          resolve(new Server(this.#client, response.attributes));
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
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

class Server {
  #client: PteroClient;
  public attributes!: ServerAttributes;

  constructor(client: PteroClient, attributes?: ServerAttributes) {
    this.#client = client;
    if (attributes) {
      this.attributes = attributes;
    }
  }

  public async get(id: string | number, external: boolean = false) {
    const response = await new ServerDetails(
      this.#client,
      id,
      external
    ).execute();
    this.attributes = response.attributes;
    return this;
  }

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

  public async delete(force: boolean = false) {
    if (!this.attributes?.id) {
      throw new NotFoundError("Server", "unknown");
    }
    await new DeleteServer(this.#client, this.attributes.id, force).execute();
  }

  public async suspend() {
    if (!this.attributes?.id) {
      throw new NotFoundError("Server", "unknown");
    }
    const response = await new SuspendServer(
      this.#client,
      this.attributes.id
    ).execute();
    this.attributes = response.attributes;
    return this;
  }

  public async unsuspend() {
    if (!this.attributes?.id) {
      throw new NotFoundError("Server", "unknown");
    }
    const response = await new UnsuspendServer(
      this.#client,
      this.attributes.id
    ).execute();
    this.attributes = response.attributes;
    return this;
  }

  public isSuspended(): boolean {
    return this.attributes?.suspended || false;
  }

  public getIdentifier(): string {
    return this.attributes?.identifier || "";
  }

  public getUuid(): string {
    return this.attributes?.uuid || "";
  }

  public getName(): string {
    return this.attributes?.name || "";
  }

  public getDescription(): string {
    return this.attributes?.description || "";
  }

  public getNode(): number {
    return this.attributes?.node || 0;
  }

  public getUser(): number {
    return this.attributes?.user || 0;
  }

  public getAllocation(): number {
    return this.attributes?.allocation || 0;
  }

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

  public getFeatureLimits() {
    return (
      this.attributes?.feature_limits || {
        databases: 0,
        allocations: 0,
        backups: 0,
      }
    );
  }
}

export { Servers, Server };
