import { PteroClient } from "../../../PteroClient";
import { NotFoundError } from "../../../../errors";
import { ValidationError } from "../../../../errors/ValidationError";
import { handleApiError } from "../../../../errors";
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

/**
 * Manages egg operations for a specific nest in the Pterodactyl panel
 */
class Eggs {
  #client: PteroClient;
  #nestId: string | number;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private rateLimit = 5;

  /**
   * Create a new Eggs instance
   *
   * @param client PteroClient instance
   * @param nestId Nest ID that these eggs belong to
   */
  constructor(client: PteroClient, nestId: string | number) {
    this.#client = client;
    this.#nestId = nestId;
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
   * List all eggs for this nest
   *
   * @param include Optional relationships to include
   * @returns Promise resolving to an array of Egg instances
   *
   * @example
   * // Get all eggs for a nest
   * const eggs = await nest.eggs.list();
   *
   * // Get all eggs with variables included
   * const eggsWithVars = await nest.eggs.list(['variables']);
   */
  public async list(include: string[] = []) {
    try {
      const response = await this.queueRequest(() =>
        new ListEggs(this.#client, this.#nestId, {
          include: include.join(","),
        }).execute()
      );

      return response.data.data.map(
        (egg: any) => new Egg(this.#client, this.#nestId, egg.attributes)
      );
    } catch (error) {
      throw handleApiError(error, {
        resource: "Eggs",
        context: "listing eggs",
      });
    }
  }

  /**
   * Get an egg by ID
   *
   * @param id Egg ID
   * @param include Optional relationships to include
   * @returns Promise resolving to an Egg instance
   *
   * @example
   * // Get egg with ID 1
   * const egg = await nest.eggs.get(1);
   *
   * // Get egg with variables included
   * const eggWithVars = await nest.eggs.get(1, ['variables']);
   */
  public async get(id: string | number, include: string[] = []) {
    try {
      const egg = new Egg(this.#client, this.#nestId);
      return await egg.get(id, include);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Egg",
        identifier: id,
        context: "getting egg details",
      });
    }
  }

  /**
   * Create a new egg
   *
   * @param data Egg creation data
   * @returns Promise resolving to the created Egg instance
   *
   * @example
   * // Create a new egg
   * const newEgg = await nest.eggs.create({
   *   name: "My Custom Egg",
   *   description: "A custom egg for my game server",
   *   docker_image: "my/custom-image:latest",
   *   // ... other required fields
   * });
   */
  public async create(data: CreateEggData): Promise<Egg> {
    try {
      return await this.queueRequest(async () => {
        const response = await new CreateEgg(
          this.#client,
          this.#nestId,
          data
        ).execute();

        return new Egg(this.#client, this.#nestId, response.data.attributes);
      });
    } catch (error) {
      throw handleApiError(error, {
        resource: "Egg",
        identifier: data.name,
        context: "creating egg",
      });
    }
  }

  /**
   * Delete an egg by ID
   *
   * @param id Egg ID to delete
   * @returns Promise resolving when the egg is deleted
   *
   * @example
   * // Delete egg with ID 1
   * await nest.eggs.delete(1);
   */
  public async delete(id: string | number) {
    try {
      await this.queueRequest(() =>
        new DeleteEgg(this.#client, this.#nestId, id).execute()
      );
    } catch (error) {
      throw handleApiError(error, {
        resource: "Egg",
        identifier: id,
        context: "deleting egg",
      });
    }
  }

  /**
   * Create multiple eggs at once
   *
   * @param eggs Array of egg creation data
   * @returns Promise resolving to an array of created Egg instances
   *
   * @example
   * // Create multiple eggs
   * const newEggs = await nest.eggs.bulkCreate([
   *   { name: "Egg 1", description: "First egg", ... },
   *   { name: "Egg 2", description: "Second egg", ... }
   * ]);
   */
  public async bulkCreate(eggs: CreateEggData[]) {
    try {
      const createdEggs = await Promise.all(
        eggs.map((eggData) => this.create(eggData))
      );
      return createdEggs;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Eggs",
        context: "bulk creating eggs",
      });
    }
  }

  /**
   * Delete multiple eggs at once
   *
   * @param ids Array of egg IDs to delete
   * @returns Promise resolving when all eggs are deleted
   *
   * @example
   * // Delete multiple eggs
   * await nest.eggs.bulkDelete([1, 2, 3]);
   */
  public async bulkDelete(ids: (string | number)[]) {
    try {
      await Promise.all(ids.map((id) => this.delete(id)));
    } catch (error) {
      throw handleApiError(error, {
        resource: "Eggs",
        context: "bulk deleting eggs",
      });
    }
  }
}

/**
 * Represents a single egg in the Pterodactyl panel
 */
class Egg {
  #client: PteroClient;
  #nestId: string | number;
  public attributes!: EggAttributes;

  /**
   * Create a new Egg instance
   *
   * @param client PteroClient instance
   * @param nestId Nest ID that this egg belongs to
   * @param attributes Optional egg attributes
   */
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

  /**
   * Get egg details by ID
   *
   * @param id Egg ID
   * @param include Optional relationships to include
   * @returns Promise resolving to this Egg instance with updated attributes
   *
   * @example
   * // Get egg details
   * const egg = new Egg(client, nestId);
   * await egg.get(1);
   */
  public async get(id: string | number, include: string[] = []) {
    try {
      const response = await new EggDetails(
        this.#client,
        this.#nestId,
        id,
        include
      ).execute();

      this.attributes = response.data.attributes;
      return this;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Egg",
        identifier: id,
        context: "getting egg details",
      });
    }
  }

  /**
   * Update egg details
   *
   * @param data Egg update data
   * @returns Promise resolving to this Egg instance with updated attributes
   *
   * @example
   * // Update egg description
   * await egg.update({ description: "Updated description" });
   */
  public async update(data: UpdateEggData) {
    if (!this.attributes?.id) {
      throw new NotFoundError("Egg", "unknown");
    }

    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    try {
      const response = await new UpdateEgg(
        this.#client,
        this.#nestId,
        this.attributes.id,
        data
      ).execute();

      this.attributes = response.data.attributes;
      return this;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Egg",
        identifier: this.attributes.id,
        context: "updating egg details",
      });
    }
  }

  /**
   * Delete this egg
   *
   * @returns Promise resolving when the egg is deleted
   *
   * @example
   * // Delete the egg
   * await egg.delete();
   */
  public async delete() {
    if (!this.attributes?.id) {
      throw new NotFoundError("Egg", "unknown");
    }

    try {
      await new DeleteEgg(
        this.#client,
        this.#nestId,
        this.attributes.id
      ).execute();
    } catch (error) {
      throw handleApiError(error, {
        resource: "Egg",
        identifier: this.attributes.id,
        context: "deleting egg",
      });
    }
  }

  /**
   * Get egg ID
   *
   * @returns Egg ID
   */
  public getId(): number {
    return this.attributes?.id || 0;
  }

  /**
   * Get egg UUID
   *
   * @returns Egg UUID
   */
  public getUuid(): string {
    return this.attributes?.uuid || "";
  }

  /**
   * Get egg name
   *
   * @returns Egg name
   */
  public getName(): string {
    return this.attributes?.name || "";
  }

  /**
   * Get egg description
   *
   * @returns Egg description
   */
  public getDescription(): string {
    return this.attributes?.description || "";
  }

  /**
   * Get egg docker image
   *
   * @returns Docker image
   */
  public getDockerImage(): string {
    return this.attributes?.docker_image || "";
  }

  /**
   * Get egg docker images
   *
   * @returns Docker images object
   */
  public getDockerImages(): Record<string, string> | undefined {
    return this.attributes?.docker_images;
  }

  /**
   * Get egg startup command
   *
   * @returns Startup command
   */
  public getStartup(): string {
    return this.attributes?.startup || "";
  }

  /**
   * Get egg variables
   *
   * @returns Array of egg variables
   */
  public getVariables(): EggVariableAttributes[] {
    return (
      this.attributes?.relationships?.variables?.data.map(
        (v) => v.attributes
      ) || []
    );
  }

  /**
   * Get egg creation date
   *
   * @returns Creation date string
   */
  public getCreatedAt(): string {
    return this.attributes?.created_at || "";
  }

  /**
   * Get egg last update date
   *
   * @returns Last update date string
   */
  public getUpdatedAt(): string {
    return this.attributes?.updated_at || "";
  }

  /**
   * Convert egg to a simple object representation
   *
   * @returns Simple object with key egg properties
   */
  public toJSON() {
    return {
      id: this.getId(),
      uuid: this.getUuid(),
      name: this.getName(),
      description: this.getDescription(),
      dockerImage: this.getDockerImage(),
      startup: this.getStartup(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  /**
   * String representation of the egg
   *
   * @returns String representation
   */
  public toString(): string {
    return `Egg(${this.getId()}: ${this.getName()})`;
  }
}

export { Eggs, Egg };
