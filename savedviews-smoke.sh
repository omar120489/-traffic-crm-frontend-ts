#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:3000}"
TOKEN="${TOKEN:-}"
if [[ -z "${TOKEN}" ]]; then
  echo "ERROR: Set TOKEN env var with a valid dev JWT. Example:"
  echo "export TOKEN='eyJhbGciOi...'"
  exit 1
fi

AUTH=(-H "Authorization: Bearer ${TOKEN}")
JSON=(-H "Content-Type: application/json")
API="${API_BASE}/api/saved-views"

echo "=== Saved Views API Smoke ==="
echo "API base: ${API_BASE}"
echo

echo "1) List (initial)"
curl -s "${AUTH[@]}" "${API}" | jq '.'

echo
echo "2) Create"
CREATE_PAYLOAD='{"name":"Q4 Sales","filters":{"from":"2025-10-01","to":"2025-12-31","types":["email","call"]},"isDefault":false,"isShared":false}'
CREATE_RESP=$(curl -s -X POST "${AUTH[@]}" "${JSON[@]}" -d "${CREATE_PAYLOAD}" "${API}")
echo "${CREATE_RESP}" | jq '.'

VIEW_ID=$(echo "${CREATE_RESP}" | jq -r '.id // empty')
if [[ -z "${VIEW_ID}" || "${VIEW_ID}" == "null" ]]; then
  echo "ERROR: Could not parse created view id"
  exit 1
fi
echo "Created VIEW_ID=${VIEW_ID}"

echo
echo "3) List (after create)"
curl -s "${AUTH[@]}" "${API}" | jq '.'

echo
echo "4) Get single"
curl -s "${AUTH[@]}" "${API}/${VIEW_ID}" | jq '.'

echo
echo "5) Update"
UPDATE_PAYLOAD='{"name":"Q4 Sales – Updated"}'
curl -s -X PATCH "${AUTH[@]}" "${JSON[@]}" -d "${UPDATE_PAYLOAD}" "${API}/${VIEW_ID}" | jq '.'

echo
echo "6) (Optional) Delete"
# uncomment to test delete:
# curl -s -X DELETE "${AUTH[@]}" "${API}/${VIEW_ID}" | jq '.'

echo
echo "=== Saved Views Smoke Complete ==="

