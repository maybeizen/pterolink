import axios from "axios";
import { Agent } from "https";

class UserClient {
  constructor(config) {
    this.axios = axios.create({
      baseURL: `${config.url.replace(/\/$/, "")}/api/client`,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      httpsAgent: new Agent({
        rejectUnauthorized: config.rejectUnauthorized !== false,
      }),
    });
  }
}

export default UserClient;
