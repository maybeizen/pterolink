import { PteroClient, User } from "pterolink";
import "dotenv/config";

if (!process.env.APPLICATION_API_KEY || !process.env.URL) {
  throw new Error("Missing required environment variables");
}

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
} as const;

const client = new PteroClient(config);

async function main() {
  await client.users.delete(6).then(() => {
    console.log("Deleted user 6");
  });
}

main();
