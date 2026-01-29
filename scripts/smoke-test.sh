#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-${BASE_URL:-}}"

if [[ -z "${BASE_URL}" ]]; then
  echo "Usage: ./scripts/smoke-test.sh https://your-app-url"
  echo "Or set BASE_URL env var."
  exit 1
fi

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

pass() {
  echo "PASS: $1"
}

echo "Running smoke checks against: ${BASE_URL}"

# Health check
health_json="$(curl -fsS "${BASE_URL}/_api/health" || true)"
echo "${health_json}" | grep -q "\"ok\":true" || fail "health endpoint missing ok:true"
pass "health endpoint ok"

# Unauthorized guard (example: jobs list)
jobs_status="$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/_api/jobs/list")"
if [[ "${jobs_status}" != "401" ]]; then
  fail "unauthenticated /_api/jobs/list expected 401, got ${jobs_status}"
fi
pass "unauthenticated jobs list returns 401"

# AI endpoints should be disabled (410)
ai_status="$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  "${BASE_URL}/_api/ai/chat")"
if [[ "${ai_status}" != "410" ]]; then
  fail "AI chat expected 410, got ${ai_status}"
fi
pass "AI chat returns 410"

import_status="$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d '{}' \
  "${BASE_URL}/_api/import/linkedin")"
if [[ "${import_status}" != "410" ]]; then
  fail "Import expected 410, got ${import_status}"
fi
pass "Import returns 410"

echo ""
echo "Manual checks still required:"
echo "- Auth flow: register → login → session → logout"
echo "- CRUD create/update/delete for 7 entities"
echo "- Dashboard onboarding: jobs=0 shows; after first job hides; ?new=1 opens dialog"
echo "- Timeline loads with real records"
echo "- Global search scoped"
echo "- TellDoug queries (jobs, skills, 2022)"
