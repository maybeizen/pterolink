import { PteroClient, User, CreateUserData, Servers, Server } from "pterolink";
import "dotenv/config";

if (!process.env.APPLICATION_API_KEY || !process.env.URL) {
  throw new Error("Missing required environment variables");
}

const client = new PteroClient({
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
});

async function main() {
  const servers = await client.servers.list();

  const server = await (await client.servers.get(1)).unsuspend().then(() => {
    console.log("Server unsuspended");
  });
}

main();
