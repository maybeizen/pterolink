import {
  PteroClient,
  User,
  CreateUserData,
  Servers,
  Server,
  Nodes,
  Node,
  Nests,
  Nest,
} from "pterolink";
import type { Node as NodeType } from "pterolink";
import "dotenv/config";

if (!process.env.APPLICATION_API_KEY || !process.env.URL) {
  throw new Error("Missing required environment variables");
}

const client = new PteroClient({
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
});

async function main() {
  const nests = await client.nest.get(1);

  console.log(nests);
}

main();
