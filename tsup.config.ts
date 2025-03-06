import { defineConfig, Format } from "tsup";

const isDev = process.env.BUILD_TYPE === "dev";

const mainConfig = {
  entry: ["src/index.ts"],
  format: ["esm", "cjs"] as Format[],
  dts: true,
  splitting: false,
  sourcemap: isDev,
  minify: !isDev,
  clean: true,
  outDir: "dist",
  external: isDev ? ["axios", "chalk", "dotenv"] : ["axios", "chalk"],
};

// only included in development
const testConfig = {
  entry: ["tests/**/*.ts"],
  format: ["esm"] as Format[],
  dts: false,
  splitting: false,
  sourcemap: true,
  minify: false,
  clean: false,
  outDir: "dist/test",
  external: ["axios", "chalk", "dotenv", "pterolink"],
};

export default defineConfig(isDev ? [mainConfig, testConfig] : mainConfig);
