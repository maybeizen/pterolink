import { PteroClient } from "../../PteroClient";
import { NotFoundError } from "../../../errors";
import { ValidationError } from "../../../errors/ValidationError";
import {
  NestAttributes,
  CreateNestData,
  UpdateNestData,
} from "../../../types/Nests";
import { ListNests } from "./ListNests";
import { NestDetails } from "./NestDetails";
import { CreateNest } from "./CreateNest";
import { UpdateNest } from "./UpdateNest";
import { DeleteNest } from "./DeleteNest";
import { Eggs, Egg as EggClass } from "./Eggs";

class Nests {
  #client: PteroClient;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private rateLimit = 5; // Lower rate limit for nest operations

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

  public async list(include: string[] = []) {
    const response = await new ListNests(this.#client, {
      include: include.join(","),
    }).execute();
    const nests = response.data.map(
      (nest) => new Nest(this.#client, nest.attributes)
    );
    return nests;
  }

  public async get(id: string | number, include: string[] = []) {
    const nest = new Nest(this.#client);
    return nest.get(id, include);
  }

  public async create(data: CreateNestData): Promise<Nest> {
    return new Promise<Nest>((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await new CreateNest(this.#client, data).execute();
          resolve(new Nest(this.#client, response.data.attributes));
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  public async delete(id: string | number) {
    await new DeleteNest(this.#client, id).execute();
  }

  public async bulkCreate(nests: CreateNestData[]) {
    const createdNests = await Promise.all(
      nests.map((nestData) => this.create(nestData))
    );
    return createdNests;
  }

  public async bulkDelete(ids: (string | number)[]) {
    await Promise.all(ids.map((id) => this.delete(id)));
  }
}

class Nest {
  #client: PteroClient;
  public attributes!: NestAttributes;
  public eggs: Eggs;

  constructor(client: PteroClient, attributes?: NestAttributes) {
    this.#client = client;
    if (attributes) {
      this.attributes = attributes;
      this.eggs = new Eggs(this.#client, attributes.id);
    } else {
      this.eggs = new Eggs(this.#client, 0); // Will be updated when get() is called
    }
  }

  public async get(id: string | number, include: string[] = []) {
    const response = await new NestDetails(this.#client, id, include).execute();
    this.attributes = response.data.attributes;
    this.eggs = new Eggs(this.#client, this.attributes.id);
    return this;
  }

  public async update(data: UpdateNestData) {
    if (!this.attributes?.id) {
      throw new NotFoundError("Nest", "unknown");
    }

    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    const response = await new UpdateNest(
      this.#client,
      this.attributes.id,
      data
    ).execute();

    this.attributes = response.data.attributes;
    return this;
  }

  public async delete() {
    if (!this.attributes?.id) {
      throw new NotFoundError("Nest", "unknown");
    }
    await new DeleteNest(this.#client, this.attributes.id).execute();
  }

  public getName(): string {
    return this.attributes?.name || "";
  }

  public getDescription(): string {
    return this.attributes?.description || "";
  }

  public getAuthor(): string {
    return this.attributes?.author || "";
  }

  public getEggs() {
    return (
      this.attributes?.relationships?.eggs?.data.map((e) => e.attributes) || []
    );
  }
}

export { Nests, Nest };
