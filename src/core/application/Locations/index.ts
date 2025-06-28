import { PteroClient } from "../../PteroClient";
import { NotFoundError } from "../../../errors";
import { ValidationError } from "../../../errors/ValidationError";
import { handleApiError } from "../../../errors";
import {
  LocationAttributes,
  LocationResponse,
  CreateLocationData,
  UpdateLocationData,
  LocationQueryParams,
} from "../../../types/Locations";
import { ListLocations } from "./ListLocations";
import { LocationDetails } from "./LocationDetails";
import { CreateLocation } from "./CreateLocation";
import { UpdateLocation } from "./UpdateLocation";
import { DeleteLocation } from "./DeleteLocation";

/**
 * Manages location operations in the Pterodactyl panel
 */
class Locations {
  #client: PteroClient;

  /**
   * Create a new Locations instance
   *
   * @param client PteroClient instance
   */
  constructor(client: PteroClient) {
    this.#client = client;
  }

  /**
   * List all locations in the panel
   *
   * @param params Optional query parameters
   * @returns Promise resolving to an array of Location instances
   *
   * @example
   * // Get all locations
   * const locations = await client.locations.list();
   */
  async list(params: LocationQueryParams = {}) {
    const response = await new ListLocations(this.#client, params).execute();

    return response.data.map((locationData: any) => {
      const location = new Location(this.#client);
      location.attributes = locationData.attributes;
      return location;
    });
  }

  /**
   * Get a location by ID
   *
   * @param id Location ID
   * @param include Optional relationships to include
   * @returns Promise resolving to a Location instance
   *
   * @example
   * // Get location with ID 1
   * const location = await client.locations.get(1);
   */
  async get(id: number | string, include: string[] = []) {
    const response = await new LocationDetails(
      this.#client,
      id,
      include
    ).execute();
    const location = new Location(this.#client);
    location.attributes = response.attributes;
    return location;
  }

  /**
   * Create a new location
   *
   * @param data Location creation data
   * @returns Promise resolving to the created Location instance
   *
   * @example
   * // Create a new location
   * const newLocation = await client.locations.create({
   *   short: "NYC",
   *   long: "New York City"
   * });
   */
  async create(data: CreateLocationData) {
    const response = await new CreateLocation(this.#client, data).execute();
    const location = new Location(this.#client);
    location.attributes = response.attributes;
    return location;
  }
}

/**
 * Represents a single location in the Pterodactyl panel
 */
class Location {
  #client: PteroClient;
  attributes?: LocationAttributes;

  /**
   * Create a new Location instance
   *
   * @param client PteroClient instance
   */
  constructor(client: PteroClient) {
    this.#client = client;
  }

  /**
   * Get location ID
   *
   * @returns Location ID
   */
  public getId(): number {
    return this.attributes?.id || 0;
  }

  /**
   * Get location short name
   *
   * @returns Short name
   */
  public getShortName(): string {
    return this.attributes?.short || "";
  }

  /**
   * Get location long name
   *
   * @returns Long name
   */
  public getLongName(): string {
    return this.attributes?.long || "";
  }

  /**
   * Get location creation date
   *
   * @returns Creation date string
   */
  public getCreatedAt(): string {
    return this.attributes?.created_at || "";
  }

  /**
   * Get location last update date
   *
   * @returns Last update date string
   */
  public getUpdatedAt(): string {
    return this.attributes?.updated_at || "";
  }

  /**
   * Update location details
   *
   * @param data Location update data
   * @returns Promise resolving to the updated Location instance
   *
   * @example
   * // Update location name
   * await location.update({ long: "Updated Location Name" });
   */
  public async update(data: UpdateLocationData) {
    if (!this.attributes?.id) {
      throw new NotFoundError("Location", "unknown");
    }

    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    const response = await new UpdateLocation(
      this.#client,
      this.attributes.id,
      data
    ).execute();

    this.attributes = response.attributes;
    return this;
  }

  /**
   * Delete the location
   *
   * @returns Promise resolving when the location is deleted
   *
   * @example
   * // Delete the location
   * await location.delete();
   */
  public async delete() {
    if (!this.attributes?.id) {
      throw new NotFoundError("Location", "unknown");
    }
    await new DeleteLocation(this.#client, this.attributes.id).execute();
  }

  /**
   * Convert location to a simple object representation
   *
   * @returns Simple object with key location properties
   */
  public toJSON() {
    return {
      id: this.getId(),
      shortName: this.getShortName(),
      longName: this.getLongName(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  /**
   * String representation of the location
   *
   * @returns String representation
   */
  public toString(): string {
    return `Location(${this.getId()}: ${this.getShortName()})`;
  }
}

export { Locations, Location };
