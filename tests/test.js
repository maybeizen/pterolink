import "dotenv/config";
import { PteroClient } from "pterolink";

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  panelUrl: process.env.URL,
};

const client = new PteroClient(config);

async function main() {
  let servers = await client.servers.list();

  const sortedServers = servers.sort((a, b) => {
    return b.attributes.suspended - a.attributes.suspended;
  });

  console.log(sortedServers);
}

main();
