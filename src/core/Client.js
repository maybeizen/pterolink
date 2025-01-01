import axios from "axios";
import { Agent } from "https";
import Nodes from "./application/Nodes.js";
import Users from "./application/Users.js";
import Servers from "./application/Servers.js";
import Nests from "./application/Nests.js";
import Locations from "./application/Locations.js";

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
    this.servers = new Servers(this);
    this.nests = new Nests(this);
    this.locations = new Locations(this);
  }
}

export default ApplicationClient;
