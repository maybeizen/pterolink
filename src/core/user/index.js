import Server from "./Server/index.js";
import Account from "./Account/index.js";

class Servers {
  constructor(client) {
    this.client = client;
  }

  async list() {
    const response = await this.client.axios.get();
    return response.data.data;
  }

  async permissions() {
    const response = await this.client.axios.get("/permissions");
    return response.data;
  }
}

export { Server, Account, Servers };
