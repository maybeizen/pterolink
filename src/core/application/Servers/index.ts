import { PteroClient } from "../../PteroClient";
import { NotFoundError } from "../../../errors";
import { ServerAttributes } from "../../../types/Servers";
import { ListServers } from "./ListServers";

class Servers {
  #client: PteroClient;

  constructor(client: PteroClient) {
    this.#client = client;
  }

  public async list() {
    const response = await new ListServers(this.#client).execute();
    const servers = response.data.map(
      (server) => new Server(this.#client, server.attributes)
    );
    return servers;
  }
}

class Server {
  #client: PteroClient;
  public attributes!: ServerAttributes;

  constructor(client: PteroClient, attributes?: ServerAttributes) {
    this.#client = client;
    if (attributes) {
      this.attributes = attributes;
    }
  }
}

export { Servers, Server };
