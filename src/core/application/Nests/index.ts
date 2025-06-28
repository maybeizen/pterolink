import { PteroClient } from "../../PteroClient";
import { NotFoundError } from "../../../errors";
import { ValidationError } from "../../../errors/ValidationError";
import { handleApiError } from "../../../errors";
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

/**
 * Manages nest operations in the Pterodactyl panel
 */
class Nests {
  #client: PteroClient;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private rateLimit = 5; // Lower rate limit for nest operations

  /**
   * Create a new Nests instance
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
   * List all nests in the panel
   *
   * @param include Optional relationships to include
   * @returns Promise resolving to an array of Nest instances
   *
   * @example
   * // Get all nests
   * const nests = await client.nests.list();
   *
   * // Get all nests with eggs included
   * const nestsWithEggs = await client.nests.list(['eggs']);
   */
  public async list(include: string[] = []) {
    try {
      const response = await this.queueRequest(() =>
        new ListNests(this.#client, {
          include: include.join(","),
        }).execute()
      );

      return response.data.map((nest: any) => {
        return new Nest(this.#client, nest.attributes);
      });
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nests",
        context: "listing nests",
      });
    }
  }

  /**
   * Get a nest by ID
   *
   * @param id Nest ID
   * @param include Optional relationships to include
   * @returns Promise resolving to a Nest instance
   *
   * @example
   * // Get nest with ID 1
   * const nest = await client.nests.get(1);
   *
   * // Get nest with eggs included
   * const nestWithEggs = await client.nests.get(1, ['eggs']);
   */
  public async get(id: string | number, include: string[] = []) {
    try {
      const nest = new Nest(this.#client);
      return await nest.get(id, include);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nest",
        identifier: id,
        context: "getting nest details",
      });
    }
  }

  /**
   * Create a new nest
   *
   * @param data Nest creation data
   * @returns Promise resolving to the created Nest instance
   *
   * @example
   * // Create a new nest
   * const newNest = await client.nests.create({
   *   name: "My Custom Nest",
   *   description: "A custom nest for my games"
   * });
   */
  public async create(data: CreateNestData): Promise<Nest> {
    try {
      return await this.queueRequest(async () => {
        const response = await new CreateNest(this.#client, data).execute();
        return new Nest(this.#client, response.data.attributes);
      });
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nest",
        identifier: data.name,
        context: "creating nest",
      });
    }
  }

  /**
   * Delete a nest by ID
   *
   * @param id Nest ID to delete
   * @returns Promise resolving when the nest is deleted
   *
   * @example
   * // Delete nest with ID 1
   * await client.nests.delete(1);
   */
  public async delete(id: string | number) {
    try {
      await this.queueRequest(() => new DeleteNest(this.#client, id).execute());
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nest",
        identifier: id,
        context: "deleting nest",
      });
    }
  }

  /**
   * Create multiple nests at once
   *
   * @param nests Array of nest creation data
   * @returns Promise resolving to an array of created Nest instances
   *
   * @example
   * // Create multiple nests
   * const newNests = await client.nests.bulkCreate([
   *   { name: "Nest 1", description: "First nest" },
   *   { name: "Nest 2", description: "Second nest" }
   * ]);
   */
  public async bulkCreate(nests: CreateNestData[]) {
    try {
      const createdNests = await Promise.all(
        nests.map((nestData) => this.create(nestData))
      );
      return createdNests;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nests",
        context: "bulk creating nests",
      });
    }
  }

  /**
   * Delete multiple nests at once
   *
   * @param ids Array of nest IDs to delete
   * @returns Promise resolving when all nests are deleted
   *
   * @example
   * // Delete multiple nests
   * await client.nests.bulkDelete([1, 2, 3]);
   */
  public async bulkDelete(ids: (string | number)[]) {
    try {
      await Promise.all(ids.map((id) => this.delete(id)));
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nests",
        context: "bulk deleting nests",
      });
    }
  }
}

/**
 * Represents a single nest in the Pterodactyl panel
 */
class Nest {
  #client: PteroClient;
  public attributes!: NestAttributes;
  public eggs: Eggs;

  /**
   * Create a new Nest instance
   *
   * @param client PteroClient instance
   * @param attributes Optional nest attributes
   */
  constructor(client: PteroClient, attributes?: NestAttributes) {
    this.#client = client;
    if (attributes) {
      this.attributes = attributes;
      this.eggs = new Eggs(this.#client, attributes.id);
    } else {
      this.eggs = new Eggs(this.#client, 0); // Will be updated when get() is called
    }
  }

  /**
   * Get nest details by ID
   *
   * @param id Nest ID
   * @param include Optional relationships to include
   * @returns Promise resolving to this Nest instance with updated attributes
   *
   * @example
   * // Get nest details
   * const nest = new Nest(client);
   * await nest.get(1);
   */
  public async get(id: string | number, include: string[] = []) {
    try {
      const response = await new NestDetails(
        this.#client,
        id,
        include
      ).execute();
      this.attributes = response.data.attributes;
      this.eggs = new Eggs(this.#client, this.attributes.id);
      return this;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nest",
        identifier: id,
        context: "getting nest details",
      });
    }
  }

  /**
   * Update nest details
   *
   * @param data Nest update data
   * @returns Promise resolving to this Nest instance with updated attributes
   *
   * @example
   * // Update nest description
   * await nest.update({ description: "Updated description" });
   */
  public async update(data: UpdateNestData) {
    if (!this.attributes?.id) {
      throw new NotFoundError("Nest", "unknown");
    }

    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    try {
      const response = await new UpdateNest(
        this.#client,
        this.attributes.id,
        data
      ).execute();

      this.attributes = response.data.attributes;
      return this;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nest",
        identifier: this.attributes.id,
        context: "updating nest details",
      });
    }
  }

  /**
   * Delete this nest
   *
   * @returns Promise resolving when the nest is deleted
   *
   * @example
   * // Delete the nest
   * await nest.delete();
   */
  public async delete() {
    if (!this.attributes?.id) {
      throw new NotFoundError("Nest", "unknown");
    }

    try {
      await new DeleteNest(this.#client, this.attributes.id).execute();
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nest",
        identifier: this.attributes.id,
        context: "deleting nest",
      });
    }
  }

  /**
   * Get nest ID
   *
   * @returns Nest ID
   */
  public getId(): number {
    return this.attributes?.id || 0;
  }

  /**
   * Get nest UUID
   *
   * @returns Nest UUID
   */
  public getUuid(): string {
    return this.attributes?.uuid || "";
  }

  /**
   * Get nest name
   *
   * @returns Nest name
   */
  public getName(): string {
    return this.attributes?.name || "";
  }

  /**
   * Get nest description
   *
   * @returns Nest description
   */
  public getDescription(): string {
    return this.attributes?.description || "";
  }

  /**
   * Get nest author
   *
   * @returns Nest author
   */
  public getAuthor(): string {
    return this.attributes?.author || "";
  }

  /**
   * Get nest creation date
   *
   * @returns Creation date string
   */
  public getCreatedAt(): string {
    return this.attributes?.created_at || "";
  }

  /**
   * Get nest last update date
   *
   * @returns Last update date string
   */
  public getUpdatedAt(): string {
    return this.attributes?.updated_at || "";
  }

  /**
   * Get eggs associated with this nest
   *
   * @returns Array of egg attributes
   */
  public getEggs() {
    return (
      this.attributes?.relationships?.eggs?.data.map((e) => e.attributes) || []
    );
  }

  /**
   * Convert nest to a simple object representation
   *
   * @returns Simple object with key nest properties
   */
  public toJSON() {
    return {
      id: this.getId(),
      uuid: this.getUuid(),
      name: this.getName(),
      description: this.getDescription(),
      author: this.getAuthor(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  /**
   * String representation of the nest
   *
   * @returns String representation
   */
  public toString(): string {
    return `Nest(${this.getId()}: ${this.getName()})`;
  }
}

export { Nests, Nest };
