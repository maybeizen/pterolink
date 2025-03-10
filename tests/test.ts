import { PteroClient, User, CreateUserData } from "pterolink";
import "dotenv/config";

if (!process.env.APPLICATION_API_KEY || !process.env.URL) {
  throw new Error("Missing required environment variables");
}

const client = new PteroClient({
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
});

const users = [
  {
    email: "test@test.com",
    username: "test1",
    first_name: "Test",
    last_name: "Test",
  },
  {
    email: "test2@test.com",
    username: "test2",
    first_name: "Test",
    last_name: "Test",
  },
  {
    email: "test3@test.com",
    username: "test3",
    first_name: "Test",
    last_name: "Test",
  },
  {
    email: "test4@test.com",
    username: "test4",
    first_name: "Test",
    last_name: "Test",
  },
];

async function main() {
  const servers = await client.servers.list();
  console.log(servers);
}

main();
