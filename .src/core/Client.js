import axios from "axios";
import { Agent } from "https";
import Nodes from "./application/Nodes.js";
import Users from "./application/Users.js";
import Servers from "./application/Servers.js";
import Nests from "./application/Nests.js";
import Locations from "./application/Locations.js";
import { ValidationError } from "../errors/index.js";

class ApplicationClient {
  constructor(config) {
    if (!config.apiKey)
      throw new ValidationError("API key is required in client config");
    if (!config.url)
      throw new ValidationError("URL is required in client config");

    try {
      new URL(config.url);
    } catch (error) {
      throw new ValidationError("Invalid URL format provided");
    }

    this.axios = axios.create({
      baseURL: `${config.url.replace(/\/$/, "")}/api/application`,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      timeout: config.timeout || 30000,
      httpsAgent: new Agent({
        rejectUnauthorized: config.rejectUnauthorized !== false,
      }),
    });

    this.nodes = new Nodes(this);
    this.users = new Users(this);
    this.servers = new Servers(this);
    this.nests = new Nests(this);
    this.locations = new Locations(this);
  }

  updateConfig(newConfig) {
    if (newConfig.apiKey) {
      this.axios.defaults.headers.Authorization = `Bearer ${newConfig.apiKey}`;
    }
    if (newConfig.timeout) {
      this.axios.defaults.timeout = newConfig.timeout;
    }
  }
}

export default ApplicationClient;
