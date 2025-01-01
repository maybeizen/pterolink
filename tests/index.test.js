import "dotenv/config";
import { ApplicationClient } from "../dist/index.mjs";
import { logger } from "../src/utils/logger.js";
import chalk from "chalk";

const config = {
  apiKey: process.env.APPLICATION_API_KEY,
  url: process.env.URL,
  rejectUnauthorized: true,
};

const client = new ApplicationClient(config);

async function testServerCreation() {
  logger.info("Starting server creation test...");

  try {
    const server = await client.servers.create({
      name: "Test",
      user: "1",
      egg: "1",
      docker_image: "1",
      startup: "1",
      limits: {
        memory: 1024,
        swap: 0,
        disk: 1024,
        io: 500,
        cpu: 0,
      },
      feature_limits: {
        databases: 1,
        allocations: 1,
        backups: 1,
      },
      allocation: {
        default: 1,
        additional: [1],
      },
      oom_disabled: false,
      node: 1,
      environment: {
        SERVER_JARFILE: "server.jar",
        VANILLA_VERSION: "latest",
      },
      start_on_completion: false,
      skip_scripts: false,
      external_id: "1",
    });

    logger.success("Server created successfully!");
    logger.debug("Server details:");
    console.log(chalk.cyan(JSON.stringify(server, null, 2)));

    return server;
  } catch (error) {
    logger.error("Failed to create server", error);
  }
}

async function testNodeCreation() {
  logger.info("Starting node creation test...");

  try {
    logger.debug("Sending create node request...");

    const newNode = await client.nodes.create({
      name: "Test",
      description: "This is a test node",
      location_id: 1,
      fqdn: "node2.example.com",
      scheme: "https",
      memory: 20480,
      memory_overallocate: 0,
      disk: 51200,
      disk_overallocate: 0,
      upload_size: 1024,
      daemon_base: "/srv/daemon-data",
      daemon_sftp: 2022,
      daemon_listen: 8080,
    });

    logger.success("Node created successfully!");
    logger.debug("Node details:");
    console.log(chalk.cyan(JSON.stringify(newNode, null, 2)));

    return newNode;
  } catch (error) {
    logger.error("Failed to create node", error);
  }
}

logger.info("Starting Pterodactyl API tests...");
testServerCreation().then(() => logger.info("Server creation test completed"));
