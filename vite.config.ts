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
      external: [
        "models/group-model",
        "views/icon-select-view",
        "views/list-view",
        "views/grp-view",
        "views/details/details-view",
        "views/menu/menu-item-view",
        "framework/views/view",
        "const/icon-map",
        "models/file-model",
        "util/formatting/icon-url-format",
        "models/entry-model",
        "kdbxweb",
      ],
    },
  },
});
