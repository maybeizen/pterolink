import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
  // ESM build
  {
    input: "src/index.js",
    output: {
      file: "dist/index.mjs",
      format: "esm",
    },
    external: ["axios"],
    plugins: [nodeResolve(), commonjs()],
  },
  // CommonJS build
  {
    input: "src/index.js",
    output: {
      file: "dist/index.js",
      format: "cjs",
      exports: "named",
    },
    external: ["axios"],
    plugins: [nodeResolve(), commonjs()],
  },
];
