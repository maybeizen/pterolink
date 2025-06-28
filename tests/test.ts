import { PteroClient } from "pterolink";
import "dotenv/config";

if (!process.env.APPLICATION_API_KEY || !process.env.URL) {
  throw new Error("Missing required environment variables");
}

const client = new PteroClient({
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
});

async function main() {
  const nest = await client.nests.get(1);
  const egg = await nest.eggs.get(1);

  console.log(egg);
}

main();
