#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-${BASE_URL:-http://localhost:3333}}"

echo "== Auth smoke =="
BASE_URL="$BASE_URL" npm run smoke:auth

echo ""
echo "== Curl smoke =="
npm run smoke:curl -- "$BASE_URL"

echo ""
echo "== CRUD smoke =="
BASE_URL="$BASE_URL" npm run smoke:crud

echo ""
echo "✅ Full smoke gate PASS (auth + curl + CRUD)"
