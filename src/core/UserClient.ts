import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { ValidationError } from "../errors/ValidationError";

interface HealthCheckResponse {
  message: string;
  data?: any;
}

interface UserClientConfig {
  userApiKey: string;
  userPanelUrl: string;
}

class UserClient {
  private userApiKey: string;
  private userPanelUrl: string;
  public axios: AxiosInstance;

  constructor(config: UserClientConfig) {
    this.userApiKey = config.userApiKey;
    this.userPanelUrl = config.userPanelUrl;

    try {
      new URL(this.userPanelUrl);
    } catch (error) {
      throw new ValidationError("Invalid URL format provided");
    }

    this.axios = axios.create({
      baseURL: `${this.userPanelUrl}/api/client`,
      headers: {
        Authorization: `Bearer ${this.userApiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const response: AxiosResponse = await this.axios.get("/");
      return response.status === 200
        ? { message: "200 OK" }
        : { message: "500 Internal Server Error" };
    } catch (error) {
      return { message: "500 Internal Server Error", data: error };
    }
  }

  toJSON() {
    return {
      userPanelUrl: this.userPanelUrl,
      _type: "PteroLink.UserClient",
    };
  }

  toString() {
    return `UserClient(${this.userPanelUrl})`;
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return {
      userPanelUrl: this.userPanelUrl,
      apiKey: "***************",
      _type: "PteroLink.UserClient",
    };
  }
}
