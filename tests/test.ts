import { PteroClient, logger } from "pterolink";
import "dotenv/config";

if (!process.env.APPLICATION_API_KEY || !process.env.URL) {
  throw new Error("Missing required environment variables");
}

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
} as const;

const client = new PteroClient(config);

client.healthCheck().then((res) => {
  console.log(res);
});
