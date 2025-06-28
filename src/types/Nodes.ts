import { ServerAttributes } from "./Servers";

export interface NodeAttributes {
  id: number;
  uuid: string;
  public: boolean;
  name: string;
  description: string | null;
  location_id: number;
  fqdn: string;
  scheme: string;
  behind_proxy: boolean;
  maintenance_mode: boolean;
  memory: number;
  memory_overallocate: number;
  disk: number;
  disk_overallocate: number;
  upload_size: number;
  daemon_listen: number;
  daemon_sftp: number;
  daemon_base: string;
  created_at: string;
  updated_at: string;
  allocated_resources?: {
    memory: number;
    disk: number;
  };
  relationships?: NodeRelationships;
}

export interface NodeRelationships {
  allocations?: {
    object: string;
    data: Array<{
      object: string;
      attributes: {
        id: number;
        ip: string;
        alias: string | null;
        port: number;
        assigned: boolean;
        node: number;
        created_at: string;
        updated_at: string;
      };
    }>;
  };
  location?: {
    object: string;
    attributes: {
      id: number;
      short: string;
      long: string;
      created_at: string;
      updated_at: string;
    };
  };
  servers?: {
    object: string;
    data: Array<{
      object: string;
      attributes: ServerAttributes;
    }>;
  };
}

export interface Node {
  object: string;
  attributes: NodeAttributes;
}

export interface NodeListResponse {
  object: string;
  attributes: NodeAttributes;
}

export interface NodeDetailsResponse {
  object: string;
  data: Node;
}

export interface CreateNodeData {
  name: string;
  location_id: number;
  fqdn: string;
  scheme?: string;
  behind_proxy?: boolean;
  memory: number;
  memory_overallocate?: number;
  disk: number;
  disk_overallocate?: number;
  upload_size?: number;
  daemon_sftp?: number;
  daemon_listen?: number;
  description?: string;
  daemon_base?: string;
}

export interface UpdateNodeData {
  name?: string;
  location_id?: number;
  fqdn?: string;
  scheme?: string;
  behind_proxy?: boolean;
  maintenance_mode?: boolean;
  memory?: number;
  memory_overallocate?: number;
  disk?: number;
  disk_overallocate?: number;
  upload_size?: number;
  daemon_sftp?: number;
  daemon_listen?: number;
  description?: string;
  daemon_base?: string;
}

export interface NodeQueryParams {
  page?: number;
  per_page?: number;
  include?: string;
}

export interface NodeFilterOptions extends NodeQueryParams {
  limit?: number;
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
