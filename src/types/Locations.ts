/**
 * Represents the attributes of a location in the Pterodactyl panel
 */
export interface LocationAttributes {
  /** Unique identifier for the location */
  id: number;

  /** Short code for the location (e.g., "NYC") */
  short: string;

  /** Full description of the location (e.g., "New York City") */
  long: string;

  /** When the location was last updated */
  updated_at: string;

  /** When the location was created */
  created_at: string;

  /** Related resources for this location */
  relationships?: {
    /** Nodes associated with this location */
    nodes?: {
      object: string;
      data: Array<{
        object: string;
        attributes: any;
      }>;
    };

    /** Servers associated with this location */
    servers?: {
      object: string;
      data: Array<{
        object: string;
        attributes: any;
      }>;
    };
  };
}

/**
 * Data required to create a new location
 */
export interface CreateLocationData {
  /** Short code for the location (required) */
  short: string;

  /** Full description of the location (optional) */
  long?: string;
}

/**
 * Data for updating an existing location
 */
export interface UpdateLocationData {
  /** New short code for the location */
  short?: string;

  /** New description for the location */
  long?: string;
}

/**
 * API response for a single location
 */
export interface LocationResponse {
  /** Type of object returned */
  object: string;

  /** Location attributes */
  attributes: LocationAttributes;

  /** Additional metadata */
  meta?: {
    resource: string;
  };
}

/**
 * API response for multiple locations
 */
export interface LocationsResponse {
  /** Type of object returned */
  object: string;

  /** Array of location data */
  data: Array<{
    object: string;
    attributes: LocationAttributes;
  }>;

  /** Pagination metadata */
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: Record<string, string>;
    };
  };
}

/**
 * Query parameters for location requests
 */
export interface LocationQueryParams {
  /** Comma-separated list of relationships to include */
  include?: string;

  /** Page number for paginated results */
  page?: number;
}
