import { PteroClient, User } from "pterolink";
import "dotenv/config";

if (!process.env.APPLICATION_API_KEY || !process.env.URL) {
  throw new Error("Missing required environment variables");
}

const client = new PteroClient({
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
});

async function main() {
  const user = (await client.users.list()).rootAdmins().get();
  console.log(user);
}

main();
