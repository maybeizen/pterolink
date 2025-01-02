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
