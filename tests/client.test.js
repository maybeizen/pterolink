import "dotenv/config";
import { logger } from "../dist/index.mjs";
import { UserClient } from "../dist/index.mjs";

const client = new UserClient({
  apiKey: process.env.USER_API_KEY,
  url: process.env.URL,
});

async function serverDetails(id) {
  const server = await client.server.details.get(id);
  logger.info(JSON.stringify(server, null, 2));
}

async function serverList() {
  const servers = await client.servers.list();
  logger.info(JSON.stringify(servers, null, 2));
}

async function serverPermissions() {
  const permissions = await client.servers.permissions();
  logger.info(JSON.stringify(permissions, null, 2));
}
serverPermissions();
