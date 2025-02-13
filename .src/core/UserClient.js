import axios from "axios";
import { Agent } from "https";
import { Server, Account } from "./user/index.js";
import { Servers } from "./user/index.js";
import { ValidationError } from "../errors/index.js";

class UserClient {
  constructor(config) {
    if (!config.apiKey) {
      throw new ValidationError("API key is required in client config");
    }
    if (!config.url) {
      throw new ValidationError("URL is required in client config");
    }

    try {
      new URL(config.url);
    } catch (error) {
      throw new ValidationError("Invalid URL format provided");
    }

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

    this.servers = new Servers(this);
    this.server = (id) => new Server(this, id);
    this.account = new Account(this);
  }
}

export default UserClient;
