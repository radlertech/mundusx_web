#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.resolve(process.argv[2] ?? path.join(repoRoot, "dist/public-docs-site"));
const repoReleaseBaseUrl = "https://github.com/mundusx/mundusx/releases/latest/download";
const repoReleaseNotesUrl = "https://github.com/mundusx/mundusx/releases/latest";
const installScriptContents = fs.readFileSync(path.join(repoRoot, "install.sh"), "utf8");
const installPowershellContents = fs.readFileSync(path.join(repoRoot, "install.ps1"), "utf8");

const pages = [
  {
    slug: "",
    title: "MundusX Docs",
    sourcePath: null,
    intro:
      "Public-facing documentation for install, device identity, and release flow previews in the MundusX repo.",
  },
  {
    slug: "install",
    title: "Install MundusX",
    sourcePath: path.join(repoRoot, "docs/install-page.md"),
    intro: "Canonical install flow and command for the current localhost-first release path.",
  },
  {
    slug: "device-identity",
    title: "Device Identity Lifecycle",
    sourcePath: path.join(repoRoot, "docs/device-identity-lifecycle.md"),
    intro: "How contributor identity is stored, reused, and reset across the MundusX lifecycle.",
  },
  {
    slug: "release",
    title: "Install And Release Strategy",
    sourcePath: path.join(repoRoot, "docs/install-strategy.md"),
    intro: "Release-hosting and distribution notes that support the public install surface.",
  },
];

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

writeDocsVariant({
  outputBaseDir: outputDir,
  eyebrow: "Public Repo Docs",
  homeIntro:
    "Public-facing documentation for install, device identity, and release flow previews in the MundusX repo.",
});
writeDocsVariant({
  outputBaseDir: path.join(outputDir, "docs"),
  eyebrow: "Local Docs Preview",
  homeIntro:
    "Local documentation preview for install, device identity, and release flow notes in the MundusX repo.",
});
writeDocsVariant({
  outputBaseDir: path.join(outputDir, "public", "docs"),
  eyebrow: "Public Endpoint Mirror",
  homeIntro:
    "GitHub Pages mirror of the public docs shape so install, device identity, and release pages can be reviewed before the final domain is wired up.",
});
writeMarketingHomepage();
writeNetworkPage();
writePublicInstallSurface();
writePublicReleaseSurface();

fs.writeFileSync(path.join(outputDir, ".nojekyll"), "\n");

function writeDocsVariant({ outputBaseDir, eyebrow, homeIntro }) {
  for (const page of pages) {
    const html = renderPage(page, { eyebrow, homeIntro });
    const pageDir = page.slug ? path.join(outputBaseDir, page.slug) : outputBaseDir;
    fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(path.join(pageDir, "index.html"), html);
  }
}

function writeMarketingHomepage() {
  const assetDir = path.join(outputDir, "assets");
  fs.mkdirSync(assetDir, { recursive: true });
  fs.copyFileSync(path.join(repoRoot, "media/homepage-dark-bg.png"), path.join(assetDir, "homepage-dark-bg.png"));
  fs.copyFileSync(path.join(repoRoot, "media/mundusx-logo-official.svg"), path.join(assetDir, "mundusx-logo-official.svg"));
  fs.writeFileSync(path.join(outputDir, "index.html"), renderMarketingHomePage());
}

function writeNetworkPage() {
  const assetDir = path.join(outputDir, "assets");
  const networkDir = path.join(outputDir, "network");
  fs.mkdirSync(assetDir, { recursive: true });
  fs.mkdirSync(networkDir, { recursive: true });
  fs.copyFileSync(path.join(repoRoot, "media/network-hero-globe.png"), path.join(assetDir, "network-hero-globe.png"));
  fs.copyFileSync(path.join(repoRoot, "media/network-world-map.png"), path.join(assetDir, "network-world-map.png"));
  fs.copyFileSync(path.join(repoRoot, "media/network-cta-mountains.png"), path.join(assetDir, "network-cta-mountains.png"));
  fs.writeFileSync(path.join(networkDir, "index.html"), renderNetworkPage());
}

function renderMarketingHomePage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MundusX</title>
    <style>
      :root {
        color-scheme: dark;
        --page: #020910;
        --surface: rgba(5, 23, 37, 0.76);
        --surface-strong: rgba(3, 15, 27, 0.94);
        --surface-soft: rgba(6, 29, 47, 0.72);
        --border: rgba(91, 211, 255, 0.24);
        --border-strong: rgba(91, 211, 255, 0.48);
        --text: #f4f8ff;
        --muted: #b7c8d7;
        --soft: #8da5b6;
        --accent: #31cfff;
        --accent-2: #74e6ff;
        --accent-3: #168bff;
        --glow: rgba(49, 207, 255, 0.34);
        --shadow: 0 28px 80px rgba(0, 0, 0, 0.36);
        --hero-overlay: linear-gradient(90deg, rgba(2,9,16,0.92), rgba(2,12,21,0.36) 46%, rgba(2,9,16,0.82));
        --waves: radial-gradient(circle at 78% 9%, rgba(38, 158, 237, 0.34), transparent 25rem),
          radial-gradient(circle at 13% 78%, rgba(31, 206, 255, 0.14), transparent 25rem),
          linear-gradient(180deg, #03121d 0%, #020811 50%, #030e18 100%);
        --nav-bg: rgba(2, 12, 22, 0.82);
        --icon-bg: rgba(24, 96, 134, 0.24);
        --mountain: linear-gradient(135deg, transparent 0 38%, rgba(104, 178, 238, 0.22) 39% 62%, transparent 63%),
          linear-gradient(45deg, transparent 0 40%, rgba(1, 92, 178, 0.18) 41% 58%, transparent 59%);
      }
      * { box-sizing: border-box; }
      html {
        background: var(--page);
        scroll-behavior: smooth;
      }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0;
        color: var(--text);
        background: var(--waves);
        overflow-x: hidden;
      }
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 14% 36%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 1px),
          linear-gradient(90deg, color-mix(in srgb, var(--accent) 5%, transparent) 1px, transparent 1px),
          linear-gradient(180deg, color-mix(in srgb, var(--accent) 4%, transparent) 1px, transparent 1px);
        background-size: 18px 18px, 44px 44px, 44px 44px;
        mask-image: linear-gradient(180deg, transparent, #000 16%, #000 84%, transparent);
        opacity: 0.65;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
      svg {
        display: block;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .topbar {
        position: sticky;
        top: 0;
        z-index: 20;
        border-bottom: 1px solid rgba(91, 211, 255, 0.1);
        background: var(--nav-bg);
        backdrop-filter: blur(22px);
      }
      .nav {
        width: min(1720px, calc(100% - 76px));
        height: 64px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 25px;
        font-weight: 800;
        letter-spacing: -0.01em;
      }
      .mark {
        width: 47px;
        height: 30px;
        display: block;
        object-fit: contain;
        filter: drop-shadow(0 0 15px var(--glow));
      }
      .links {
        display: flex;
        align-items: center;
        gap: clamp(22px, 3vw, 48px);
        color: #edf6ff;
        font-size: 14px;
        font-weight: 600;
      }
      .actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .btn {
        min-height: 46px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        border-radius: 999px;
        border: 1px solid var(--border-strong);
        padding: 0 28px;
        font-size: 14px;
        font-weight: 800;
        white-space: nowrap;
        transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
      }
      .btn:hover {
        transform: translateY(-1px);
      }
      .btn.primary {
        color: white;
        background: linear-gradient(135deg, #35c8ff, #006eff);
        border-color: transparent;
        box-shadow: 0 18px 38px var(--glow), inset 0 1px rgba(255, 255, 255, 0.48);
      }
      .btn.ghost {
        background: var(--surface);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.35);
      }
      .theme-toggle {
        display: none;
        width: 46px;
        height: 46px;
        border: 1px solid var(--border);
        border-radius: 999px;
        color: var(--accent);
        background: var(--surface);
        display: grid;
        place-items: center;
        cursor: pointer;
        box-shadow: 0 10px 28px rgba(28, 114, 199, 0.09);
      }
      .hero {
        position: relative;
        min-height: 690px;
        overflow: hidden;
      }
      .hero::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          var(--hero-overlay),
          radial-gradient(ellipse at 74% 12%, rgba(37, 181, 255, 0.18), transparent 27rem),
          url("./assets/homepage-dark-bg.png") center 50% / cover no-repeat;
        opacity: 1;
      }
      .hero::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse at 51% 48%, transparent 0 26%, rgba(2, 9, 16, 0.2) 45%, rgba(2, 9, 16, 0.78) 100%),
          linear-gradient(180deg, transparent 0 74%, rgba(2, 9, 16, 0.9) 100%);
        opacity: 0.76;
      }
      .hero-inner {
        position: relative;
        z-index: 1;
        width: min(1700px, calc(100% - 92px));
        margin: 0 auto;
        padding: 58px 0 72px;
        display: grid;
        grid-template-columns: minmax(560px, 0.78fr) minmax(900px, 1.22fr);
        gap: 108px;
        align-items: center;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        border: 1px solid var(--border-strong);
        border-radius: 999px;
        padding: 9px 15px;
        color: var(--accent);
        background: rgba(3, 26, 43, 0.7);
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      h1 {
        max-width: 820px;
        margin: 28px 0 22px;
        font-size: clamp(58px, 4.2vw, 76px);
        line-height: 1;
        letter-spacing: -0.025em;
      }
      h1 span {
        color: #66d8ff;
      }
      .lead {
        max-width: 600px;
        margin: 0 0 32px;
        color: #e4eef8;
        font-size: clamp(19px, 1.2vw, 23px);
        line-height: 1.28;
      }
      .hero-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        margin-bottom: 22px;
      }
      .hero-buttons .btn {
        min-width: 286px;
      }
      .notes {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        color: var(--soft);
        font-size: 14px;
        font-weight: 600;
      }
      .notes span {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .notes span::before {
        display: none;
      }
      .notes span + span::before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 4px;
        margin: 0 11px 3px 0;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 14px var(--accent);
      }
      .product-shell {
        display: grid;
        grid-template-columns: 288px 1fr;
        min-height: 496px;
        border: 1px solid var(--border-strong);
        border-radius: 20px;
        background: rgba(3, 16, 27, 0.92);
        box-shadow: 0 0 44px rgba(31, 201, 255, 0.36), inset 0 1px rgba(255, 255, 255, 0.1);
        overflow: hidden;
      }
      .sidebar {
        padding: 20px 22px;
        border-right: 1px solid var(--border);
        background: rgba(2, 12, 22, 0.72);
      }
      .mini-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 800;
      }
      .mini-mark {
        width: 29px;
        height: 22px;
        display: block;
        object-fit: contain;
      }
      .mini-kicker {
        display: block;
        margin-top: 1px;
        color: var(--soft);
        font-size: 7px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .new-chat {
        width: 100%;
        margin: 20px 0 18px;
        min-height: 40px;
        justify-content: flex-start;
        border-radius: 9px;
        padding: 0 16px;
      }
      .section-label {
        margin: 18px 0 8px;
        color: var(--soft);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      .side-item,
      .chat-row {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 26px;
        color: #d7e5f0;
        font-size: 12px;
      }
      .side-item svg,
      .chat-row svg {
        width: 15px;
        height: 15px;
        color: var(--accent);
      }
      .recent {
        margin-top: 12px;
      }
      .chat-row {
        justify-content: space-between;
        color: #c7d8e5;
      }
      .chat-row b {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
      }
      .chat-row time {
        color: var(--soft);
        font-size: 10px;
      }
      .app-main {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 82px 42px 58px;
      }
      .app-main::after {
        content: "DRIVING INTELLIGENCE FOR A BRIGHTER TOMORROW";
        position: absolute;
        top: 92px;
        right: 38px;
        width: 104px;
        color: color-mix(in srgb, var(--soft) 72%, transparent);
        font-size: 9px;
        line-height: 1.7;
        letter-spacing: 0.36em;
      }
      .toggle {
        position: absolute;
        top: 14px;
        right: 16px;
        display: flex;
        gap: 7px;
        padding: 5px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: var(--surface-soft);
      }
      .toggle span {
        width: 27px;
        height: 27px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        color: var(--accent);
      }
      .toggle span:first-child {
        color: white;
        background: linear-gradient(135deg, var(--accent-2), var(--accent-3));
        box-shadow: 0 8px 18px var(--glow);
      }
      .assistant-title {
        margin-top: 4px;
        text-align: center;
      }
      .assistant-title h2 {
        margin: 0;
        font-size: 25px;
        line-height: 1.1;
        letter-spacing: -0.02em;
      }
      .assistant-title span {
        color: var(--accent);
      }
      .assistant-title p {
        max-width: 500px;
        margin: 12px auto 0;
        color: #cfdeea;
        font-size: 13px;
        line-height: 1.48;
      }
      .tool-grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
        margin: 36px 0 52px;
      }
      .tool-card {
        min-height: 148px;
        padding: 28px 16px 18px;
        border: 1px solid rgba(91, 211, 255, 0.24);
        border-radius: 8px;
        background: linear-gradient(180deg, rgba(7, 38, 59, 0.9), rgba(4, 21, 36, 0.82));
        text-align: center;
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.26);
      }
      .tool-icon {
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        margin: 0 auto 20px;
        color: var(--accent);
      }
      .tool-icon svg { width: 36px; height: 36px; stroke-width: 2.4; }
      .tool-card b {
        display: block;
        font-size: 13px;
      }
      .tool-card p {
        margin: 8px auto 0;
        color: #aebfce;
        font-size: 11px;
        line-height: 1.35;
      }
      .prompt {
        width: 100%;
        min-height: 58px;
        display: grid;
        grid-template-columns: 28px 1fr repeat(4, 30px) 46px;
        gap: 14px;
        align-items: center;
        border: 1px solid rgba(91, 211, 255, 0.26);
        border-radius: 999px;
        background: rgba(5, 30, 50, 0.88);
        padding: 6px 8px 6px 18px;
        color: var(--soft);
        font-size: 12px;
        box-shadow: 0 18px 48px rgba(18, 83, 156, 0.08);
      }
      .prompt svg {
        width: 18px;
        height: 18px;
      }
      .send {
        width: 46px;
        height: 46px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        color: white;
        background: linear-gradient(135deg, var(--accent-2), var(--accent-3));
        box-shadow: 0 10px 25px var(--glow);
      }
      .feature-rail {
        position: relative;
        z-index: 2;
        width: min(1920px, calc(100% - 92px));
        margin: 40px auto 0;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
      }
      .rail-card {
        min-height: 96px;
        display: grid;
        grid-template-columns: 66px 1fr 18px;
        gap: 22px;
        align-items: center;
        padding: 18px 32px;
        border: 1px solid rgba(91, 211, 255, 0.3);
        border-radius: 8px;
        background: rgba(7, 32, 52, 0.94);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.08), 0 0 26px rgba(36, 174, 229, 0.16);
      }
      .rail-icon {
        width: 50px;
        height: 50px;
        display: grid;
        place-items: center;
        border-radius: 8px;
        color: var(--accent);
        background: rgba(35, 206, 255, 0.09);
        box-shadow: 0 0 20px rgba(50, 212, 255, 0.46);
      }
      .rail-icon svg {
        width: 32px;
        height: 32px;
        stroke-width: 2.2;
      }
      .rail-card h3 {
        margin: 0 0 4px;
        font-size: 18px;
      }
      .rail-card p {
        margin: 0;
        color: #bdd1df;
        font-size: 13px;
        line-height: 1.35;
      }
      .network {
        position: relative;
        height: clamp(280px, 14.2vw, 340px);
        margin-top: 66px;
        overflow: hidden;
        background:
          radial-gradient(circle at 51.5% 58%, rgba(8, 102, 154, 0.34), transparent 19%),
          radial-gradient(circle at 51.5% 54%, rgba(32, 199, 247, 0.12), transparent 28%),
          linear-gradient(180deg, rgba(2, 13, 22, 0.98), rgba(3, 18, 30, 0.96));
      }
      .network::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(90deg, transparent 0%, rgba(32, 151, 199, 0.07) 25%, rgba(32, 151, 199, 0.08) 52%, rgba(32, 151, 199, 0.05) 78%, transparent 100%),
          linear-gradient(90deg, rgba(32, 151, 199, 0.065) 1px, transparent 1px),
          linear-gradient(180deg, rgba(32, 151, 199, 0.055) 1px, transparent 1px),
          url("./assets/homepage-dark-bg.png") center 61% / cover no-repeat;
        background-size: auto, 66px 66px, 66px 66px, cover;
        mask-image: linear-gradient(90deg, transparent 0%, #000 16%, #000 84%, transparent 100%);
        opacity: 0.62;
      }
      .network::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 28% 36%, rgba(50, 213, 255, 0.4) 0 1px, transparent 2px),
          radial-gradient(circle at 39% 52%, rgba(50, 213, 255, 0.34) 0 1px, transparent 2px),
          radial-gradient(circle at 58% 31%, rgba(50, 213, 255, 0.46) 0 1px, transparent 2px),
          radial-gradient(circle at 71% 56%, rgba(50, 213, 255, 0.36) 0 1px, transparent 2px);
        opacity: 0.65;
      }
      .network-inner {
        position: absolute;
        inset: 0;
        z-index: 1;
        width: 100%;
        max-width: 2048px;
        height: 100%;
        margin: 0 auto;
        left: 50%;
        transform: translateX(-50%);
      }
      .device {
        position: absolute;
        left: 10.5%;
        top: 48%;
        width: 230px;
        transform: translate(-50%, -50%);
        z-index: 2;
        text-align: center;
      }
      .laptop {
        position: relative;
        width: 226px;
        height: 134px;
        margin: 0 auto 10px;
        color: var(--accent);
      }
      .laptop svg {
        display: none;
      }
      .laptop::before {
        content: "";
        position: absolute;
        left: 13px;
        top: 7px;
        width: 198px;
        height: 105px;
        border: 2px solid rgba(40, 200, 245, 0.72);
        border-radius: 6px 6px 2px 2px;
        background:
          linear-gradient(142deg, rgba(64, 177, 239, 0.12), transparent 42%),
          linear-gradient(150deg, transparent 0 45%, rgba(10, 58, 86, 0.54) 46% 63%, transparent 64%),
          rgba(2, 10, 18, 0.86);
        box-shadow: 0 0 22px rgba(49, 207, 255, 0.28), inset 0 0 24px rgba(49, 207, 255, 0.06);
      }
      .laptop::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 9px;
        width: 226px;
        height: 17px;
        border-radius: 50% 50% 7px 7px;
        background: linear-gradient(90deg, transparent, rgba(112, 218, 255, 0.68) 9% 90%, transparent);
        box-shadow: 0 8px 15px rgba(49, 207, 255, 0.18);
      }
      .device h2 {
        margin: -2px 0 5px;
        color: #f3f8fc;
        font-size: 20px;
        line-height: 1.1;
      }
      .device p {
        margin: 0;
        color: #9db2c5;
        font-size: 16px;
        font-weight: 650;
      }
      .network-lines {
        position: absolute;
        inset: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        color: var(--accent);
        overflow: visible;
        pointer-events: none;
      }
      .network-lines path {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        opacity: 0.5;
        filter: url(#pathGlow);
      }
      .network-lines .axis {
        opacity: 0.36;
      }
      .network-lines circle {
        fill: #8ceaff;
        filter: url(#nodeGlow);
      }
      .network-core {
        position: absolute;
        left: 51.5%;
        top: 62%;
        width: 360px;
        height: 360px;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
        text-align: center;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(8, 127, 181, 0.18), rgba(8, 127, 181, 0.05) 49%, transparent 72%);
        box-shadow: 0 0 42px rgba(37, 211, 255, 0.28);
        overflow: hidden;
      }
      .globe-mesh {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        color: #25d3ff;
        opacity: 0.94;
      }
      .network-core .mark {
        margin: 0 auto 11px;
        width: 62px;
        height: 42px;
      }
      .network h2,
      .network p {
        margin: 0;
      }
      .network h2 {
        color: #f3f8fc;
        font-size: 27px;
        line-height: 1.1;
      }
      .network h2 span { color: var(--accent); }
      .network p {
        margin-top: 22px;
        color: #9db2c5;
        font-size: 18px;
        line-height: 1.38;
        font-weight: 650;
      }
      .network-core-content {
        position: relative;
        z-index: 2;
        width: 270px;
        padding: 20px 12px 22px;
        background: radial-gradient(ellipse at center, rgba(3, 18, 30, 0.72), rgba(3, 18, 30, 0.32) 56%, transparent 78%);
      }
      .server-and-panel {
        position: absolute;
        left: 86%;
        top: 50%;
        width: 28%;
        transform: translate(-50%, -50%);
        z-index: 2;
      }
      .server-stack {
        position: absolute;
        left: 30%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: grid;
        gap: 9px;
      }
      .server-stack span {
        width: 80px;
        height: 28px;
        border: 1px solid rgba(91, 211, 255, 0.34);
        border-radius: 6px;
        background: linear-gradient(180deg, rgba(33, 126, 171, 0.26), rgba(5, 24, 39, 0.88));
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.08), 0 0 14px rgba(49, 207, 255, 0.16);
        position: relative;
      }
      .server-stack span::before,
      .server-stack span::after {
        content: "";
        position: absolute;
        top: 10px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 8px var(--accent);
      }
      .server-stack span::before {
        left: 10px;
      }
      .server-stack span::after {
        right: 10px;
        opacity: 0.45;
      }
      .node-list {
        width: 310px;
        height: 225px;
        margin-left: auto;
        border: 1px solid rgba(18, 168, 218, 0.45);
        border-radius: 15px;
        background: rgba(4, 25, 39, 0.9);
        text-align: left;
        box-shadow: 0 0 25px rgba(0, 174, 239, 0.08), inset 0 1px rgba(255, 255, 255, 0.06);
      }
      .node-list div {
        display: flex;
        align-items: center;
        gap: 28px;
        min-height: 74px;
        padding: 0 32px;
        border-bottom: 1px solid rgba(73, 148, 180, 0.22);
        color: #f3f8fc;
        font-size: 19px;
        font-weight: 650;
      }
      .node-list div:last-child { border-bottom: 0; }
      .node-list svg {
        width: 40px;
        height: 40px;
        color: #29c8fa;
        stroke-width: 1.9;
        filter: drop-shadow(0 0 10px rgba(41, 200, 250, 0.42));
      }
      .values {
        position: relative;
        padding: 84px 0 0;
        background:
          linear-gradient(180deg, rgba(2, 9, 16, 0.98), rgba(3, 13, 23, 0.9)),
          url("./assets/homepage-dark-bg.png") center bottom / cover no-repeat;
        background-blend-mode: normal, luminosity;
      }
      .values-inner {
        width: min(1680px, calc(100% - 92px));
        margin: 0 auto;
        text-align: center;
      }
      .values h2 {
        margin: 0;
        font-size: clamp(38px, 3.05vw, 56px);
        line-height: 1.05;
        letter-spacing: -0.025em;
      }
      .values > .values-inner > p {
        margin: 14px auto 36px;
        max-width: 760px;
        color: #b7c7d6;
        font-size: 20px;
        line-height: 1.35;
      }
      .value-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0;
        text-align: left;
      }
      .value {
        display: grid;
        grid-template-columns: 118px 1fr;
        gap: 32px;
        align-items: center;
        min-height: 124px;
        padding: 0 58px;
      }
      .value:not(:last-child) {
        border-right: 1px solid rgba(91, 211, 255, 0.18);
      }
      .value-icon {
        width: 104px;
        height: 104px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        color: var(--accent);
        border: 1px solid rgba(91, 211, 255, 0.13);
        background: radial-gradient(circle, rgba(36, 161, 221, 0.2), rgba(8, 47, 73, 0.2) 58%, rgba(4, 22, 37, 0.42));
        box-shadow: inset 0 0 38px rgba(49, 207, 255, 0.08), 0 0 32px rgba(49, 207, 255, 0.09);
      }
      .value-icon svg {
        width: 46px;
        height: 46px;
        stroke-width: 1.9;
      }
      .value h3 {
        margin: 0 0 12px;
        color: #f3f8ff;
        font-size: 23px;
        line-height: 1.12;
        letter-spacing: -0.01em;
      }
      .value p {
        margin: 0;
        color: #c6d4e1;
        font-size: 18px;
        line-height: 1.35;
      }
      .cta {
        position: relative;
        z-index: 1;
        width: min(980px, 100%);
        min-height: 132px;
        margin: 62px auto 0;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 38px;
        align-items: center;
        text-align: left;
        padding: 28px 38px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface-strong);
        box-shadow: var(--shadow);
      }
      .cta h2 {
        margin: 0 0 8px;
        font-size: 24px;
      }
      .cta p,
      .cta small {
        margin: 0;
        color: var(--muted);
      }
      .cta small {
        display: block;
        margin-top: 10px;
        text-align: center;
        font-size: 11px;
      }
      .mountains {
        height: 135px;
        margin-top: -44px;
        background:
          var(--mountain),
          linear-gradient(180deg, transparent, color-mix(in srgb, var(--accent) 9%, transparent));
        opacity: 0.72;
        clip-path: polygon(0 55%, 7% 44%, 12% 49%, 20% 28%, 27% 46%, 37% 34%, 44% 48%, 52% 30%, 61% 48%, 70% 24%, 78% 46%, 88% 30%, 100% 54%, 100% 100%, 0 100%);
      }
      .site-footer {
        border-top: 1px solid var(--border);
        background: var(--surface-strong);
      }
      .footer-inner {
        width: min(1320px, calc(100% - 72px));
        min-height: 88px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
      }
      .footer-links,
      .social-links {
        display: flex;
        align-items: center;
        gap: 26px;
        color: var(--muted);
        font-size: 13px;
        font-weight: 600;
      }
      .social-links {
        gap: 16px;
        color: var(--accent);
      }
      .social-links svg {
        width: 20px;
        height: 20px;
      }
      .tagline {
        color: var(--soft);
        font-size: 10px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
      }
      @media (max-width: 1120px) {
        .hero-inner {
          grid-template-columns: 1fr;
          gap: 42px;
        }
        .product-shell {
          max-width: 780px;
          width: 100%;
          margin: 0 auto;
        }
        .feature-rail {
          grid-template-columns: repeat(2, 1fr);
          margin-top: 34px;
        }
        .network {
          height: clamp(280px, 25vw, 340px);
        }
        .value-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .value:not(:last-child) {
          border-right: 0;
          padding-right: 0;
        }
      }
      @media (min-width: 1121px) and (max-width: 1540px) {
        .nav,
        .hero-inner,
        .feature-rail {
          width: min(1348px, calc(100% - 92px));
        }
        .hero-inner {
          grid-template-columns: minmax(500px, 0.78fr) minmax(720px, 1.22fr);
          gap: 64px;
        }
        h1 {
          font-size: clamp(56px, 4.9vw, 76px);
        }
        .lead {
          max-width: 560px;
        }
        .product-shell {
          grid-template-columns: 238px 1fr;
          min-height: 454px;
        }
        .app-main {
          padding: 70px 30px 48px;
        }
        .app-main::after {
          display: none;
        }
        .tool-grid {
          gap: 12px;
          margin: 30px 0 40px;
        }
        .tool-card {
          min-height: 132px;
          padding: 22px 12px 16px;
        }
        .feature-rail {
          gap: 18px;
        }
        .rail-card {
          padding: 18px 22px;
        }
      }
      @media (max-width: 760px) {
        .nav {
          width: min(100% - 28px, 1420px);
          height: 64px;
        }
        .links {
          display: none;
        }
        .actions .ghost {
          display: none;
        }
        .hero-inner,
        .feature-rail,
        .network-inner,
        .values-inner,
        .footer-inner {
          width: min(100% - 28px, 1240px);
        }
        .hero {
          min-height: auto;
        }
        .hero-inner {
          padding: 54px 0 76px;
          gap: 44px;
        }
        .product-shell {
          grid-template-columns: 1fr;
        }
        .sidebar {
          display: none;
        }
        .app-main::after {
          display: none;
        }
        .tool-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .prompt {
          grid-template-columns: 22px 1fr 40px;
        }
        .prompt span:nth-last-child(n+2):nth-last-child(-n+5) {
          display: none;
        }
        .feature-rail,
        .network-inner,
        .value-grid,
        .cta {
          grid-template-columns: 1fr;
        }
        .feature-rail {
          margin-top: 30px;
        }
        .network {
          height: 620px;
          margin-top: 48px;
        }
        .network-inner {
          width: 100%;
        }
        .network-lines {
          display: none;
        }
        .device {
          left: 50%;
          top: 16%;
          transform: translate(-50%, -50%) scale(0.72);
        }
        .network-core {
          left: 50%;
          top: 48%;
          width: 290px;
          height: 290px;
        }
        .network-core .mark {
          width: 50px;
          height: 34px;
        }
        .network h2 {
          font-size: 22px;
        }
        .network p {
          font-size: 15px;
          margin-top: 14px;
        }
        .server-and-panel {
          left: 50%;
          top: 84%;
          width: 310px;
          transform: translate(-50%, -50%) scale(0.86);
        }
        .server-stack {
          display: none;
        }
        .values {
          padding-top: 64px;
        }
        .value:not(:last-child) {
          border-right: 0;
          padding-right: 0;
        }
        .footer-inner,
        .footer-links {
          flex-direction: column;
          align-items: flex-start;
          padding: 24px 0;
        }
        .footer-links {
          gap: 14px;
          padding: 0;
        }
      }
      @media (max-width: 480px) {
        .brand {
          font-size: 21px;
        }
        .mark {
          width: 36px;
          height: 27px;
        }
        .theme-toggle {
          display: none;
        }
        .btn {
          padding: 0 17px;
        }
        .hero-buttons .btn {
          width: 100%;
        }
        .notes {
          display: grid;
          gap: 8px;
        }
        .notes span + span::before {
          display: none;
        }
        .tool-card {
          min-height: 126px;
        }
        .rail-card {
          padding: 18px;
        }
        .cta {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <header class="topbar">
      <nav class="nav" aria-label="Primary">
        <a class="brand" href="./" aria-label="MundusX home">${brandMark()}<span>MundusX</span></a>
        <div class="links" aria-label="Sections">
          <a href="./public/docs/">Product</a>
          <a href="./network/">Network</a>
          <a href="./docs/">Developers</a>
          <a href="./public/install/">Pricing</a>
          <a href="./docs/device-identity/">About</a>
        </div>
        <div class="actions">
          <a class="btn ghost" href="./public/docs/">Sign in</a>
          <a class="btn primary" href="./public/install/">Get started</a>
        </div>
      </nav>
    </header>
    <main>
      <section class="hero" aria-labelledby="home-title">
        <div class="hero-inner">
          <div>
            <span class="pill">Decentralized AI Network</span>
            <h1 id="home-title">AI that works across <span>your world.</span></h1>
            <p class="lead">Chat, build, research and run AI workloads across a secure decentralized compute network - with your projects and tools connected.</p>
            <div class="hero-buttons">
              <a class="btn primary" href="https://chat.mundusx.ai/">Start with MundusX</a>
              <a class="btn ghost" href="./network/">Explore the network</a>
            </div>
            <div class="notes"><span>Start free</span><span>Sign in with Google</span><span>Connect your own computer</span></div>
          </div>
          <div class="product-shell" aria-label="Atlas workspace preview">
            <aside class="sidebar">
              <div class="mini-brand">${brandMark("mini-mark")}<span>MundusX <small class="mini-kicker">A better tomorrow</small></span></div>
              <div class="btn primary new-chat">+ New Chat</div>
              <div class="section-label">Workspace</div>
              <div class="side-item">${siteIcon("folder")}Projects</div>
              <div class="side-item">${siteIcon("folder")}Product Ideas</div>
              <div class="side-item">${siteIcon("folder")}AI Research</div>
              <div class="side-item">${siteIcon("folder")}Customer Support</div>
              <div class="side-item">${siteIcon("folder")}Personal</div>
              <div class="section-label">Recent Chats</div>
              <div class="recent">
                <div class="chat-row">${siteIcon("folder")}<b>How to optimize LLM...</b><time>12:20 AM</time></div>
                <div class="chat-row">${siteIcon("folder")}<b>Generate project plan</b><time>10:14 AM</time></div>
                <div class="chat-row">${siteIcon("folder")}<b>Explain RISC-V</b><time>Sep 9</time></div>
                <div class="chat-row">${siteIcon("folder")}<b>Build a pricing model</b><time>Sep 9</time></div>
                <div class="chat-row">${siteIcon("folder")}<b>Summarize this doc</b><time>Sep 8</time></div>
              </div>
            </aside>
            <div class="app-main">
              <div class="toggle"><span>${siteIcon("sun")}</span><span>${siteIcon("moon")}</span></div>
              <div class="assistant-title">
                <h2>Hello, my name is <span>Atlas.</span></h2>
                <p>I can help you chat, write code, analyze data, build solutions and research anything - across the MundusX network.</p>
              </div>
              <div class="tool-grid">
                <div class="tool-card"><span class="tool-icon">${siteIcon("code")}</span><b>Code</b><p>Write, debug and explain code</p></div>
                <div class="tool-card"><span class="tool-icon">${siteIcon("bar-chart")}</span><b>Analyze</b><p>Turn data into insights</p></div>
                <div class="tool-card"><span class="tool-icon">${siteIcon("layers")}</span><b>Build</b><p>Create and plan projects</p></div>
                <div class="tool-card"><span class="tool-icon">${siteIcon("search")}</span><b>Research</b><p>Explore ideas and get deeper answers</p></div>
              </div>
              <div class="prompt"><span>${siteIcon("paperclip")}</span><span>Ask Atlas anything...</span><span>${siteIcon("globe")}</span><span>${siteIcon("sliders")}</span><span>${siteIcon("mic")}</span><span>${siteIcon("spark")}</span><span class="send">${siteIcon("arrow-up")}</span></div>
            </div>
          </div>
        </div>
      </section>
      <section class="feature-rail" aria-label="MundusX features">
        <a class="rail-card" href="./public/docs/"><span class="rail-icon">${siteIcon("message-square")}</span><div><h3>Chat with Atlas</h3><p>Your AI companion for work, ideas and everyday tasks.</p></div><span aria-hidden="true">&gt;</span></a>
        <a class="rail-card" href="./docs/"><span class="rail-icon">${siteIcon("folder")}</span><div><h3>Projects</h3><p>Keep chats, files and work together in one place.</p></div><span aria-hidden="true">&gt;</span></a>
        <a class="rail-card" href="./docs/install/"><span class="rail-icon">${siteIcon("terminal")}</span><div><h3>Harness</h3><p>Run code on your own computer</p></div><span aria-hidden="true">&gt;</span></a>
        <a class="rail-card" href="./network/"><span class="rail-icon">${siteIcon("network")}</span><div><h3>Decentralized Compute</h3><p>Contribute or use distributed compute.</p></div><span aria-hidden="true">&gt;</span></a>
      </section>
      <section class="network" aria-label="Decentralized compute network">
        <div class="network-inner">
          <svg class="network-lines" viewBox="0 0 2048 290" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <filter id="pathGlow" x="-30%" y="-120%" width="160%" height="340%">
                <feGaussianBlur stdDeviation="3.8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="nodeGlow" x="-220%" y="-220%" width="540%" height="540%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path class="axis" d="M260 146 C500 146 666 146 841 146 M1207 146 C1352 146 1474 146 1694 146" />
            <path d="M258 122 C372 78 476 75 563 102 C643 127 688 150 841 146" />
            <path d="M258 156 C371 188 477 184 566 162 C653 141 714 151 841 146" />
            <path d="M1207 146 C1328 148 1398 82 1517 79 C1588 77 1628 94 1694 96" />
            <path d="M1207 146 C1331 148 1394 171 1494 168 C1579 165 1630 156 1694 158" />
            <circle cx="258" cy="122" r="5" /><circle cx="490" cy="86" r="7" /><circle cx="581" cy="126" r="6" /><circle cx="660" cy="145" r="6" /><circle cx="468" cy="176" r="7" />
            <circle cx="1212" cy="146" r="6" /><circle cx="1394" cy="146" r="6" /><circle cx="1481" cy="111" r="6" /><circle cx="1535" cy="86" r="7" /><circle cx="1518" cy="168" r="6" />
          </svg>
          <div class="device"><div class="laptop">${siteIcon("laptop")}</div><h2>Your Device</h2><p>Work from anywhere</p></div>
          <div class="network-core">
            <svg class="globe-mesh" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <filter id="globeGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3.4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <circle cx="180" cy="180" r="172" fill="rgba(2, 13, 22, 0.08)" stroke="rgba(37, 211, 255, 0.62)" stroke-width="2.2" filter="url(#globeGlow)" />
              <ellipse cx="180" cy="180" rx="116" ry="172" fill="none" stroke="rgba(37, 211, 255, 0.25)" stroke-width="1.2" />
              <ellipse cx="180" cy="180" rx="58" ry="172" fill="none" stroke="rgba(37, 211, 255, 0.18)" stroke-width="1" />
              <ellipse cx="180" cy="180" rx="172" ry="62" fill="none" stroke="rgba(37, 211, 255, 0.18)" stroke-width="1" />
              <ellipse cx="180" cy="180" rx="172" ry="118" fill="none" stroke="rgba(37, 211, 255, 0.15)" stroke-width="1" />
              <path d="M52 74 115 32 183 21 251 47 310 101 330 174 305 244 238 317 158 336 80 303 35 230 28 145Z" fill="none" stroke="rgba(37,211,255,.36)" stroke-width="1.4" />
              <path d="M52 74 108 126 28 145 M108 126 183 21 206 104 310 101 M206 104 180 180 330 174 M180 180 80 303 35 230 M180 180 238 317 305 244 M108 126 180 180 206 104 M52 74 206 104 M28 145 180 180 M310 101 330 174 M305 244 180 180 M80 303 238 317" fill="none" stroke="rgba(37,211,255,.31)" stroke-width="1.25" />
              <g fill="#32d5ff" filter="url(#globeGlow)">
                <circle cx="52" cy="74" r="4" /><circle cx="115" cy="32" r="4" /><circle cx="183" cy="21" r="5" /><circle cx="251" cy="47" r="4" /><circle cx="310" cy="101" r="5" /><circle cx="330" cy="174" r="4" /><circle cx="305" cy="244" r="4" /><circle cx="238" cy="317" r="4" /><circle cx="158" cy="336" r="4" /><circle cx="80" cy="303" r="4" /><circle cx="35" cy="230" r="4" /><circle cx="28" cy="145" r="3" /><circle cx="108" cy="126" r="4" /><circle cx="206" cy="104" r="4" /><circle cx="180" cy="180" r="4" />
              </g>
            </svg>
            <div class="network-core-content">${brandMark()}<h2>MundusX <span>Network</span></h2><p>A global decentralized<br />compute network</p></div>
          </div>
          <div class="server-and-panel">
            <div class="server-stack" aria-hidden="true"><span></span><span></span><span></span></div>
            <div class="node-list">
              <div>${siteIcon("cpu")}AI Models</div>
              <div>${siteIcon("database")}Compute Nodes</div>
              <div>${siteIcon("box")}Your Workloads</div>
            </div>
          </div>
        </div>
      </section>
      <section class="values" aria-labelledby="workspace-title">
        <div class="values-inner">
          <h2 id="workspace-title">One workspace. Your AI. Your compute.</h2>
          <p>A more open, more capable and more connected way to work with AI.</p>
          <div class="value-grid">
            <div class="value"><span class="value-icon">${siteIcon("shield")}</span><div><h3>Private by design</h3><p>Your data stays yours. Secure, transparent and under your control.</p></div></div>
            <div class="value"><span class="value-icon">${siteIcon("code")}</span><div><h3>Built for builders</h3><p>From ideas to production. Tools, APIs and compute for real work.</p></div></div>
            <div class="value"><span class="value-icon">${siteIcon("share")}</span><div><h3>Distributed by default</h3><p>A global network of people and compute powering a more open AI future.</p></div></div>
          </div>
          <div class="cta">
            <div>
              <h2>Ready to build with MundusX?</h2>
              <p>Join a growing community of builders, researchers and businesses shaping a more open and decentralized AI future.</p>
            </div>
            <div>
              <a class="btn primary" href="./public/install/">Get started</a>
              <small>Start free. No credit card required.</small>
            </div>
          </div>
        </div>
        <div class="mountains" aria-hidden="true"></div>
      </section>
    </main>
    <footer class="site-footer">
      <div class="footer-inner">
        <a class="brand" href="./" aria-label="MundusX home">${brandMark()}<span>MundusX</span></a>
        <div class="footer-links">
          <a href="./public/docs/">Product</a>
          <a href="./network/">Network</a>
          <a href="./docs/">Developers</a>
          <a href="./public/install/">Pricing</a>
          <a href="./docs/device-identity/">About</a>
          <a href="./docs/release/">Blog</a>
        </div>
        <div class="social-links" aria-label="Social links">
          <a href="./public/docs/" aria-label="GitHub">${siteIcon("github")}</a>
          <a href="./public/docs/" aria-label="Community">${siteIcon("discord")}</a>
          <a href="./public/docs/" aria-label="LinkedIn">${siteIcon("linkedin")}</a>
          <a href="./public/docs/" aria-label="Video">${siteIcon("youtube")}</a>
        </div>
        <span class="tagline">A better tomorrow</span>
      </div>
    </footer>
  </body>
</html>`;
}

function renderNetworkPage() {
  const logo = (className = "mark") =>
    `<img class="${className}" src="../assets/mundusx-logo-official.svg" alt="" aria-hidden="true" />`;

  const statItems = [
    ["globe", "190", "Countries"],
    ["cpu", "12,489", "Active nodes"],
    ["box", "1.2M", "Compute hours/month"],
    ["users", "350K", "Community members"],
  ];

  const activityItems = [
    ["cyan", "Developer in Tokyo started a training job", "2 minutes ago"],
    ["cyan", "Researcher in Berlin joined the network", "4 minutes ago"],
    ["gold", "Compute node in New York came online", "6 minutes ago"],
    ["rose", "User in Manila ran an inference job", "8 minutes ago"],
  ];

  const networkLocations = [
    { id: "sf", city: "San Francisco", country: "United States", type: "Developer", active: "Active builders", x: 18, y: 45 },
    { id: "ny", city: "New York", country: "United States", type: "Business", active: "Compute demand", x: 30, y: 43 },
    { id: "toronto", city: "Toronto", country: "Canada", type: "Community", active: "Community users", x: 29, y: 37 },
    { id: "sao-paulo", city: "Sao Paulo", country: "Brazil", type: "Research", active: "Research activity", x: 36, y: 69 },
    { id: "london", city: "London", country: "United Kingdom", type: "Developer", active: "Developer activity", x: 48, y: 38 },
    { id: "berlin", city: "Berlin", country: "Germany", type: "Research", active: "Research activity", x: 52, y: 39 },
    { id: "dubai", city: "Dubai", country: "United Arab Emirates", type: "Compute node", active: "Compute providers", x: 61, y: 54 },
    { id: "mumbai", city: "Mumbai", country: "India", type: "Compute node", active: "Compute providers", x: 67, y: 58 },
    { id: "singapore", city: "Singapore", country: "Singapore", type: "Compute node", active: "Regional activity", x: 74, y: 64 },
    { id: "tokyo", city: "Tokyo", country: "Japan", type: "Developer", active: "Developer activity", x: 82, y: 45 },
    { id: "sydney", city: "Sydney", country: "Australia", type: "Community", active: "Community users", x: 84, y: 77 },
    { id: "auckland", city: "Auckland", country: "New Zealand", type: "Community", active: "Users online", x: 91, y: 82, selected: true },
  ];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MundusX Network</title>
    <style>
      :root {
        color-scheme: dark;
        --page: #020911;
        --panel: rgba(5, 25, 40, 0.82);
        --panel-strong: rgba(4, 20, 34, 0.94);
        --line: rgba(45, 192, 248, 0.28);
        --line-bright: rgba(58, 210, 255, 0.54);
        --text: #f2f7ff;
        --muted: #aec1d1;
        --soft: #7894a8;
        --accent: #20caff;
        --accent-2: #70e5ff;
        --green: #2dff9c;
        --gold: #ffd95c;
        --rose: #ff5e72;
        --shadow: 0 26px 72px rgba(0, 0, 0, 0.42);
      }
      * { box-sizing: border-box; }
      html { background: var(--page); scroll-behavior: smooth; }
      body {
        margin: 0;
        min-height: 100vh;
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0;
        background:
          radial-gradient(circle at 64% 11%, rgba(0, 122, 255, 0.28), transparent 25rem),
          radial-gradient(circle at 24% 41%, rgba(16, 196, 255, 0.12), transparent 34rem),
          linear-gradient(180deg, #03121d 0%, #020912 46%, #03101a 100%);
        overflow-x: hidden;
      }
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 22% 18%, rgba(42, 207, 255, 0.7) 0 1px, transparent 2px),
          radial-gradient(circle at 74% 28%, rgba(42, 207, 255, 0.42) 0 1px, transparent 2px),
          linear-gradient(90deg, rgba(53, 205, 255, 0.04) 1px, transparent 1px),
          linear-gradient(180deg, rgba(53, 205, 255, 0.035) 1px, transparent 1px);
        background-size: 140px 120px, 190px 150px, 76px 76px, 76px 76px;
        mask-image: linear-gradient(180deg, transparent, #000 12%, #000 86%, transparent);
        opacity: 0.7;
      }
      a { color: inherit; text-decoration: none; }
      svg { display: block; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; }
      .topbar {
        position: sticky;
        top: 0;
        z-index: 50;
        border-bottom: 1px solid rgba(92, 216, 255, 0.18);
        background: rgba(2, 12, 22, 0.86);
        backdrop-filter: blur(20px);
      }
      .nav {
        width: min(1740px, calc(100% - 104px));
        height: 65px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 34px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 13px;
        font-size: 19px;
        font-weight: 800;
      }
      .mark { width: 45px; height: 30px; object-fit: contain; filter: drop-shadow(0 0 16px rgba(32, 202, 255, 0.48)); }
      .brand small {
        display: block;
        margin-top: 2px;
        color: #47cbff;
        font-size: 8px;
        font-weight: 800;
        text-transform: uppercase;
      }
      .links {
        display: flex;
        align-items: center;
        gap: clamp(25px, 3vw, 48px);
        color: #e6f0fb;
        font-size: 13px;
        font-weight: 650;
      }
      .links a { position: relative; padding: 25px 0 22px; }
      .links a[aria-current="page"]::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 9px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        transform: translateX(-50%);
        background: var(--accent);
        box-shadow: 0 0 16px var(--accent);
      }
      .actions { display: flex; align-items: center; gap: 13px; }
      .btn {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border: 1px solid var(--line-bright);
        border-radius: 999px;
        padding: 0 25px;
        font-size: 13px;
        font-weight: 800;
        white-space: nowrap;
      }
      .btn.primary {
        color: #02101c;
        border-color: transparent;
        background: linear-gradient(135deg, #49dcff, #0caeff);
        box-shadow: 0 0 28px rgba(32, 202, 255, 0.48), inset 0 1px rgba(255, 255, 255, 0.6);
      }
      .btn.ghost {
        color: #f4f9ff;
        background: rgba(2, 13, 24, 0.72);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.14);
      }
      .section {
        position: relative;
        border-bottom: 1px solid rgba(68, 191, 238, 0.18);
      }
      .wrap {
        width: min(1700px, calc(100% - 108px));
        margin: 0 auto;
      }
      .eyebrow {
        display: block;
        margin-bottom: 18px;
        color: var(--accent);
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .hero {
        min-height: 680px;
        overflow: hidden;
        border-bottom: 0;
        background:
          radial-gradient(circle at 67% 49%, rgba(17, 139, 235, 0.24), transparent 30rem),
          linear-gradient(90deg, rgba(2, 9, 17, 0.98) 0%, rgba(2, 11, 20, 0.44) 55%, rgba(2, 9, 17, 0.94) 100%);
      }
      .hero .wrap {
        min-height: 680px;
        display: grid;
        grid-template-columns: minmax(560px, 0.72fr) minmax(620px, 1.28fr);
        gap: 18px;
        align-items: center;
        padding: 52px 0 56px;
      }
      .hero .wrap > div:first-child {
        position: relative;
        z-index: 3;
      }
      h1 {
        max-width: 590px;
        margin: 0 0 22px;
        font-size: clamp(52px, 4.45vw, 64px);
        line-height: 1.02;
      }
      h1 span { color: #52d8ff; }
      .lead {
        max-width: 520px;
        margin: 0;
        color: #d9e7f2;
        font-size: 18px;
        line-height: 1.48;
      }
      .hero-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        margin: 36px 0 64px;
      }
      .mini-features {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
        max-width: 590px;
      }
      .mini-feature {
        display: grid;
        grid-template-columns: 40px 1fr;
        gap: 10px;
        align-items: center;
        color: #dbeaf6;
        font-size: 10px;
        line-height: 1.25;
      }
      .mini-feature b { display: block; color: #f4f9ff; font-size: 11px; }
      .round-icon {
        width: 41px;
        height: 41px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(50, 210, 255, 0.38);
        border-radius: 50%;
        color: var(--accent);
        background: rgba(13, 90, 128, 0.18);
        box-shadow: 0 0 18px rgba(32, 202, 255, 0.18);
      }
      .round-icon svg { width: 22px; height: 22px; }
      .globe-stage {
        position: relative;
        min-height: 610px;
        z-index: 1;
      }
      .planet {
        position: absolute;
        left: 29%;
        top: 50%;
        width: min(1060px, 76vw);
        aspect-ratio: 1.75;
        transform: translate(-50%, -50%);
        border-radius: 0;
        background: url("../assets/network-hero-globe.png") center / contain no-repeat;
        filter: drop-shadow(0 0 35px rgba(32, 202, 255, 0.26));
        opacity: 0.96;
        mix-blend-mode: screen;
        -webkit-mask-image: radial-gradient(ellipse at 70% 50%, #000 0 47%, rgba(0, 0, 0, 0.84) 56%, transparent 76%);
        mask-image: radial-gradient(ellipse at 70% 50%, #000 0 47%, rgba(0, 0, 0, 0.84) 56%, transparent 76%);
      }
      .planet::before,
      .planet::after {
        display: none;
      }
      .planet-lines {
        position: absolute;
        inset: -5%;
        width: 110%;
        height: 110%;
        color: #26cfff;
        opacity: 0.72;
        display: none;
      }
      .planet-lines path { fill: none; stroke: currentColor; stroke-width: 1.15; opacity: 0.55; }
      .planet-lines circle { fill: #45dcff; filter: drop-shadow(0 0 8px #20caff); }
      .stats-card {
        position: absolute;
        right: 0;
        top: 73px;
        width: 224px;
        padding: 22px 25px;
        border: 1px solid var(--line-bright);
        border-radius: 8px;
        background: rgba(3, 20, 35, 0.86);
        box-shadow: var(--shadow), inset 0 1px rgba(255, 255, 255, 0.08);
      }
      .online {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #e9f8ff;
        font-size: 13px;
        font-weight: 700;
      }
      .online::before {
        content: "";
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--green);
        box-shadow: 0 0 14px var(--green);
      }
      .stats-card strong {
        display: block;
        margin-top: 16px;
        font-size: 31px;
        line-height: 1;
      }
      .stats-card dl { margin: 18px 0 0; }
      .stats-card div {
        padding: 13px 0 0;
        border-top: 1px solid rgba(122, 214, 255, 0.17);
      }
      .stats-card dt { color: var(--muted); font-size: 11px; }
      .stats-card dd { margin: 0 0 11px; color: #f0f7ff; font-size: 17px; font-weight: 800; }
      .callout {
        position: absolute;
        right: 18%;
        bottom: 160px;
        width: 244px;
        padding: 13px 17px;
        border: 1px solid rgba(78, 210, 255, 0.36);
        border-radius: 8px;
        color: #d8eaf6;
        background: rgba(4, 26, 43, 0.8);
        font-size: 13px;
        line-height: 1.35;
      }
      .vertical-tag {
        position: absolute;
        right: 8px;
        bottom: 55px;
        color: #5bdcff;
        font-size: 10px;
        font-weight: 900;
        line-height: 1.7;
        text-transform: uppercase;
      }
      .metric-rail {
        position: relative;
        background: rgba(2, 12, 22, 0.78);
        border-bottom: 0;
      }
      .metric-rail::before,
      .metric-rail::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        pointer-events: none;
        background: linear-gradient(90deg, transparent, rgba(68, 191, 238, 0.045) 18%, rgba(68, 191, 238, 0.075) 50%, rgba(68, 191, 238, 0.045) 82%, transparent);
      }
      .metric-rail::before { top: 0; }
      .metric-rail::after { bottom: 0; }
      .metric-grid {
        width: min(1700px, calc(100% - 108px));
        min-height: 116px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }
      .metric {
        position: relative;
        display: grid;
        grid-template-columns: 58px 1fr;
        gap: 22px;
        align-items: center;
        padding: 25px 38px;
      }
      .metric:not(:last-child)::after {
        content: "";
        position: absolute;
        top: 22%;
        right: 0;
        width: 1px;
        height: 56%;
        background: linear-gradient(180deg, transparent, rgba(73, 179, 222, 0.18) 50%, transparent);
      }
      .metric b { display: block; font-size: 26px; line-height: 1; }
      .metric span:last-child { color: #bcd0dd; font-size: 13px; }
      .community .wrap {
        min-height: 700px;
        display: grid;
        grid-template-columns: minmax(360px, 0.36fr) minmax(700px, 0.64fr);
        gap: clamp(24px, 3vw, 56px);
        align-items: center;
        padding: 105px 0 112px;
      }
      .community {
        background:
          radial-gradient(ellipse at 70% 50%, rgba(29, 174, 235, 0.1), transparent 34rem),
          linear-gradient(180deg, rgba(2, 13, 22, 0.98), rgba(3, 21, 34, 0.9));
        border-bottom-color: rgba(52, 142, 179, 0.1);
      }
      .section h2 {
        margin: 0;
        font-size: clamp(34px, 3.2vw, 52px);
        line-height: 1.08;
      }
      .community p,
      .centered-copy p,
      .activity-copy p,
      .feature-card p {
        color: #bfd0dd;
        font-size: 17px;
        line-height: 1.42;
      }
      .community p {
        max-width: 470px;
        margin: 24px 0 32px;
        color: #a4b6c6;
        font-size: 18px;
        line-height: 1.62;
      }
      .community .btn.primary {
        width: 220px;
        min-height: 56px;
        padding: 0 22px;
        color: #02101c;
        font-size: 15px;
        font-weight: 700;
        background: linear-gradient(90deg, #27d7f6 0%, #18bceb 45%, #0a96dd 100%);
        box-shadow: 0 0 24px rgba(31, 198, 243, 0.2);
        transition: transform 160ms ease, box-shadow 160ms ease;
      }
      .community .btn.primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 30px rgba(31, 198, 243, 0.28);
      }
      .community .eyebrow {
        color: #29c9f6;
        font-size: 12px;
        font-weight: 800;
      }
      #community-title {
        max-width: 440px;
        font-size: clamp(42px, 3.55vw, 56px);
        font-weight: 650;
        line-height: 1.07;
      }
      .map-wrap {
        position: relative;
        min-height: 480px;
        margin-right: min(-5vw, -48px);
      }
      .map-wrap::before {
        content: "";
        position: absolute;
        inset: 8% 2% 0;
        background:
          radial-gradient(circle at 78% 74%, rgba(38, 214, 255, 0.13), transparent 11rem),
          radial-gradient(circle at 46% 44%, rgba(38, 214, 255, 0.11), transparent 18rem);
        pointer-events: none;
      }
      .world-map {
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(950px, 116%);
        height: 480px;
        display: block;
        transform: translate(-50%, -50%);
        object-fit: contain;
        filter: brightness(1.14) contrast(1.08);
        mix-blend-mode: lighten;
        opacity: 0.62;
        -webkit-mask-image: radial-gradient(ellipse at center, #000 0 38%, rgba(0, 0, 0, 0.5) 52%, rgba(0, 0, 0, 0.15) 66%, transparent 84%);
        mask-image: radial-gradient(ellipse at center, #000 0 38%, rgba(0, 0, 0, 0.5) 52%, rgba(0, 0, 0, 0.15) 66%, transparent 84%);
      }
      .map-arcs {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        color: #28d5ff;
        pointer-events: none;
      }
      .map-arcs path {
        fill: none;
        stroke: currentColor;
        stroke-width: 1;
        opacity: 0.18;
      }
      .map-arcs circle {
        fill: currentColor;
        filter: drop-shadow(0 0 7px currentColor);
        opacity: 0;
        animation: arcTravel 9s ease-in-out infinite;
      }
      .map-arcs .arc-dot-one {
        offset-path: path("M82 382 C168 268 302 235 428 254 C552 272 625 200 742 145");
      }
      .map-arcs .arc-dot-two {
        offset-path: path("M183 216 C250 177 330 170 445 193");
      }
      .map-arcs circle:nth-of-type(2) { animation-delay: 3.5s; }
      .map-point {
        position: absolute;
        left: var(--x);
        top: var(--y);
        width: 24px;
        height: 24px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        color: #3fe27a;
        background: transparent;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }
      .map-point::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: currentColor;
        box-shadow: 0 0 18px currentColor, 0 0 4px #fff;
        opacity: 0.95;
        animation: pointPulse 4.6s ease-in-out infinite;
      }
      .map-point::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 26px;
        height: 26px;
        border: 1px solid rgba(63, 226, 122, 0.34);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        animation: ringPulse 5.4s ease-out infinite;
      }
      .map-point.is-selected::before {
        width: 14px;
        height: 14px;
        opacity: 1;
      }
      .map-point.is-selected::after {
        width: 48px;
        height: 48px;
        opacity: 0.42;
      }
      .map-pulse {
        position: absolute;
        left: 91%;
        top: 82%;
        width: 92px;
        height: 92px;
        border: 1px solid rgba(47, 211, 255, 0.44);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 30px rgba(32, 202, 255, 0.28), inset 0 0 24px rgba(32, 202, 255, 0.12);
        pointer-events: none;
      }
      .map-pulse::before,
      .map-pulse::after {
        content: "";
        position: absolute;
        inset: 16px;
        border: 1px solid rgba(47, 211, 255, 0.56);
        border-radius: 50%;
      }
      .map-pulse::after {
        inset: 32px;
        background: var(--accent);
        box-shadow: 0 0 18px var(--accent);
      }
      .map-label {
        position: absolute;
        left: 82%;
        top: 66%;
        width: 178px;
        padding: 13px 14px;
        border: 1px solid rgba(32, 194, 236, 0.28);
        border-radius: 11px;
        background: rgba(5, 28, 42, 0.92);
        color: #a4b6c6;
        font-size: 13px;
        line-height: 1.35;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      }
      .map-label::after {
        content: "";
        position: absolute;
        right: 18px;
        bottom: -35px;
        width: 1px;
        height: 35px;
        background: linear-gradient(180deg, rgba(40, 213, 255, 0.36), transparent);
        transform: rotate(34deg);
        transform-origin: top;
      }
      .map-label b {
        display: block;
        color: #f4f8fb;
        font-weight: 650;
      }
      .point-tip {
        position: absolute;
        left: 50%;
        bottom: 30px;
        width: 172px;
        padding: 11px 12px;
        border: 1px solid rgba(32, 194, 236, 0.24);
        border-radius: 10px;
        background: rgba(5, 28, 42, 0.94);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        color: #a4b6c6;
        font-size: 12px;
        line-height: 1.32;
        text-align: left;
        opacity: 0;
        transform: translate(-50%, 6px);
        pointer-events: none;
        transition: opacity 160ms ease, transform 160ms ease;
      }
      .point-tip b {
        display: block;
        color: #f4f8fb;
        font-size: 13px;
      }
      .map-point:hover .point-tip,
      .map-point:focus-visible .point-tip {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      @keyframes pointPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.72; }
        50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
      }
      @keyframes ringPulse {
        0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.34; }
        100% { transform: translate(-50%, -50%) scale(1.42); opacity: 0; }
      }
      @keyframes arcTravel {
        0%, 18% { opacity: 0; offset-distance: 0%; }
        25%, 60% { opacity: 0.85; }
        74%, 100% { opacity: 0; offset-distance: 100%; }
      }
      .how {
        padding: 58px 0 0;
      }
      .centered-copy {
        text-align: center;
      }
      .centered-copy p {
        max-width: 720px;
        margin: 16px auto 0;
      }
      .flow {
        position: relative;
        height: 365px;
        margin-top: 28px;
      }
      .flow-lines {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        color: var(--accent);
      }
      .flow-lines path { fill: none; stroke: currentColor; stroke-width: 2; opacity: 0.68; filter: drop-shadow(0 0 8px var(--accent)); }
      .flow-lines circle { fill: #8eeaff; filter: drop-shadow(0 0 8px var(--accent)); }
      .laptop-art {
        position: absolute;
        left: 8%;
        top: 50%;
        width: 230px;
        transform: translateY(-50%);
        text-align: center;
      }
      .laptop-screen {
        width: 210px;
        height: 118px;
        margin: 0 auto 9px;
        border: 2px solid rgba(73, 211, 255, 0.58);
        border-radius: 7px 7px 2px 2px;
        background:
          linear-gradient(145deg, rgba(77, 184, 247, 0.15), transparent 45%),
          linear-gradient(135deg, transparent 42%, rgba(60, 162, 232, 0.19) 43% 58%, transparent 59%),
          rgba(3, 14, 25, 0.9);
        box-shadow: 0 0 22px rgba(32, 202, 255, 0.25);
      }
      .laptop-screen::after {
        content: "";
        display: block;
        width: 244px;
        height: 18px;
        margin: 112px 0 0 -18px;
        border-radius: 50% 50% 7px 7px;
        background: linear-gradient(90deg, transparent, rgba(115, 224, 255, 0.74) 11% 88%, transparent);
      }
      .laptop-art b,
      .core b { display: block; font-size: 18px; }
      .laptop-art span,
      .core span { color: #a8bdcc; font-size: 13px; }
      .core {
        position: absolute;
        left: 50%;
        top: 53%;
        width: 295px;
        height: 295px;
        transform: translate(-50%, -50%);
        display: grid;
        place-items: center;
        border-radius: 50%;
        text-align: center;
        background: radial-gradient(circle, rgba(9, 104, 152, 0.28), rgba(2, 14, 25, 0.38) 62%, rgba(38, 202, 255, 0.18) 64%, transparent 68%);
        box-shadow: 0 0 42px rgba(32, 202, 255, 0.36);
      }
      .core svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        color: var(--accent);
        opacity: 0.78;
      }
      .core-content { position: relative; z-index: 1; }
      .core-content .mark { width: 62px; height: 42px; margin: 0 auto 9px; }
      .resource-panel {
        position: absolute;
        right: 0;
        top: 50%;
        width: 310px;
        transform: translateY(-50%);
        border: 1px solid var(--line-bright);
        border-radius: 8px;
        background: rgba(4, 25, 40, 0.9);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.07);
      }
      .resource-panel div {
        display: grid;
        grid-template-columns: 42px 1fr;
        gap: 17px;
        align-items: center;
        min-height: 72px;
        padding: 0 28px;
        border-bottom: 1px solid rgba(99, 202, 242, 0.18);
        font-size: 16px;
        font-weight: 750;
      }
      .resource-panel div:last-child { border-bottom: 0; }
      .resource-panel svg { width: 34px; height: 34px; color: var(--accent); }
      .activity .wrap {
        min-height: 390px;
        display: grid;
        grid-template-columns: minmax(360px, 0.95fr) minmax(520px, 1.05fr);
        gap: 76px;
        align-items: center;
        padding: 62px 0;
      }
      .activity-list {
        border: 1px solid var(--line-bright);
        border-radius: 8px;
        background: rgba(4, 23, 38, 0.86);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.07);
        padding: 21px 28px;
      }
      .activity-title {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 17px;
        font-size: 16px;
        font-weight: 800;
      }
      .activity-title::before {
        content: "";
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 3px solid rgba(45, 255, 156, 0.4);
        background: var(--green);
        box-shadow: 0 0 16px var(--green);
      }
      .activity-row {
        display: grid;
        grid-template-columns: 16px 1fr auto;
        gap: 12px;
        align-items: center;
        min-height: 39px;
        color: #d7e8f5;
        font-size: 13px;
      }
      .dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--accent);
        box-shadow: 0 0 12px currentColor;
      }
      .dot.gold { background: var(--gold); color: var(--gold); }
      .dot.rose { background: var(--rose); color: var(--rose); }
      .activity-row time { color: #7f98aa; }
      .features {
        padding: 57px 0 48px;
        text-align: center;
      }
      .features h2 {
        margin: 0 0 36px;
        font-size: clamp(31px, 2.6vw, 43px);
      }
      .feature-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 34px;
        text-align: left;
      }
      .feature-card {
        min-height: 206px;
        padding: 34px 32px;
        border: 1px solid rgba(74, 205, 255, 0.29);
        border-radius: 8px;
        background: linear-gradient(180deg, rgba(8, 39, 61, 0.78), rgba(4, 21, 35, 0.84));
      }
      .feature-card .round-icon {
        width: 62px;
        height: 62px;
        margin-bottom: 24px;
        background: rgba(26, 140, 199, 0.17);
      }
      .feature-card h3 {
        margin: 0 0 12px;
        font-size: 19px;
      }
      .feature-card p {
        margin: 0;
        font-size: 14px;
      }
      .cta-band {
        padding: 0 0 36px;
      }
      .cta-card {
        position: relative;
        min-height: 282px;
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 30px;
        align-items: center;
        padding: 52px 53px;
        border: 1px solid var(--line-bright);
        border-radius: 8px;
        overflow: hidden;
        background:
          linear-gradient(90deg, rgba(3, 13, 23, 0.86) 0%, rgba(3, 18, 31, 0.4) 58%, rgba(2, 10, 18, 0.9) 100%),
          url("../assets/network-cta-mountains.png") center 58% / cover no-repeat;
        box-shadow: var(--shadow);
      }
      .cta-card::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(34, 170, 246, 0.08), rgba(1, 8, 15, 0.35));
        pointer-events: none;
      }
      .cta-card > * { position: relative; z-index: 1; }
      .cta-card h2 {
        max-width: 690px;
        margin: 0 0 30px;
        font-size: clamp(34px, 3vw, 46px);
        line-height: 1.12;
      }
      .cta-actions { display: flex; gap: 18px; flex-wrap: wrap; }
      .cta-lines {
        justify-self: end;
        color: #e2f3ff;
        font-size: 17px;
        line-height: 1.55;
      }
      .site-footer {
        background: rgba(3, 14, 24, 0.94);
        border-top: 1px solid rgba(68, 191, 238, 0.18);
      }
      .footer-main {
        width: min(1700px, calc(100% - 108px));
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.6fr repeat(4, 1fr) 1.3fr;
        gap: 52px;
        padding: 38px 0 35px;
      }
      .footer-col h3 {
        margin: 0 0 12px;
        color: #f0f7ff;
        font-size: 13px;
      }
      .footer-col a {
        display: block;
        margin-top: 9px;
        color: #9fb4c6;
        font-size: 13px;
      }
      .social {
        display: flex;
        justify-content: flex-end;
        gap: 24px;
        color: #c4d4e1;
      }
      .social svg { width: 19px; height: 19px; }
      .footer-bottom {
        width: min(1700px, calc(100% - 108px));
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        gap: 28px;
        padding: 24px 0 31px;
        border-top: 1px solid rgba(98, 180, 212, 0.17);
        color: #7f95a7;
        font-size: 12px;
      }
      .legal { display: flex; gap: 42px; }
      @media (max-width: 1180px) {
        .hero .wrap,
        .community .wrap,
        .activity .wrap {
          grid-template-columns: 1fr;
        }
        .globe-stage { min-height: 540px; }
        .planet { left: 50%; width: min(650px, 92vw); }
        .stats-card { right: 6%; }
        .metric-grid,
        .feature-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .flow { height: 650px; }
        .laptop-art { left: 50%; top: 12%; transform: translateX(-50%); }
        .core { top: 48%; }
        .resource-panel { right: 50%; top: 84%; transform: translate(50%, -50%); }
        .flow-lines { display: none; }
        .footer-main { grid-template-columns: repeat(3, 1fr); }
        .social { justify-content: flex-start; }
      }
      @media (max-width: 760px) {
        .nav,
        .wrap,
        .metric-grid,
        .footer-main,
        .footer-bottom {
          width: min(100% - 30px, 680px);
        }
        .links { display: none; }
        .actions .ghost { display: none; }
        .hero .wrap { padding-top: 45px; }
        h1 { font-size: 48px; }
        .hero-buttons { margin-bottom: 38px; }
        .mini-features,
        .metric-grid,
        .feature-grid,
        .cta-card,
        .footer-main {
          grid-template-columns: 1fr;
        }
        .globe-stage { min-height: 480px; }
        .planet { width: 430px; }
        .stats-card {
          position: relative;
          top: auto;
          right: auto;
          width: 100%;
          margin-top: 370px;
        }
        .callout,
        .vertical-tag { display: none; }
        .metric { border-right: 0; border-bottom: 0; padding-left: 0; padding-right: 0; }
        .metric:not(:last-child)::after {
          top: auto;
          right: auto;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(73, 179, 222, 0.16) 50%, transparent);
        }
        .community .wrap,
        .activity .wrap { padding: 52px 0; gap: 34px; }
        .map-wrap { min-height: 360px; overflow: visible; }
        .world-map { width: 760px; height: 360px; }
        .how { padding-top: 48px; }
        .resource-panel { width: 100%; }
        .cta-card { padding: 36px 24px; }
        .cta-lines { justify-self: start; }
        .footer-bottom { flex-direction: column; }
      }
    </style>
  </head>
  <body>
    <header class="topbar">
      <nav class="nav" aria-label="Primary">
        <a class="brand" href="../" aria-label="MundusX home">${logo()}<span>MundusX</span></a>
        <div class="links" aria-label="Sections">
          <a href="../public/docs/">Product</a>
          <a href="./" aria-current="page">Network</a>
          <a href="../docs/">Developers</a>
          <a href="../public/install/">Pricing</a>
          <a href="../docs/device-identity/">About</a>
        </div>
        <div class="actions">
          <a class="btn ghost" href="../public/docs/">Sign in</a>
          <a class="btn primary" href="../public/install/">Get started <span aria-hidden="true">&rarr;</span></a>
        </div>
      </nav>
    </header>
    <main>
      <section class="section hero" aria-labelledby="network-title">
        <div class="wrap">
          <div>
            <span class="eyebrow">MundusX Network</span>
            <h1 id="network-title">A global network for a <span>brighter tomorrow.</span></h1>
            <p class="lead">A decentralized network of people, compute and ideas - powering a more open, accessible and intelligent future.</p>
            <div class="hero-buttons">
              <a class="btn primary" href="../public/install/">Join the network <span aria-hidden="true">&rarr;</span></a>
              <a class="btn ghost" href="#global-map">Explore the map</a>
            </div>
            <div class="mini-features">
              <div class="mini-feature"><span class="round-icon">${siteIcon("users")}</span><span><b>Real people</b>around the world</span></div>
              <div class="mini-feature"><span class="round-icon">${siteIcon("cpu")}</span><span><b>Decentralized</b>compute resources</span></div>
              <div class="mini-feature"><span class="round-icon">${siteIcon("box")}</span><span><b>A more open</b>AI ecosystem</span></div>
            </div>
          </div>
          <div class="globe-stage" aria-hidden="true">
            <div class="planet">
              <svg class="planet-lines" viewBox="0 0 720 720">
                <path d="M77 360C167 184 301 95 479 78C602 111 676 205 690 360C661 517 557 621 388 681C226 641 123 534 77 360Z" />
                <path d="M91 255C253 342 401 352 676 219" />
                <path d="M100 456C284 350 480 371 674 503" />
                <path d="M361 48C254 196 224 368 307 670" />
                <path d="M507 85C389 219 341 422 445 646" />
                <path d="M82 360C229 292 382 282 680 357" />
                <circle cx="126" cy="312" r="5" /><circle cx="209" cy="234" r="4" /><circle cx="302" cy="292" r="6" /><circle cx="372" cy="179" r="5" /><circle cx="466" cy="242" r="6" /><circle cx="563" cy="334" r="5" /><circle cx="612" cy="448" r="7" /><circle cx="392" cy="532" r="5" /><circle cx="250" cy="471" r="4" />
              </svg>
            </div>
            <aside class="stats-card">
              <span class="online">Live Network</span>
              <strong>12,489</strong>
              <dl>
                <div><dd>190</dd><dt>countries</dt></div>
                <div><dd>1.2M</dd><dt>compute hours/month</dt></div>
                <div><dd>99.9%</dd><dt>network availability</dt></div>
              </dl>
            </aside>
            <div class="callout">A developer in Singapore is running a model</div>
            <div class="vertical-tag">Real people.<br />Real compute.<br />A brighter tomorrow.</div>
          </div>
        </div>
      </section>
      <section class="section metric-rail" aria-label="Network statistics">
        <div class="metric-grid">
          ${statItems
            .map(
              ([icon, value, label]) =>
                `<div class="metric"><span class="round-icon">${siteIcon(icon)}</span><span><b>${value}</b><span>${label}</span></span></div>`,
            )
            .join("")}
        </div>
      </section>
      <section class="section community" id="global-map" aria-labelledby="community-title">
        <div class="wrap">
          <div>
            <span class="eyebrow">A truly global community</span>
            <h2 id="community-title">People power<br />intelligence.</h2>
            <p>From developers and researchers to businesses and everyday users, MundusX connects a global community contributing compute, knowledge and real-world impact.</p>
            <a class="btn primary" href="#activity">Explore the global map <span aria-hidden="true">&rarr;</span></a>
          </div>
          <div class="map-wrap" role="group" aria-label="Global MundusX network map showing active community and compute locations.">
            <img class="world-map" src="../assets/network-world-map.png" alt="" aria-hidden="true" />
            <svg class="map-arcs" viewBox="0 0 900 480" aria-hidden="true">
              <path d="M82 382 C168 268 302 235 428 254 C552 272 625 200 742 145" />
              <path d="M183 216 C250 177 330 170 445 193" />
              <path d="M483 180 C510 162 537 164 566 187" />
              <path d="M728 307 C758 342 798 372 842 394" />
              <circle class="arc-dot-one" cx="0" cy="0" r="3" />
              <circle class="arc-dot-two" cx="0" cy="0" r="3" />
            </svg>
            ${networkLocations
              .map(
                (location) =>
                  `<button class="map-point${location.selected ? " is-selected" : ""}" style="--x: ${location.x}%; --y: ${location.y}%;" type="button" aria-label="${location.city}, ${location.country}. ${location.type}. ${location.active}."><span class="point-tip"><b>${location.city}, ${location.country}</b>${location.type}<br />${location.active}</span></button>`,
              )
              .join("")}
            <div class="map-label"><b>Users online</b>in New Zealand</div>
            <div class="map-pulse"></div>
          </div>
        </div>
      </section>
      <section class="section how" aria-labelledby="how-title">
        <div class="wrap">
          <div class="centered-copy">
            <span class="eyebrow">How it works</span>
            <h2 id="how-title">A more open, connected way to build.</h2>
            <p>MundusX connects people, devices and compute resources across the world, making AI more accessible, resilient and impactful.</p>
          </div>
          <div class="flow" aria-label="How MundusX connects devices, the network, and workloads">
            <svg class="flow-lines" viewBox="0 0 1500 360" preserveAspectRatio="none" aria-hidden="true">
              <path d="M195 176C325 79 444 84 563 176C646 239 708 185 758 176" />
              <path d="M742 176C840 178 928 178 1018 176C1120 174 1197 79 1310 104" />
              <circle cx="340" cy="95" r="6" /><circle cx="424" cy="142" r="5" /><circle cx="515" cy="176" r="5" /><circle cx="1212" cy="101" r="5" /><circle cx="1274" cy="128" r="5" />
            </svg>
            <div class="laptop-art"><div class="laptop-screen"></div><b>Your Device</b><span>Work from anywhere</span></div>
            <div class="core">
              ${networkCoreSvg()}
              <div class="core-content">${logo()}<b>MundusX Network</b><span>A decentralized global<br />compute network</span></div>
            </div>
            <div class="resource-panel">
              <div>${siteIcon("cpu")}AI Models</div>
              <div>${siteIcon("database")}Compute Nodes</div>
              <div>${siteIcon("box")}Your Workloads</div>
            </div>
          </div>
        </div>
      </section>
      <section class="section activity" id="activity" aria-labelledby="activity-title">
        <div class="wrap">
          <div class="activity-copy">
            <span class="eyebrow">Real-time activity</span>
            <h2 id="activity-title">A living, global network.</h2>
            <p>See the network in action. Every dot represents a real user or compute node contributing to a more open AI future.</p>
          </div>
          <div class="activity-list">
            <div class="activity-title">Live activity</div>
            ${activityItems
              .map(
                ([tone, text, time]) =>
                  `<div class="activity-row"><span class="dot ${tone}"></span><span>${text}</span><time>${time}</time></div>`,
              )
              .join("")}
          </div>
        </div>
      </section>
      <section class="section features" aria-labelledby="features-title">
        <div class="wrap">
          <span class="eyebrow">Built for a brighter tomorrow</span>
          <h2 id="features-title">More people. More compute. More possibilities:</h2>
          <div class="feature-grid">
            <div class="feature-card"><span class="round-icon">${siteIcon("users")}</span><h3>Global access</h3><p>AI for everyone, everywhere.</p></div>
            <div class="feature-card"><span class="round-icon">${siteIcon("box")}</span><h3>Decentralized compute</h3><p>A resilient and independent network.</p></div>
            <div class="feature-card"><span class="round-icon">${siteIcon("shield")}</span><h3>Your data, your control</h3><p>Private, secure and transparent.</p></div>
            <div class="feature-card"><span class="round-icon">${siteIcon("leaf")}</span><h3>Real-world impact</h3><p>Powering innovation for a brighter tomorrow.</p></div>
          </div>
        </div>
      </section>
      <section class="section cta-band" aria-labelledby="join-title">
        <div class="wrap">
          <div class="cta-card">
            <div>
              <span class="eyebrow">Be part of the network</span>
              <h2 id="join-title">Join a global community shaping the future of AI.</h2>
              <div class="cta-actions">
                <a class="btn primary" href="../public/install/">Get started <span aria-hidden="true">&rarr;</span></a>
                <a class="btn ghost" href="../public/docs/">Learn more</a>
              </div>
            </div>
            <div class="cta-lines">A more open<br />A more accessible<br />A brighter tomorrow.</div>
          </div>
        </div>
      </section>
    </main>
    <footer class="site-footer">
      <div class="footer-main">
        <a class="brand" href="../" aria-label="MundusX home">${logo()}<span>MundusX<small>A better tomorrow</small></span></a>
        <div class="footer-col"><h3>Product</h3><a href="../public/docs/">Features</a><a href="../public/install/">Pricing</a><a href="../docs/install/">Roadmap</a></div>
        <div class="footer-col"><h3>Network</h3><a href="#global-map">Global Map</a><a href="#activity">Network Stats</a><a href="#how-title">How it Works</a></div>
        <div class="footer-col"><h3>Developers</h3><a href="../docs/">Docs</a><a href="../public/release/">API</a><a href="../docs/device-identity/">Integrations</a></div>
        <div class="footer-col"><h3>Company</h3><a href="../docs/device-identity/">About</a><a href="../public/docs/">Careers</a><a href="../public/docs/">Contact</a></div>
        <div class="social" aria-label="Social links">
          <a href="../public/docs/" aria-label="GitHub">${siteIcon("github")}</a>
          <a href="../public/docs/" aria-label="Community">${siteIcon("discord")}</a>
          <a href="../public/docs/" aria-label="LinkedIn">${siteIcon("linkedin")}</a>
          <a href="../public/docs/" aria-label="X">${siteIcon("x")}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 MundusX. All rights reserved.</span>
        <span class="legal"><a href="../public/docs/">Privacy</a><a href="../public/docs/">Terms</a><a href="../public/docs/">Cookies</a></span>
      </div>
    </footer>
  </body>
</html>`;
}

function networkCoreSvg() {
  return `<svg viewBox="0 0 300 300" aria-hidden="true">
    <circle cx="150" cy="150" r="139" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.48" />
    <ellipse cx="150" cy="150" rx="92" ry="139" fill="none" stroke="currentColor" stroke-width="1" opacity="0.24" />
    <ellipse cx="150" cy="150" rx="139" ry="54" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2" />
    <path d="M45 70 100 38 154 30 212 54 258 100 271 159 247 218 190 265 121 278 59 238 30 178Z" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.48" />
    <path d="M45 70 96 116 30 178M96 116 154 30 176 103 258 100M176 103 150 150 271 159M150 150 59 238M150 150 190 265M96 116 150 150 176 103M247 218 150 150" fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.45" />
    <g fill="currentColor"><circle cx="45" cy="70" r="3" /><circle cx="154" cy="30" r="4" /><circle cx="258" cy="100" r="4" /><circle cx="271" cy="159" r="3" /><circle cx="247" cy="218" r="3" /><circle cx="190" cy="265" r="3" /><circle cx="59" cy="238" r="3" /><circle cx="30" cy="178" r="3" /><circle cx="96" cy="116" r="3" /><circle cx="176" cy="103" r="3" /><circle cx="150" cy="150" r="3" /></g>
  </svg>`;
}

function brandMark(className = "mark") {
  return `<img class="${className}" src="./assets/mundusx-logo-official.svg" alt="" aria-hidden="true" />`;
}

function siteIcon(name) {
  const common = 'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"';
  const icons = {
    "arrow-up": '<path d="m12 19 0-14"/><path d="m5 12 7-7 7 7"/>',
    "bar-chart": '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20V8"/>',
    box: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/><path d="m14 4-4 16"/>',
    cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v4"/><path d="M15 1v4"/><path d="M9 19v4"/><path d="M15 19v4"/><path d="M1 9h4"/><path d="M1 15h4"/><path d="M19 9h4"/><path d="M19 15h4"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    discord: '<path d="M8 8c2.7-1 5.3-1 8 0"/><path d="M7 17c3.3 1.3 6.7 1.3 10 0"/><path d="M8 8 6 18l3-2"/><path d="m16 8 2 10-3-2"/><path d="M9.5 13h.01"/><path d="M14.5 13h.01"/>',
    folder: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5Z"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.4-.4 7-1.7 7-7.5a5.8 5.8 0 0 0-1.6-4A5.4 5.4 0 0 0 19.3 0S18 0 15 1.5a14.8 14.8 0 0 0-6 0C6 0 4.7 0 4.7 0a5.4 5.4 0 0 0-.1 3A5.8 5.8 0 0 0 3 7c0 5.8 3.6 7.1 7 7.5A4.8 4.8 0 0 0 9 18v4"/><path d="M9 18c-4.5 2-5-2-7-2"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/>',
    laptop: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9"/><path d="M2 20h20"/><path d="M6 16h12"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 8-10 16-9-1 8-5 16-11 16Z"/><path d="M4 13c4 0 8-1 12-5"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><path d="M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    "message-square": '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
    moon: '<path d="M20.5 14.5A8 8 0 0 1 9.5 3.5 8 8 0 1 0 20.5 14.5Z"/>',
    network: '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="M10.6 7.7 6.4 16.3"/><path d="m13.4 7.7 4.2 8.6"/><path d="M8 19h8"/>',
    paperclip: '<path d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l8.5-8.5a4 4 0 0 1 5.7 5.7l-8.5 8.5a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.6 6.8-4.2"/><path d="m8.6 13.4 6.8 4.2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',
    sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/>',
    spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m8 9 3 3-3 3"/><path d="M13 15h3"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    x: '<path d="M18 2 6 22"/><path d="m6 2 12 20"/>',
    youtube: '<path d="M22.5 8.5a3 3 0 0 0-2.1-2.1C18.5 6 12 6 12 6s-6.5 0-8.4.4a3 3 0 0 0-2.1 2.1A31 31 0 0 0 1 12a31 31 0 0 0 .5 3.5 3 3 0 0 0 2.1 2.1C5.5 18 12 18 12 18s6.5 0 8.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23 12a31 31 0 0 0-.5-3.5Z"/><path d="m10 15 5-3-5-3Z"/>',
    zap: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/>',
  };
  return `<svg ${common} aria-hidden="true">${icons[name] ?? icons.spark}</svg>`;
}

function writePublicInstallSurface() {
  const publicDir = path.join(outputDir, "public");
  const installDir = path.join(publicDir, "install");
  fs.mkdirSync(installDir, { recursive: true });

  const manifest = {
    kind: "install-manifest",
    product_name: "MundusX",
    audience: "public",
    install_script_href: "./install.sh",
    install_powershell_href: "./install.ps1",
    install_command: "RELEASE_BASE_URL=http://127.0.0.1:8788/releases/latest/download bash install.sh",
    windows_install_command:
      ".\\install.ps1 -ReleaseBaseUrl http://127.0.0.1:8788/releases/latest/download",
    release_base_url: repoReleaseBaseUrl,
    release_notes_url: repoReleaseNotesUrl,
    docs_home_href: "./docs/",
    install_docs_href: "./docs/install/",
    checksum_hint:
      "The hosted install script uses the signed GitHub release artifacts and fails closed unless checksum and signed manifest artifacts are present.",
  };

  fs.writeFileSync(path.join(publicDir, "install.sh"), installScriptContents);
  fs.writeFileSync(path.join(publicDir, "install.ps1"), installPowershellContents);
  fs.writeFileSync(path.join(publicDir, "install.json"), JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(path.join(outputDir, "install.json"), JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(path.join(outputDir, "install", "index.html"), renderLocalInstallPage());
  fs.writeFileSync(path.join(installDir, "index.html"), renderPublicInstallPage());
}

function writePublicReleaseSurface() {
  const publicDir = path.join(outputDir, "public");
  const releaseDir = path.join(publicDir, "release");
  fs.mkdirSync(releaseDir, { recursive: true });

  const manifest = {
    kind: "release-channel",
    product_name: "MundusX",
    audience: "public",
    release_base_url: repoReleaseBaseUrl,
    release_notes_url: repoReleaseNotesUrl,
    install_surface_href: "./install/",
    install_manifest_href: "./install.json",
    docs_release_href: "./docs/release/",
    artifact_name_pattern: "opengpu-<target>",
    checksum_suffix: ".sha256",
    signed_manifest_name: "release-manifest.json",
    distribution_summary:
      "GitHub Releases remains the current public artifact host while the Pages mirror explains the release channel, checksums, and install entrypoints.",
  };

  fs.writeFileSync(path.join(publicDir, "release.json"), JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(path.join(releaseDir, "index.html"), renderPublicReleasePage());
}

function renderPage(page, options) {
  const { eyebrow, homeIntro } = options;
  const nav = pages
    .map((entry) => {
      const href = relativeHref(page.slug, entry.slug);
      const active = entry.slug === page.slug ? ' aria-current="page"' : "";
      return `<a href="${href}"${active}>${escapeHtml(entry.title)}</a>`;
    })
    .join("");

  const body = page.sourcePath
    ? renderMarkdown(page, fs.readFileSync(page.sourcePath, "utf8"))
    : renderHome(homeIntro);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(page.title)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f3ea;
        --panel: #fffdf8;
        --text: #1e1d1a;
        --muted: #5d584f;
        --accent: #0b6bcb;
        --border: #d9d2c3;
        --shadow: 0 18px 48px rgba(51, 42, 20, 0.08);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Iowan Old Style", "Palatino Linotype", serif;
        background: linear-gradient(180deg, #f2ece0 0%, var(--bg) 22%, #fcfbf8 100%);
        color: var(--text);
      }
      a { color: var(--accent); }
      header {
        padding: 3rem 1.5rem 1rem;
      }
      .shell {
        width: min(1100px, calc(100% - 2rem));
        margin: 0 auto 4rem;
      }
      .hero {
        background: radial-gradient(circle at top left, rgba(11, 107, 203, 0.12), transparent 35%), var(--panel);
        border: 1px solid var(--border);
        border-radius: 28px;
        box-shadow: var(--shadow);
        padding: 2rem;
      }
      .eyebrow {
        display: inline-block;
        margin: 0 0 1rem;
        padding: 0.3rem 0.7rem;
        border-radius: 999px;
        background: #efe7d6;
        color: var(--muted);
        font: 600 0.85rem/1.2 "Helvetica Neue", Arial, sans-serif;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0;
        font-size: clamp(2.4rem, 4vw, 4.4rem);
        line-height: 0.98;
      }
      .hero p {
        max-width: 48rem;
        font-size: 1.1rem;
        line-height: 1.65;
        color: var(--muted);
      }
      nav {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1.5rem;
      }
      nav a {
        text-decoration: none;
        color: var(--text);
        padding: 0.65rem 0.9rem;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.75);
        font: 600 0.95rem/1.2 "Helvetica Neue", Arial, sans-serif;
      }
      nav a[aria-current="page"] {
        background: var(--accent);
        border-color: var(--accent);
        color: white;
      }
      main {
        margin-top: 1.5rem;
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 28px;
        box-shadow: var(--shadow);
        padding: 2rem;
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
      }
      .card {
        display: block;
        padding: 1.2rem;
        border-radius: 20px;
        text-decoration: none;
        background: #fff;
        border: 1px solid var(--border);
        color: inherit;
      }
      .card h2 {
        margin-top: 0;
        font-size: 1.2rem;
      }
      article {
        max-width: 52rem;
        margin: 0 auto;
      }
      article h1:first-child {
        font-size: clamp(2rem, 3vw, 3rem);
      }
      article h2, article h3 {
        margin-top: 2rem;
      }
      article p, article li {
        font-size: 1.05rem;
        line-height: 1.75;
      }
      article code {
        background: #f3eee4;
        border-radius: 6px;
        padding: 0.12rem 0.35rem;
        font-size: 0.95em;
      }
      pre {
        overflow-x: auto;
        padding: 1rem;
        border-radius: 18px;
        background: #1f2430;
        color: #f4f1eb;
      }
      pre code {
        background: none;
        padding: 0;
      }
      ul, ol {
        padding-left: 1.3rem;
      }
      footer {
        max-width: 52rem;
        margin: 2rem auto 0;
        color: var(--muted);
        font: 0.95rem/1.6 "Helvetica Neue", Arial, sans-serif;
      }
      @media (max-width: 640px) {
        .hero, main {
          padding: 1.4rem;
          border-radius: 22px;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header>
        <div class="hero">
          <span class="eyebrow">${escapeHtml(eyebrow)}</span>
          <h1>${escapeHtml(page.title)}</h1>
          <p>${escapeHtml(page.intro)}</p>
          <nav>${nav}</nav>
        </div>
      </header>
      <main>${body}</main>
      <footer>
        Built from the tracked markdown in this repository so the public docs site stays reviewable in pull requests.
      </footer>
    </div>
  </body>
</html>`;
}

function renderHome(homeIntro) {
  return `
    <article>
      <p>${escapeHtml(homeIntro)}</p>
      <div class="cards">
        ${pages
          .filter((entry) => entry.slug)
          .map(
            (entry) => `<a class="card" href="${relativeHref("", entry.slug)}">
              <h2>${escapeHtml(entry.title)}</h2>
              <p>${escapeHtml(entry.intro)}</p>
            </a>`,
          )
          .join("")}
      </div>
    </article>`;
}

function renderMarkdown(page, markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listType = null;
  let listItems = [];
  let codeFence = null;
  let codeLines = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listType || listItems.length === 0) return;
    html.push(`<${listType}>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${listType}>`);
    listType = null;
    listItems = [];
  };

  const flushCodeFence = () => {
    if (codeFence === null) return;
    const language = codeFence ? ` class="language-${escapeHtml(codeFence)}"` : "";
    html.push(`<pre><code${language}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    codeFence = null;
    codeLines = [];
  };

  for (const line of lines) {
    const fenceMatch = line.match(/^```(.*)$/);
    if (fenceMatch) {
      if (codeFence !== null) {
        flushCodeFence();
      } else {
        flushParagraph();
        flushList();
        codeFence = fenceMatch[1].trim();
      }
      continue;
    }

    if (codeFence !== null) {
      codeLines.push(line);
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      const nextType = /\d+\./.test(listMatch[2]) ? "ol" : "ul";
      if (listType && listType !== nextType) {
        flushList();
      }
      listType = nextType;
      listItems.push(listMatch[3]);
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushCodeFence();

  const summaryBlocks = [];
  if (page.slug === "install") {
    summaryBlocks.push(
      `<section><h2>Canonical commands</h2><pre><code>RELEASE_BASE_URL=http://127.0.0.1:8788/releases/latest/download bash install.sh
.\\install.ps1 -ReleaseBaseUrl http://127.0.0.1:8788/releases/latest/download</code></pre></section>`,
    );
  }
  if (page.slug === "device-identity") {
    summaryBlocks.push(
      `<section><h2>Current stance</h2><p>MundusX should prefer non-exportable device keys so the CLI, agent, and worker can request signatures without reading raw private-key bytes.</p></section>`,
    );
  }

  return `<article>${summaryBlocks.join("")}${html.join("\n")}</article>`;
}

function renderInline(text) {
  let rendered = escapeHtml(text);
  rendered = rendered.replace(/`([^`]+)`/g, "<code>$1</code>");
  rendered = rendered.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return rendered;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function relativeHref(fromSlug, toSlug) {
  if (fromSlug === toSlug) {
    return fromSlug === "" ? "./" : "../";
  }
  if (fromSlug === "") {
    return toSlug === "" ? "./" : `./${toSlug}/`;
  }
  if (toSlug === "") {
    return "../";
  }
  return `../${toSlug}/`;
}

function renderPublicInstallPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Install MundusX</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4efe4;
        --panel: #fffdf8;
        --text: #1c1c19;
        --muted: #5e584d;
        --accent: #0b6bcb;
        --border: #d9d2c3;
        --shadow: 0 20px 56px rgba(55, 42, 20, 0.1);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Iowan Old Style", "Palatino Linotype", serif;
        background:
          radial-gradient(circle at top left, rgba(11, 107, 203, 0.15), transparent 30%),
          linear-gradient(180deg, #efe7d6 0%, var(--bg) 28%, #fbfaf7 100%);
        color: var(--text);
      }
      a { color: var(--accent); }
      .shell {
        width: min(1040px, calc(100% - 2rem));
        margin: 0 auto;
        padding: 2.5rem 0 4rem;
      }
      .hero, .panel {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 28px;
        box-shadow: var(--shadow);
      }
      .hero {
        padding: 2rem;
      }
      .eyebrow {
        display: inline-block;
        margin-bottom: 1rem;
        padding: 0.3rem 0.7rem;
        border-radius: 999px;
        background: #efe7d6;
        color: var(--muted);
        font: 600 0.84rem/1.2 "Helvetica Neue", Arial, sans-serif;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0;
        font-size: clamp(2.7rem, 5vw, 4.6rem);
        line-height: 0.98;
      }
      .lead {
        max-width: 46rem;
        font-size: 1.12rem;
        line-height: 1.7;
        color: var(--muted);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1.5rem;
      }
      .actions a {
        text-decoration: none;
        font: 600 0.95rem/1.2 "Helvetica Neue", Arial, sans-serif;
        padding: 0.75rem 1rem;
        border-radius: 999px;
        border: 1px solid var(--border);
        color: var(--text);
        background: rgba(255, 255, 255, 0.8);
      }
      .actions a.primary {
        background: var(--accent);
        border-color: var(--accent);
        color: white;
      }
      .panel {
        margin-top: 1.4rem;
        padding: 1.8rem;
      }
      .panel h2 {
        margin-top: 0;
      }
      .command {
        overflow-x: auto;
        padding: 1rem 1.1rem;
        border-radius: 20px;
        background: #1f2430;
        color: #f4f1eb;
        font-size: 1rem;
        line-height: 1.6;
      }
      .manifest {
        margin-top: 1rem;
        color: var(--muted);
        font: 0.95rem/1.6 "Helvetica Neue", Arial, sans-serif;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }
      .card {
        padding: 1rem;
        border-radius: 20px;
        background: #fff;
        border: 1px solid var(--border);
      }
      .card h3 {
        margin-top: 0;
      }
      code {
        background: #f3eee4;
        border-radius: 6px;
        padding: 0.12rem 0.35rem;
      }
      ul {
        padding-left: 1.2rem;
      }
      @media (max-width: 640px) {
        .hero, .panel {
          border-radius: 22px;
          padding: 1.4rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <section class="hero">
        <span class="eyebrow">Public Install Endpoint</span>
        <h1>Install MundusX</h1>
        <p class="lead">This Pages-backed install surface mirrors the future public endpoint shape. It hosts the reviewed installer scripts from this repo and points them at the latest signed GitHub release artifacts.</p>
        <div class="actions">
          <a class="primary" href="../install.sh">Download install.sh</a>
          <a href="../install.ps1">Download install.ps1</a>
          <a href="../docs/install/">Install docs</a>
          <a href="../docs/release/">Release notes and distribution</a>
        </div>
      </section>

      <section class="panel">
        <h2>One command</h2>
        <div class="command" id="install-command">Fetching ../install.json</div>
        <p class="manifest" id="manifest-state">The public install surface loads its commands and release source from <code>../install.json</code>.</p>
      </section>

      <section class="panel">
        <h2>What this endpoint guarantees</h2>
        <div class="grid">
          <div class="card">
            <h3>Repo-owned scripts</h3>
            <p>The checked-in <code>install.sh</code> and <code>install.ps1</code> scripts are published under <code>/public</code>.</p>
          </div>
          <div class="card">
            <h3>Signed release source</h3>
            <p>The installer defaults to the latest GitHub release download set and requires the matching checksum plus signed release manifest artifacts.</p>
          </div>
          <div class="card">
            <h3>Reviewable copy</h3>
            <p>The broader docs mirror stays available under <code>/public/docs</code> so install wording and release notes can be reviewed together.</p>
          </div>
        </div>
      </section>

      <section class="panel">
        <h2>Before you run it</h2>
        <ul>
          <li>Use the shell installer on macOS/Linux and the PowerShell installer on Windows.</li>
          <li>The installer places <code>opengpu</code> or <code>opengpu.exe</code> into the platform default bin directory, with <code>mundusx</code> or <code>mundusx.exe</code> retained as a compatibility alias.</li>
          <li>After install, use <code>opengpu install</code> before <code>opengpu start</code> so control plane, cap, and model selection are explicit.</li>
        </ul>
      </section>
    </div>
    <script>
      const manifestUrl = new URL("../install.json", window.location.href);
      const commandNode = document.getElementById("install-command");
      const stateNode = document.getElementById("manifest-state");

      async function loadInstallManifest() {
        const response = await fetch(manifestUrl, { headers: { Accept: "application/json" } });
        if (!response.ok) {
          throw new Error("manifest request failed with " + response.status);
        }
        const manifest = await response.json();
        const installScriptUrl = new URL(manifest.install_script_href, manifestUrl).href;
        const installPowershellUrl = new URL(manifest.install_powershell_href, manifestUrl).href;
        const command =
          "macOS/Linux: curl -fsSL " +
          installScriptUrl +
          " | bash\nWindows: powershell -ExecutionPolicy Bypass -Command \"iwr " +
          installPowershellUrl +
          " -OutFile install.ps1; .\\install.ps1\"";
        commandNode.textContent = command;
        stateNode.textContent =
          "Manifest loaded from ../install.json • GitHub release source: " + manifest.release_base_url;
      }

      loadInstallManifest().catch((error) => {
        commandNode.textContent = "Failed to load install manifest";
        stateNode.textContent = "Unable to load ../install.json: " + error.message;
      });
    </script>
  </body>
</html>`;
}

function renderLocalInstallPage() {
  return renderPublicInstallPage()
    .replaceAll("../install.json", "./install.json")
    .replaceAll("../install.sh", "./public/install.sh")
    .replaceAll("../install.ps1", "./public/install.ps1")
    .replaceAll("../docs/", "./docs/")
    .replaceAll("Public Install Endpoint", "Local Install Preview")
    .replaceAll("This Pages-backed install surface mirrors the future public endpoint shape. It hosts the reviewed installer scripts from this repo and points them at the latest signed GitHub release artifacts.", "This localhost install surface hosts the reviewed installer scripts from this repo and points them at the current release artifacts.")
    .replaceAll("under <code>/public</code>", "under <code>/public</code> for preview download")
    .replaceAll("under <code>/public/docs</code>", "under <code>/docs</code>");
}

function renderPublicReleasePage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Public Release Mirror</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #eef5f4;
        --panel: #fbfefd;
        --text: #162321;
        --muted: #526865;
        --accent: #0d8b78;
        --border: #c7ddd8;
        --shadow: 0 18px 56px rgba(18, 55, 48, 0.1);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Iowan Old Style", "Palatino Linotype", serif;
        background:
          radial-gradient(circle at top right, rgba(13, 139, 120, 0.14), transparent 28%),
          linear-gradient(180deg, #e7f1ee 0%, var(--bg) 30%, #f9fcfb 100%);
        color: var(--text);
      }
      a { color: var(--accent); }
      .shell {
        width: min(1080px, calc(100% - 2rem));
        margin: 0 auto;
        padding: 2.5rem 0 4rem;
      }
      .hero, .panel {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 28px;
        box-shadow: var(--shadow);
      }
      .hero {
        padding: 2rem;
      }
      .eyebrow {
        display: inline-block;
        margin-bottom: 1rem;
        padding: 0.3rem 0.7rem;
        border-radius: 999px;
        background: #ddeeea;
        color: var(--muted);
        font: 600 0.84rem/1.2 "Helvetica Neue", Arial, sans-serif;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0;
        font-size: clamp(2.6rem, 5vw, 4.4rem);
        line-height: 0.98;
      }
      .lead {
        max-width: 48rem;
        font-size: 1.1rem;
        line-height: 1.7;
        color: var(--muted);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1.5rem;
      }
      .actions a {
        text-decoration: none;
        font: 600 0.95rem/1.2 "Helvetica Neue", Arial, sans-serif;
        padding: 0.75rem 1rem;
        border-radius: 999px;
        border: 1px solid var(--border);
        color: var(--text);
        background: rgba(255, 255, 255, 0.8);
      }
      .actions a.primary {
        background: var(--accent);
        border-color: var(--accent);
        color: white;
      }
      .panel {
        margin-top: 1.4rem;
        padding: 1.8rem;
      }
      .panel h2 {
        margin-top: 0;
      }
      .manifest {
        overflow-x: auto;
        padding: 1rem 1.1rem;
        border-radius: 20px;
        background: #1e2a2a;
        color: #ecf6f4;
        font-size: 1rem;
        line-height: 1.6;
      }
      .status {
        margin-top: 1rem;
        color: var(--muted);
        font: 0.95rem/1.6 "Helvetica Neue", Arial, sans-serif;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }
      .card {
        padding: 1rem;
        border-radius: 20px;
        background: #fff;
        border: 1px solid var(--border);
      }
      .card h3 {
        margin-top: 0;
      }
      code {
        background: #e7f1ee;
        border-radius: 6px;
        padding: 0.12rem 0.35rem;
      }
      ul {
        padding-left: 1.2rem;
      }
      @media (max-width: 640px) {
        .hero, .panel {
          border-radius: 22px;
          padding: 1.4rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <section class="hero">
        <span class="eyebrow">Public Release Mirror</span>
        <h1>Review the live release channel before the final domain exists.</h1>
        <p class="lead">This Pages-backed release surface keeps the current GitHub-hosted distribution flow legible in pull requests. It points at the signed release artifact channel, the checked-in installer surface, and the release notes users should trust today.</p>
        <div class="actions">
          <a class="primary" href="https://github.com/mundusx/mundusx/releases/latest">Latest release notes</a>
          <a href="../install/">Install endpoint</a>
          <a href="../docs/release/">Release strategy docs</a>
        </div>
      </section>

      <section class="panel">
        <h2>Release channel manifest</h2>
        <div class="manifest" id="release-summary">Fetching ../release.json</div>
        <p class="status" id="release-state">This mirror loads its release-channel metadata from <code>../release.json</code>.</p>
      </section>

      <section class="panel">
        <h2>What this release surface covers</h2>
        <div class="grid">
          <div class="card">
            <h3>Artifact host</h3>
            <p>GitHub Releases stays the current public binary host, with the latest download set rooted at <code>/releases/latest/download</code>.</p>
          </div>
          <div class="card">
            <h3>Verification path</h3>
            <p>Each published asset is expected to ship with a checksum and a signed <code>release-manifest.json</code>.</p>
          </div>
          <div class="card">
            <h3>Install hand-off</h3>
            <p>The public install surface and checked-in installer scripts remain the supported way to consume that release channel.</p>
          </div>
        </div>
      </section>

      <section class="panel">
        <h2>Current release posture</h2>
        <ul>
          <li>Apple Silicon macOS remains the primary release lane today.</li>
          <li>Package-manager distribution can layer on later without changing the signed GitHub release source.</li>
          <li>The Pages mirror is for reviewability; the actual binary artifacts still come from GitHub Releases.</li>
        </ul>
      </section>
    </div>
    <script>
      const manifestUrl = new URL("../release.json", window.location.href);
      const summaryNode = document.getElementById("release-summary");
      const stateNode = document.getElementById("release-state");

      async function loadReleaseManifest() {
        const response = await fetch(manifestUrl, { headers: { Accept: "application/json" } });
        if (!response.ok) {
          throw new Error("release manifest request failed with " + response.status);
        }
        const manifest = await response.json();
        summaryNode.textContent =
          "Latest artifacts: " +
          manifest.release_base_url +
          " | Notes: " +
          manifest.release_notes_url +
          " | Pattern: " +
          manifest.artifact_name_pattern;
        stateNode.textContent =
          "Manifest loaded from ../release.json • Signed manifest: " + manifest.signed_manifest_name;
      }

      loadReleaseManifest().catch((error) => {
        summaryNode.textContent = "Failed to load release channel manifest";
        stateNode.textContent = "Unable to load ../release.json: " + error.message;
      });
    </script>
  </body>
</html>`;
}
