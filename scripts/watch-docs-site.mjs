#!/usr/bin/env node
// Rebuilds the static site whenever its sources change, and runs the server
// alongside it, so `npm run dev` never needs to be stopped/restarted —
// just save a file and refresh the browser.
import { spawn, spawnSync } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.resolve(process.argv[2] || "dist/public-docs-site");
const buildScript = path.join(repoRoot, "scripts/build-public-docs-site.mjs");
const serveScript = path.join(repoRoot, "scripts/serve-docs-site.mjs");

const watchTargets = [
  "scripts/build-public-docs-site.mjs",
  "docs",
  "media",
  "install.sh",
  "install.ps1",
].map((p) => path.join(repoRoot, p));

function build() {
  const start = Date.now();
  const result = spawnSync(process.execPath, [buildScript, outputDir], { stdio: "inherit" });
  if (result.status === 0) {
    console.log(`[watch] rebuilt in ${Date.now() - start}ms — refresh your browser`);
  } else {
    console.error("[watch] build failed");
  }
}

build();

const server = spawn(process.execPath, [serveScript, outputDir], { stdio: "inherit" });
server.on("exit", (code) => process.exit(code ?? 0));

let pending = null;
for (const target of watchTargets) {
  watch(target, { recursive: true }, () => {
    clearTimeout(pending);
    pending = setTimeout(build, 150);
  });
}

process.on("SIGINT", () => {
  server.kill("SIGINT");
  process.exit(0);
});
