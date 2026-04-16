#!/usr/bin/env bash
# Security pattern scan – checks staged diff for sensitive content.
# Called by pre-commit hook and CI.
# Exit 1 = blocking violation found.

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# ── Helper ──────────────────────────────────────────────────────────────────
error() { echo -e "${RED}[SECURITY ERROR]${NC} $1"; ERRORS=$((ERRORS + 1)); }
warn()  { echo -e "${YELLOW}[SECURITY WARN]${NC} $1";  WARNINGS=$((WARNINGS + 1)); }

# In CI we diff against main; in pre-commit we use staged changes.
if [ "${CI:-}" = "true" ]; then
  DIFF=$(git diff --unified=0 origin/main...HEAD -- \
    '*.json' '*.yml' '*.yaml' '*.ts' '*.js' '*.sh' '*.md' '*.gradle' \
    '.env*' 'app.json' 'build.gradle' 2>/dev/null || true)
else
  DIFF=$(git diff --cached --unified=0 -- \
    '*.json' '*.yml' '*.yaml' '*.ts' '*.js' '*.sh' '*.md' '*.gradle' \
    '.env*' 'app.json' 'build.gradle' 2>/dev/null || true)
fi

if [ -z "$DIFF" ]; then
  echo "No relevant files changed – security check skipped."
  exit 0
fi

# Only inspect added/modified lines
ADDED=$(echo "$DIFF" | grep '^+' | grep -v '^+++' || true)

# ── Critical patterns ────────────────────────────────────────────────────────

# Cloud service project IDs / EAS IDs
if echo "$ADDED" | grep -qiE '"projectId"\s*:\s*"[a-f0-9-]{20,}"'; then
  error "EAS/Cloud projectId found in diff. Move to environment variable or CI secret."
fi

# Firebase / Google Cloud project IDs
if echo "$ADDED" | grep -qiE '"project_id"\s*:\s*"[a-z0-9_-]+-[0-9]+"'; then
  error "Firebase project_id found. Move to .env or CI secret."
fi

# API keys / tokens in YAML (not via secrets)
if echo "$ADDED" | grep -qiE '(api[_-]?key|token|secret|password)\s*[:=]\s*[A-Za-z0-9+/]{20,}' ; then
  error "Possible hardcoded API key/token found. Use GitHub Secrets instead."
fi

# SHA1/SHA256 signing fingerprints
if echo "$ADDED" | grep -qiE '([A-F0-9]{2}:){19,}[A-F0-9]{2}'; then
  error "Signing fingerprint (SHA1/SHA256) found. Store as repository secret."
fi

# Personal package names (com.<username>.*)
if echo "$ADDED" | grep -qiE '"applicationId"\s*:\s*"com\.(s540d|devSven|personal)[^"]*"'; then
  error "Personal package name found in applicationId. Use a generic identifier."
fi

# Hardcoded account names in CI owner fields
if echo "$ADDED" | grep -qiE 'owner:\s*(s540d|devSven)' ; then
  # Allow in CODEOWNERS and README, warn elsewhere
  warn "Personal account name in owner field. Verify this is intentional."
fi

# ── Internal documents staged ───────────────────────────────────────────────

INTERNAL_PATTERNS=(
  "PLAYSTORE_STATUS"
  "DOCUMENTATION_AUDIT"
  "DOCUMENTATION_STRATEGY"
  "STANDARDIZATION_VERIFICATION"
  "AUTOMATION_SUMMARY"
  "Quality-Check-Agent"
)

for pattern in "${INTERNAL_PATTERNS[@]}"; do
  if echo "$DIFF" | grep -q "^+++ b/.*${pattern}"; then
    warn "Internal process document '${pattern}' is being staged. Consider keeping it local."
  fi
done

# ── .claude / .cursor config ─────────────────────────────────────────────────
if echo "$DIFF" | grep -qE '^diff --git a/\.(claude|cursor)/'; then
  warn "AI tool config (.claude/ or .cursor/) staged. Review before committing."
fi

# ── Summary ──────────────────────────────────────────────────────────────────
echo ""
if [ "$ERRORS" -gt 0 ]; then
  echo -e "${RED}Security check FAILED: $ERRORS error(s), $WARNINGS warning(s).${NC}"
  echo "Fix the issues above before committing."
  exit 1
fi

if [ "$WARNINGS" -gt 0 ]; then
  echo -e "${YELLOW}Security check PASSED with $WARNINGS warning(s). Review above.${NC}"
else
  echo "Security check PASSED."
fi
exit 0
