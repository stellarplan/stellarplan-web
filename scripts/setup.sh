#!/usr/bin/env bash
# StellarPlan Web — one-command local setup.
#
#   ./scripts/setup.sh
#
# 1. create .env.local from .env.example if missing
# 2. install dependencies (incl. @stellar/freighter-api)
# 3. type-check + build
#
# Edit NEXT_PUBLIC_API_URL in .env.local if your API is not on localhost:4000.
set -euo pipefail
cd "$(dirname "$0")/.."

say() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }

if [ ! -f .env.local ]; then
  say "Creating .env.local from .env.example"
  cp .env.example .env.local
fi

say "Installing dependencies (npm install)"
npm install

say "Building (type-checks the whole app)"
npm run build

say "Web is ready. Start it with:  npm run dev"
echo "   Open http://localhost:3000  (Freighter extension required to sign in)"
