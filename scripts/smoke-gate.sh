#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-${BASE_URL:-}}"
EXPECTED_COMMIT="${2:-${EXPECTED_COMMIT:-}}"

if [ -z "${BASE_URL}" ]; then
  echo "Usage: npm run smoke:gate -- https://<url> [expected_commit_prefix]" >&2
  exit 1
fi

if [ -z "${EXPECTED_COMMIT}" ] && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  EXPECTED_COMMIT="$(git rev-parse --short HEAD)"
fi

if [ -n "${EXPECTED_COMMIT}" ]; then
  echo "== wait for deploy ${EXPECTED_COMMIT} =="
  for i in {1..180}; do
    j="$(curl -fsS "${BASE_URL}/_api/health" || true)"
    echo "${j}" | grep -q "\"commit\":\"${EXPECTED_COMMIT}" && { echo "✅ Deployed: ${j}"; break; }
    echo "…not yet (${i}/180): ${j}"
    sleep 2
  done

  curl -fsS "${BASE_URL}/_api/health" | grep -q "\"commit\":\"${EXPECTED_COMMIT}" || {
    echo "❌ Not on expected commit. Redeploy and try again." >&2
    exit 1
  }
else
  echo "== health check =="
  curl -fsS "${BASE_URL}/_api/health" > /dev/null
fi

echo ""
echo "== full smoke =="
BASE_URL="${BASE_URL}" npm run smoke:full

echo ""
echo "✅ Gate PASS (commit + auth + curl + CRUD)"
