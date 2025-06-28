export interface NestAttributes {
  id: number;
  uuid: string;
  author: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  relationships?: {
    eggs?: {
      data: {
        attributes: EggAttributes;
      }[];
    };
  };
}

export interface CreateNestData {
  name: string;
  description?: string;
}

export interface UpdateNestData {
  name?: string;
  description?: string;
}

export interface NestResponse {
  object: string;
  attributes: NestAttributes;
}

export interface NestsResponse {
  data: NestResponse[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
}

export interface EggAttributes {
  id: number;
  uuid: string;
  name: string;
  nest: number;
  author: string;
  description: string | null;
  docker_image: string;
  docker_images?: Record<string, string>;
  config: {
    files: Record<string, any>;
    startup: Record<string, any>;
    stop: string;
    logs: Record<string, any>;
    extends: Record<string, any>;
  };
  startup: string;
  script: {
    privileged: boolean;
    install: string;
    entry: string;
    container: string;
    extends: string | null;
  };
  created_at: string;
  updated_at: string;
  relationships?: {
    nest?: {
      data: {
        attributes: NestAttributes;
      };
    };
    variables?: {
      data: {
        attributes: EggVariableAttributes;
      }[];
    };
  };
}

export interface EggVariableAttributes {
  id: number;
  egg_id: number;
  name: string;
  description: string;
  env_variable: string;
  default_value: string;
  user_viewable: boolean;
  user_editable: boolean;
  rules: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEggData {
  name: string;
  nest: number;
  description?: string;
  docker_image?: string;
  docker_images?: Record<string, string>;
  config?: {
    files?: Record<string, any>;
    startup?: Record<string, any>;
    stop?: string;
    logs?: Record<string, any>;
    extends?: Record<string, any>;
  };
  startup?: string;
  script?: {
    privileged?: boolean;
    install?: string;
    entry?: string;
    container?: string;
    extends?: string | null;
  };
}

export interface UpdateEggData {
  name?: string;
  description?: string;
  docker_image?: string;
  docker_images?: Record<string, string>;
  config?: {
    files?: Record<string, any>;
    startup?: Record<string, any>;
    stop?: string;
    logs?: Record<string, any>;
    extends?: Record<string, any>;
  };
  startup?: string;
  script?: {
    privileged?: boolean;
    install?: string;
    entry?: string;
    container?: string;
    extends?: string | null;
  };
}

export interface CreateEggVariableData {
  name: string;
  description: string;
  env_variable: string;
  default_value: string;
  user_viewable: boolean;
  user_editable: boolean;
  rules: string;
}

export interface UpdateEggVariableData {
  name?: string;
  description?: string;
  env_variable?: string;
  default_value?: string;
  user_viewable?: boolean;
  user_editable?: boolean;
  rules?: string;
}
