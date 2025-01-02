import AccountDetails from "./AccountDetails.js";
import APIKeys from "./APIKeys.js";
import TwoFactor from "./TwoFactor.js";

class Account {
  constructor(client) {
    this.client = client;
    this.details = new AccountDetails(client);
    this.apiKeys = new APIKeys(client);
    this.twoFactor = new TwoFactor(client);
  }
}

export default Account;
