import { PteroClient } from "../dist/index.js";
import "dotenv/config";

const client = new PteroClient(
  process.env.APPLICATION_API_KEY,
  process.env.URL
);

client.healthCheck().then((res) => {
  console.log(res);
});
