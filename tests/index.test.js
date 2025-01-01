import { PteroClient } from "../dist/index.mjs";
import { logger } from "../src/utils/logger.js";
import chalk from "chalk";

const client = new PteroClient({
  apiKey: "ptla_HNQzdpNHcfBOwB5LJt3GabJb67j6EP8o7zaEefkQNvS",
  url: "https://panel.maybeizen.space",
  rejectUnauthorized: true,
});

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

async function testUserCreation() {
  logger.info("Starting user creation test...");

  try {
    const newUser = await client.users.create({
      email: "test@example.com",
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      password: "password123",
    });

    logger.success("User created successfully!");
    logger.debug("User details:");
    console.log(chalk.cyan(JSON.stringify(newUser, null, 2)));

    return newUser;
  } catch (error) {
    logger.error("Failed to create user", error);
  }
}

logger.info("Starting Pterodactyl API tests...");
testUserCreation();
