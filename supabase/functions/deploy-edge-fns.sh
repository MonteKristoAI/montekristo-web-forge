#!/usr/bin/env bash
# Deploy MK onboarding edge functions to the tydafqhnzxmrpnclaxnl Supabase project.
#
# Currently only one function:
#   - mk-enrich-web: free PageSpeed + OG/schema scraper (no external API key required)
#
# Usage:
#   cd /Users/milanmandic/Desktop/montekristo-web-forge/supabase/functions
#   ./deploy-edge-fns.sh

set -euo pipefail

PROJECT_REF="tydafqhnzxmrpnclaxnl"
FNS=(mk-enrich-web)

for fn in "${FNS[@]}"; do
  echo ""
  echo "=== Deploying $fn ==="
  supabase functions deploy "$fn" --project-ref "$PROJECT_REF"
done

echo ""
echo "Done."
