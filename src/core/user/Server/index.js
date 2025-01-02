import ServerDetails from "./ServerDetails.js";

class Server {
  constructor(client, serverId) {
    this.client = client;
    this.id = serverId;

    this.details = new ServerDetails(client, serverId);
  }
}

export default Server;
