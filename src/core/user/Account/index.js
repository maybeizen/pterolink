import AccountDetails from "./AccountDetails.js";
import APIKeys from "./APIKeys.js";
import TwoFactor from "./TwoFactor.js";
import Email from "./UpdateEmail.js";
import UpdatePassword from "./UpdatePassword.js";

/**
 * Handles account-related operations
 * @class
 */
class Account {
  /**
   * Creates a new Account instance
   * @param {import('../UserClient.js').default} client - The UserClient instance
   */
  constructor(client) {
    this.client = client;
    this.details = new AccountDetails(client);
    this.apiKeys = new APIKeys(client);
    this.twoFactor = new TwoFactor(client);
    this.email = new Email(client);
    this.password = new UpdatePassword(client);
  }
}

export default Account;
