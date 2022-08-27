import { readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { Plugin } from "vite";
import HttpProxy from "http-proxy";
import * as crypto from "crypto";
import serveStatic from "serve-static";

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

function signPlugin(outDir) {
  const manifest = manifestJson;
  let signPromise = Promise.resolve(false);
  for (const res of Object.keys(manifest.resources)) {
    console.log(`Signing ${res}...`);
    let fileName;
    switch (res) {
      case "js":
        fileName = "plugin.js";
        break;
      case "css":
        fileName = "plugin.css";
        break;
      case "loc":
        fileName = manifest?.locale?.name + ".json";
        break;
    }
    signPromise = signPromise.then((changed) => {
      return signResource(outDir, fileName).then((signature) => {
        if (manifest.resources[res] !== signature) {
          manifest.resources[res] = signature;
          changed = true;
        }
        return changed;
      });
    });
  }
  signPromise
    .then((changed) => {
      if (changed) {
        createManifestJson(viteConfig.build.outDir);
        console.log("Done, package manifest updated");
      } else {
        console.log("No changes");
      }
    })
    .catch((e) => {
      console.error("Error", e);
    });
}

function signResource(outDir, fileName) {
  fileName = join(process.cwd(), outDir, fileName);
  const data = readFileSync(fileName);

  const privateKey = readFileSync(
    join(process.cwd(), "private_key.pem"),
    "binary"
  );
  return Promise.resolve().then(() => {
    const sign = crypto.createSign("RSA-SHA256");
    sign.write(data);
    sign.end();
    return sign.sign(privateKey).toString("base64");
  });
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

  const kwRes = HttpProxy.createProxy({
    target: "https://app.keeweb.info",
    changeOrigin: true,
  });
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
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.originalUrl === "/config.json") {
          res.writeHead(200);
          res.end(`{"settings":{},"plugins":[{"url":"/"}]}`);
          return;
        } else if (req.originalUrl === "/manifest.appcache") {
          res.writeHead(200);
          res.end("CACHE MANIFEST\nNETWORK:\n*\n");
          return;
        } else if (req.originalUrl === "/") {
          return kwRes.web(req, res);
        }
        next();
      });
      server.middlewares.use(
        serveStatic(join(process.cwd(), viteConfig.build.outDir))
      );
    },
    closeBundle() {
      createManifestJson(viteConfig.build.outDir);
      signPlugin(viteConfig.build.outDir);
    },
  };
}
