import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["./src/index.ts"],
    platform: "node",
    dts: true,
    external: ["fs", "path"],
    copy: ["src/settings.json", "src/.claudeignore"],
  },
]);
