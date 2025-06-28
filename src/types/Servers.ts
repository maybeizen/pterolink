export interface ServerAttributes {
  id: number;
  external_id: string | null;
  uuid: string;
  identifier: string;
  name: string;
  description: string;
  suspended: boolean;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads: number | null;
  };
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  user: number;
  node: number;
  allocation: number;
  nest: number;
  egg: number;
  container: {
    startup_command: string;
    image: string;
    installed: boolean;
    environment: Record<string, string>;
  };
  updated_at: string;
  created_at: string;
}

export interface ServerResponse {
  object: "server";
  attributes: ServerAttributes;
}

export interface ServerListResponse {
  data: ServerResponse[];
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

export interface CreateServerData {
  name: string;
  user: number;
  egg: number;
  docker_image?: string;
  startup?: string;
  environment?: Record<string, string>;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
  };
  feature_limits: {
    databases: number;
    backups: number;
  };
  allocation: {
    default: number;
    additional?: number[];
  };
  external_id?: string;
  description?: string;
}

export interface UpdateServerDetailsData {
  name?: string;
  user?: number;
  external_id?: string | null;
  description?: string;
}

export interface UpdateServerBuildData {
  allocation?: number;
  limits?: {
    memory?: number;
    swap?: number;
    disk?: number;
    io?: number;
    cpu?: number;
    threads?: number | null;
  };
  feature_limits?: {
    databases?: number;
    allocations?: number;
    backups?: number;
  };
}

export interface ServerQueryParams {
  page?: number;
  per_page?: number;
  filter?: string;
  include?: string;
}

export interface ServerStats {
  current_state: "starting" | "running" | "stopping" | "offline";
  resources: {
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
  };
}

export interface ServerFilterOptions extends ServerQueryParams {
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
