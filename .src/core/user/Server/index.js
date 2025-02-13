import ServerDetails from "./ServerDetails.js";
import ChangePowerState from "./ChangePowerState.js";

class Server {
  constructor(client, serverId) {
    this.client = client;
    this.id = serverId;

    this.details = new ServerDetails(client);
    this.power = new ChangePowerState(client);
  }
}

export default Server;
