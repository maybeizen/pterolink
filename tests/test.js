import "dotenv/config";
import { PteroClient } from "pterolink";

const config = {
  apiKey: process.env.PTERODACTYL_APPLICATION_API_KEY,
  panelUrl: process.env.PTERODACTYL_BASE_URL,
};

const client = new PteroClient(config);

async function main() {
  try {
    const user = await client.users.all();
    console.log(user);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
