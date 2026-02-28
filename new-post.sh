#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 5 ]; then
  echo "Usage: $0 <category> <slug> <title> <summary> <date-YYYY-MM-DD>"
  echo "Example: $0 business product-review-week-1 \"Product Review Week 1\" \"What I learned reviewing systems.\" 2026-03-01"
  exit 1
fi

CATEGORY="$1"
SLUG="$2"
TITLE="$3"
SUMMARY="$4"
DATE="$5"

case "$CATEGORY" in
  business) CATEGORY_LABEL="Business" ;;
  credentials) CATEGORY_LABEL="Credentials" ;;
  travel) CATEGORY_LABEL="Travel" ;;
  experience) CATEGORY_LABEL="Experience" ;;
  fun) CATEGORY_LABEL="Fun" ;;
  hard-moments) CATEGORY_LABEL="Hard Moments" ;;
  *)
    echo "Invalid category: $CATEGORY"
    echo "Allowed: business, credentials, travel, experience, fun, hard-moments"
    exit 1
    ;;
esac

BASE_DIR="/opt/websites/thomashayford"
TARGET_DIR="$BASE_DIR/dist/journal/$CATEGORY/$SLUG"
TEMPLATE="$BASE_DIR/templates/post-template.html"
TARGET_FILE="$TARGET_DIR/index.html"

if [ -e "$TARGET_FILE" ]; then
  echo "Post already exists: $TARGET_FILE"
  exit 1
fi

mkdir -p "$TARGET_DIR"
cp "$TEMPLATE" "$TARGET_FILE"

escape() {
  printf '%s' "$1" | sed -e 's/[\/&]/\\&/g'
}

sed -i \
  -e "s/{{CATEGORY}}/$(escape "$CATEGORY")/g" \
  -e "s/{{SLUG}}/$(escape "$SLUG")/g" \
  -e "s/{{TITLE}}/$(escape "$TITLE")/g" \
  -e "s/{{SUMMARY}}/$(escape "$SUMMARY")/g" \
  -e "s/{{DATE}}/$(escape "$DATE")/g" \
  -e "s/{{CATEGORY_LABEL}}/$(escape "$CATEGORY_LABEL")/g" \
  "$TARGET_FILE"

echo "Created: $TARGET_FILE"
echo "Next steps:"
echo "1) Add this URL to /opt/websites/thomashayford/dist/sitemap.xml"
echo "2) Add a card link in /opt/websites/thomashayford/dist/journal/index.html"
echo "3) Add the post to the category index page"
