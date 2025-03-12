import {
  PteroClient,
  User,
  CreateUserData,
  Servers,
  Server,
  Nodes,
  Node,
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
  const nodes = await client.nodes.list();

  nodes.forEach((node: NodeType) => {
    console.log(node.attributes.allocated_resources);
  });
}

main();
