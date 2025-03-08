import { PteroClient } from "../core/PteroClient";

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

export interface UserResponse {
  object: string;
  attributes: UserAttributes;
}

export interface CreateUserData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface UpdateUserData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  language?: string;
  password?: string;
}
