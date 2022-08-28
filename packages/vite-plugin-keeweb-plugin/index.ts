import { readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { Plugin } from "vite";

export interface VitePluginKeewebPluginOptions {
  packagePath?: string;
}

let viteConfig: any = {};
let packageJson: Record<string, any> = {};
let manifestJson: Record<string, any> = {
  version: "0.0.1",
  manifestVersion: "0.1.0",
  name: "",
  description: "",
  author: {
    name: "",
    email: "",
    url: "",
  },
  resources: {
    js: false,
    css: false,
    loc: false,
  },
  license: "MIT",
  url: "",
  publicKey: "",
};

function compileManifestJson() {
  Object.keys(manifestJson).forEach((key) => {
    manifestJson[key] = packageJson[key] ?? manifestJson[key];
  });
}

function createManifestJson(outDir, manifest = manifestJson) {
  const p = join(process.cwd(), outDir, "manifest.json");
  writeFileSync(p, JSON.stringify(manifest));
}

export default function ({
  packagePath,
}: VitePluginKeewebPluginOptions): Plugin {
  if (!packagePath) {
    packagePath = resolve(process.cwd(), "package.json");
  }
  const rawPackageJson = readFileSync(packagePath);
  packageJson = JSON.parse(rawPackageJson as unknown as string);
  compileManifestJson();
  return {
    name: "vite-plugin-keeweb-manifest",
    config() {
      return {
        build: {
          lib: {
            entry: resolve(process.cwd(), "lib/plugin.ts"),
            formats: ["cjs"],
            fileName: () => "plugin.js",
          },
          rollupOptions: {
            output: {
              assetFileNames(chunkInfo) {
                if (chunkInfo.name === "style.css") {
                  return "plugin.css";
                }
                return chunkInfo.name as string;
              },
            },
          },
        },
      };
    },
    configResolved(cfg) {
      viteConfig = cfg;
    },
    closeBundle() {
      createManifestJson(viteConfig.build.outDir);
    },
  };
}
