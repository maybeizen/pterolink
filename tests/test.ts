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

client.users
  .create({
    email: "test@pterolink.dev",
    username: "test",
    first_name: "test",
    last_name: "test",
  })
  .then((user) => {
    console.log(user);
  });
