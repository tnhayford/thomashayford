#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="/opt/websites/thomashayford"
ASSET_VER="${1:-$(date +%Y%m%d%H%M)}"

echo "Using asset version: ${ASSET_VER}"

mapfile -t HTML_FILES < <(find "$BASE_DIR/dist" "$BASE_DIR/templates" -type f -name "*.html" | sort)

if [ "${#HTML_FILES[@]}" -eq 0 ]; then
  echo "No HTML files found to update."
  exit 1
fi

for file in "${HTML_FILES[@]}"; do
  sed -E -i \
    -e "s#(/assets/site\\.css)(\\?v=[^\"]*)?#\\1?v=${ASSET_VER}#g" \
    -e "s#(/assets/site\\.js)(\\?v=[^\"]*)?#\\1?v=${ASSET_VER}#g" \
    "$file"
done

echo "Updated asset query version in ${#HTML_FILES[@]} HTML files."

if rg -n 'href="/assets/site.css"' "$BASE_DIR/dist" --glob '*.html' >/dev/null || \
   rg -n 'src="/assets/site.js"' "$BASE_DIR/dist" --glob '*.html' >/dev/null; then
  echo "Warning: found non-versioned asset references in dist."
  rg -n 'href="/assets/site.css"|src="/assets/site.js"' "$BASE_DIR/dist" --glob '*.html' || true
else
  echo "Verified: all dist HTML references are versioned."
fi

docker restart thomashayford-web >/dev/null
echo "Container restarted: thomashayford-web"
echo "Rebuild complete."
