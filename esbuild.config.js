import { build } from "esbuild";
import { logger } from "./src/utils/logger.js";

const sharedConfig = {
  entryPoints: ["./src/index.js"],
  bundle: true,
  sourcemap: true,
  minify: false,
  platform: "node",
  target: "node20",
  external: ["axios", "chalk"],
};

logger.info("Starting PteroLink build process...");
logger.debug(
  `Build configuration: \n${JSON.stringify(sharedConfig, null, 2)}\n`
);

const formatBuildTime = (startTime) => {
  const buildTime = Date.now() - startTime;
  return buildTime < 1000
    ? `${buildTime}ms`
    : `${(buildTime / 1000).toFixed(2)}s`;
};

const buildESM = async () => {
  const startTime = Date.now();
  logger.info("Building ESM modules...");

  try {
    await build({
      ...sharedConfig,
      outfile: "./dist/index.mjs",
      format: "esm",
    });

    const buildTime = formatBuildTime(startTime);
    logger.success(`ESM modules built successfully! (${buildTime})`);
    logger.debug("Output: ./dist/index.mjs");
  } catch (err) {
    logger.error("Failed to build ESM modules", err);
    process.exit(1);
  }
};

const buildCJS = async () => {
  const startTime = Date.now();
  logger.info("Building CommonJS modules...");

  try {
    await build({
      ...sharedConfig,
      outfile: "./dist/index.js",
      format: "cjs",
    });

    const buildTime = formatBuildTime(startTime);
    logger.success(`CommonJS modules built successfully! (${buildTime})`);
    logger.debug("Output: ./dist/index.js");
  } catch (err) {
    logger.error("Failed to build CommonJS modules", err);
    process.exit(1);
  }
};

const main = async () => {
  const totalStartTime = Date.now();

  try {
    logger.info("Cleaning previous builds...");
    await buildESM();
    await buildCJS();

    const totalBuildTime = formatBuildTime(totalStartTime);
    logger.success(
      `✨ PteroLink build completed successfully! (${totalBuildTime})`
    );

    if (process.argv.includes("--watch")) {
      logger.info("👀 Watching for changes...");
    }
  } catch (err) {
    logger.error("Build process failed", err);
    process.exit(1);
  }
};

if (process.argv.includes("--watch")) {
  sharedConfig.watch = {
    onRebuild(error, result) {
      if (error) {
        logger.error("Watch build failed:", error.toString());
      } else {
        logger.success("Watch build succeeded!");
      }
    },
  };
}

main();
