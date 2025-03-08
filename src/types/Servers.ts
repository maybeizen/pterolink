export interface ServerAttributes {
  id: number;
  external_id: string | null;
  uuid: string;
  identifier: string;
  name: string;
  description: string | null;
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
  pack: null;
  container: {
    startup_command: string;
    image: string;
    installed: boolean;
    environment: {
      [key: string]: string;
    };
  };
  updated_at: string;
  created_at: string;
  relationships?: {
    databases?: {
      object: string;
      data: Array<{
        object: string;
        attributes: {
          id: number;
          server: number;
          host: number;
          database: string;
          username: string;
          remote: string;
          max_connections: number;
          created_at: string;
          updated_at: string;
        };
      }>;
    };
  };
}

export interface Server {
  object: string;
  attributes: ServerAttributes;
}

export interface ServerResponse {
  object: string;
  data: Server[];
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

export interface ServerListResponse {
  object: string;
  data: Server[];
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

export interface ServerDetailsResponse {
  object: string;
  data: Server;
}
