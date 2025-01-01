import chalk from "chalk";
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  RateLimitError,
} from "../errors/index.js";

export const logger = {
  info: (message) => console.log(chalk.blue("🔵"), chalk.blue(message)),
  success: (message) => console.log(chalk.green("🟢"), chalk.green(message)),
  error: (message, error) => {
    console.log(chalk.red("🔴"), chalk.red(message));

    if (error instanceof ValidationError) {
      console.log(chalk.red("🔴 Validation Errors:"));
      error.errors.forEach((err) => {
        console.log(chalk.red(`    - ${err.detail || err}`));
      });
    } else if (error instanceof UnauthorizedError) {
      console.log(
        chalk.red("🔴 Authentication Error:"),
        chalk.yellow(error.message)
      );
    } else if (error instanceof NotFoundError) {
      console.log(
        chalk.red("🔴 Not Found:"),
        chalk.yellow(`${error.resource} (ID: ${error.resourceId})`)
      );
    } else if (error instanceof RateLimitError) {
      console.log(
        chalk.red("🔴 Rate Limited:"),
        chalk.yellow(`Try again in ${error.retryAfter} seconds`)
      );
    } else if (error?.response?.data) {
      console.log(chalk.red("🔵 Details:"));
      console.log(chalk.red("🔵 Status:"), chalk.yellow(error.response.status));
      console.log(
        chalk.red("🔵 Message:"),
        chalk.yellow(error.response.data.message || "Unknown error")
      );
      if (error.response.data.errors) {
        console.log(chalk.red("🔴 Validation Errors:"));
        error.response.data.errors.forEach((err) => {
          console.log(chalk.red(`    - ${err.detail}`));
        });
      }
    }
  },
  warn: (message) => console.log(chalk.yellow("🟡"), chalk.yellow(message)),
  debug: (message) => console.log(chalk.white("🔍"), chalk.white(message)),
};
