export interface PteroConfig {
  apiKey: string;
  url: string;
  timeout?: number;
  rejectUnauthorized?: boolean;
}

export interface APIResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}
