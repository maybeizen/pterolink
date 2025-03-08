import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ValidationError } from "../errors/index";
import { Users, User } from "./application/Users";

interface HealthCheckResponse {
  message: string;
  data?: any;
}

interface PteroClientConfig {
  apiKey: string;
  panelUrl: string;
}

class PteroClient {
  private apiKey: string;
  private panelUrl: string;
  public axios: AxiosInstance;
  public users: Users;
  public user: User;

  constructor(config: PteroClientConfig) {
    this.apiKey = config.apiKey;
    this.panelUrl = config.panelUrl;

    this.users = new Users(this);
    this.user = new User(this);
    try {
      new URL(this.panelUrl);
    } catch (error) {
      throw new ValidationError("Invalid URL format provided");
    }

    this.axios = axios.create({
      baseURL: `${this.panelUrl}/api/application`,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const response: AxiosResponse = await this.axios.get("/servers");
      return response.status === 200
        ? { message: "200 OK" }
        : { message: "500 Internal Server Error" };
    } catch (error) {
      return { message: "500 Internal Server Error", data: error };
    }
  }

  toJSON() {
    return {
      panelUrl: this.panelUrl,
      _type: "PteroLink.Client",
    };
  }

  toString() {
    return `PteroClient(${this.panelUrl})`;
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return {
      panelUrl: this.panelUrl,
      apiKey: "***************",
      _type: "PteroLink.Client",
    };
  }
}

export { PteroClient };
