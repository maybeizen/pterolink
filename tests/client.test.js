import "dotenv/config";
import { logger, Color } from "../dist/index.mjs";
import { UserClient } from "../dist/index.mjs";

const client = new UserClient({
  apiKey: process.env.USER_API_KEY,
  url: process.env.URL,
});

async function apiKeys() {
  const apiKeys = await client.account.apiKeys.list();
  logger.info(JSON.stringify(apiKeys, null, 2));
}

// await client.account.apiKeys
//   .create("Test API Key", ["127.0.0.1"])
//   .then((apiKey) => {
//     logger.info(JSON.stringify(apiKey, null, 2));
//   });

apiKeys();
