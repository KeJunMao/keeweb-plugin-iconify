import { defineConfig } from "vite";
import { resolve } from "path";
import vitePluginKeewebPlugin from "./packages/vite-plugin-keeweb-plugin";

export default defineConfig({
  plugins: [
    vitePluginKeewebPlugin({
      packagePath: resolve(__dirname, "package.json"),
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/plugin.ts"),
      fileName: () => {
        return "plugin.js";
      },
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["views/icon-select-view"],
    },
  },
});
