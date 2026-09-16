#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
out_dir="$(mktemp -d)"
trap 'rm -rf "$out_dir"' EXIT

node "$repo_root/scripts/build-public-docs-site.mjs" "$out_dir"

require_file() {
  local path="$1"
  if [[ ! -f "$out_dir/$path" ]]; then
    echo "missing generated file: $path" >&2
    exit 1
  fi
}

require_line() {
  local path="$1"
  local pattern="$2"
  if ! grep -Fq "$pattern" "$out_dir/$path"; then
    echo "missing pattern '$pattern' in generated $path" >&2
    exit 1
  fi
}

require_file "index.html"
require_file "assets/homepage-dark-bg.png"
require_file "assets/mundusx-logo-official.svg"
require_file "assets/network-hero-globe.png"
require_file "assets/network-world-map-transparent.png"
require_file "assets/network-cta-mountains.png"
require_file "network/index.html"
require_file "install/index.html"
require_file "device-identity/index.html"
require_file "public/docs/index.html"
require_file "public/docs/install/index.html"
require_file "public/install/index.html"
require_file "public/install.json"
require_file "public/install.sh"
require_file "public/install.ps1"
require_file "public/release/index.html"
require_file "public/release.json"

require_line "index.html" "AI that works across"
require_line "index.html" "Chat with Atlas"
require_line "index.html" "Decentralized Compute"
require_line "index.html" "./assets/homepage-dark-bg.png"
require_line "index.html" "./assets/mundusx-logo-official.svg"
require_line "index.html" 'href="./network/">Network</a>'
require_line "index.html" 'href="https://chat.mundusx.ai/">Start with MundusX</a>'
require_line "network/index.html" "A global network for a"
require_line "network/index.html" "Live Network"
require_line "network/index.html" "People power<br />intelligence."
require_line "network/index.html" "Users online"
require_line "network/index.html" "A living, global network."
require_line "network/index.html" "../assets/mundusx-logo-official.svg"
require_line "network/index.html" "../assets/network-hero-globe.png"
require_line "network/index.html" "../assets/network-world-map-transparent.png"
require_line "network/index.html" "../assets/network-cta-mountains.png"
require_line "install/index.html" "One command"
require_line "install/index.html" "Fetching ./install.json"
require_line "public/docs/install/index.html" "RELEASE_BASE_URL=http://127.0.0.1:8788/releases/latest/download bash install.sh"
require_line "device-identity/index.html" "Device Identity Lifecycle"
require_line "device-identity/index.html" "non-exportable device keys"
require_line "public/docs/index.html" "Public Endpoint Mirror"
require_line "public/docs/install/index.html" "Canonical command"
require_line "public/install/index.html" "Install MundusX"
require_line "public/install/index.html" "Fetching ../install.json"
require_line "public/install.json" "\"kind\": \"install-manifest\""
require_line "public/install.json" "\"release_base_url\": \"https://github.com/mundusx/mundusx/releases/latest/download\""
require_line "public/install.sh" 'RELEASE_BASE_URL="${RELEASE_BASE_URL:-https://github.com/mundusx/releases/releases/download/opengpu-prod}"'
require_line "public/install.ps1" "x86_64-pc-windows-msvc"
require_line "public/release/index.html" "Public Release Mirror"
require_line "public/release/index.html" "Fetching ../release.json"
require_line "public/release.json" "\"kind\": \"release-channel\""
require_line "public/release.json" "\"release_notes_url\": \"https://github.com/mundusx/mundusx/releases/latest\""

echo "Public docs site build verified."
