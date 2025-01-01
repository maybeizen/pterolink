import axios from "axios";
import { Agent } from "https";
import Nodes from "./application/Nodes.js";
import Users from "./application/Users.js";

class ApplicationClient {
  constructor(config) {
    this.axios = axios.create({
      baseURL: `${config.url.replace(/\/$/, "")}/api/application`,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      httpsAgent: new Agent({
        rejectUnauthorized: config.rejectUnauthorized !== false,
      }),
    });

    this.nodes = new Nodes(this);
    this.users = new Users(this);
  }
}

export default ApplicationClient;
