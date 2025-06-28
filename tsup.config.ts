import { defineConfig, Format } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"] as Format[],
  dts: true,
  splitting: true,
  sourcemap: true,
  minify: false,
  clean: true,
  outDir: "dist",
});
