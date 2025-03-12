import { PteroClient } from "../../../PteroClient";
import { NotFoundError } from "../../../../errors";
import { ValidationError } from "../../../../errors/ValidationError";
import {
  EggAttributes,
  CreateEggData,
  UpdateEggData,
  EggVariableAttributes,
  CreateEggVariableData,
  UpdateEggVariableData,
} from "../../../../types/Nests";
import { ListEggs } from "./ListEggs";
import { EggDetails } from "./EggDetails";
import { CreateEgg } from "./CreateEgg";
import { UpdateEgg } from "./UpdateEgg";
import { DeleteEgg } from "./DeleteEgg";

class Eggs {
  #client: PteroClient;
  #nestId: string | number;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private rateLimit = 5;

  constructor(client: PteroClient, nestId: string | number) {
    this.#client = client;
    this.#nestId = nestId;
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
    const response = await new ListEggs(this.#client, this.#nestId, {
      include: include.join(","),
    }).execute();
    const eggs = response.data.data.map(
      (egg: any) => new Egg(this.#client, this.#nestId, egg.attributes)
    );
    return eggs;
  }

  public async get(id: string | number, include: string[] = []) {
    const egg = new Egg(this.#client, this.#nestId);
    return egg.get(id, include);
  }

  public async create(data: CreateEggData): Promise<Egg> {
    return new Promise<Egg>((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await new CreateEgg(
            this.#client,
            this.#nestId,
            data
          ).execute();
          resolve(
            new Egg(this.#client, this.#nestId, response.data.attributes)
          );
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  public async delete(id: string | number) {
    await new DeleteEgg(this.#client, this.#nestId, id).execute();
  }

  public async bulkCreate(eggs: CreateEggData[]) {
    const createdEggs = await Promise.all(
      eggs.map((eggData) => this.create(eggData))
    );
    return createdEggs;
  }

  public async bulkDelete(ids: (string | number)[]) {
    await Promise.all(ids.map((id) => this.delete(id)));
  }
}

class Egg {
  #client: PteroClient;
  #nestId: string | number;
  public attributes!: EggAttributes;

  constructor(
    client: PteroClient,
    nestId: string | number,
    attributes?: EggAttributes
  ) {
    this.#client = client;
    this.#nestId = nestId;
    if (attributes) {
      this.attributes = attributes;
    }
  }

  public async get(id: string | number, include: string[] = []) {
    const response = await new EggDetails(
      this.#client,
      this.#nestId,
      id,
      include
    ).execute();
    this.attributes = response.data.attributes;
    return this;
  }

  public async update(data: UpdateEggData) {
    if (!this.attributes?.id) {
      throw new NotFoundError("Egg", "unknown");
    }

    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    const response = await new UpdateEgg(
      this.#client,
      this.#nestId,
      this.attributes.id,
      data
    ).execute();

    this.attributes = response.data.attributes;
    return this;
  }

  public async delete() {
    if (!this.attributes?.id) {
      throw new NotFoundError("Egg", "unknown");
    }
    await new DeleteEgg(
      this.#client,
      this.#nestId,
      this.attributes.id
    ).execute();
  }

  public getName(): string {
    return this.attributes?.name || "";
  }

  public getDescription(): string {
    return this.attributes?.description || "";
  }

  public getDockerImage(): string {
    return this.attributes?.docker_image || "";
  }

  public getDockerImages(): Record<string, string> | undefined {
    return this.attributes?.docker_images;
  }

  public getStartup(): string {
    return this.attributes?.startup || "";
  }

  public getVariables(): EggVariableAttributes[] {
    return (
      this.attributes?.relationships?.variables?.data.map(
        (v) => v.attributes
      ) || []
    );
  }
}

export { Eggs, Egg };
