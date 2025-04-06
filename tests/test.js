import "dotenv/config";
import { PteroClient } from "pterolink";

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
};

const client = new PteroClient(config);

async function main() {
  try {
    const nodes = await client.users.all();
    nodes.forEach((node) => console.log(node.username));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
