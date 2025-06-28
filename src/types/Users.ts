export interface UserAttributes {
  id: number;
  external_id: string | null;
  uuid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  root_admin: boolean;
  "2fa": boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface UserResponse {
  object: string;
  attributes: UserAttributes;
  meta?: {
    resource?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
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

export interface CreateUserData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password?: string;
  root_admin?: boolean;
  language?: string;
  external_id?: string | null;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  root_admin?: boolean;
  language?: string;
  external_id?: string | null;
}

export interface UserQueryParams {
  page?: number;
  per_page?: number;
  include?: string;
  filter?: string;
  email?: string;
  uuid?: string;
  username?: string;
  external_id?: string;
}

export interface UserCacheConfig {
  enabled: boolean;
  ttl: number;
}

export interface RateLimitConfig {
  enabled: boolean;
  requestsPerSecond: number;
  maxQueueSize?: number;
}

export interface UserErrorResponse {
  code: string;
  status: string;
  detail: string;
}

export interface SuccessResponse {
  object: string;
  attributes: {
    success: boolean;
    message?: string;
  };
}

export interface BulkOperationResponse {
  successful: number;
  failed: number;
  errors?: {
    id: number;
    error: string;
  }[];
}

export interface UserStats {
  servers_count: number;
  databases_count: number;
  allocations_count: number;
  total_resources: {
    memory: number;
    disk: number;
    cpu: number;
  };
}

export interface UserPermissions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  manage_servers: boolean;
  manage_databases: boolean;
  manage_allocations: boolean;
}
