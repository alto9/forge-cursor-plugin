#!/usr/bin/env bash

set -euo pipefail

usage() {
    cat <<'EOF'
Usage: scripts/fetch-url.sh <url> [--timeout <seconds>] [--max-chars <count>]

Fetches a webpage with hard timeouts and prints LLM-friendly plain text.

Arguments:
  <url>                 HTTP/HTTPS URL to fetch
  --timeout <seconds>   Hard timeout for entire operation (default: 15)
  --max-chars <count>   Max characters in extracted content (default: 12000)
EOF
}

require_command() {
    local cmd="$1"
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "Error: required command '$cmd' is not installed." >&2
        exit 1
    fi
}

require_command timeout
require_command curl
require_command python3

if [[ $# -lt 1 ]]; then
    usage
    exit 1
fi

URL="$1"
shift || true

TIMEOUT_SEC=15
MAX_CHARS=12000

while [[ $# -gt 0 ]]; do
    case "$1" in
        --timeout)
            TIMEOUT_SEC="${2:-}"
            shift 2
            ;;
        --max-chars)
            MAX_CHARS="${2:-}"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Error: unknown argument '$1'" >&2
            usage
            exit 1
            ;;
    esac
done

if [[ ! "${URL}" =~ ^https?:// ]]; then
    echo "Error: URL must start with http:// or https://" >&2
    exit 1
fi

if ! [[ "${TIMEOUT_SEC}" =~ ^[0-9]+$ ]] || [[ "${TIMEOUT_SEC}" -le 0 ]]; then
    echo "Error: --timeout must be a positive integer" >&2
    exit 1
fi

if ! [[ "${MAX_CHARS}" =~ ^[0-9]+$ ]] || [[ "${MAX_CHARS}" -le 0 ]]; then
    echo "Error: --max-chars must be a positive integer" >&2
    exit 1
fi

TMP_HTML="$(mktemp)"
cleanup() {
    rm -f "${TMP_HTML}"
}
trap cleanup EXIT

set +e
timeout "${TIMEOUT_SEC}s" \
    curl \
      --location \
      --silent \
      --show-error \
      --fail \
      --max-time "${TIMEOUT_SEC}" \
      --connect-timeout 8 \
      --compressed \
      --user-agent "kube9-vscode-fetch-url-skill/1.0" \
      "${URL}" \
      --output "${TMP_HTML}"
FETCH_EXIT=$?
set -e

if [[ ${FETCH_EXIT} -ne 0 ]]; then
    if [[ ${FETCH_EXIT} -eq 124 ]]; then
        echo "Error: timed out after ${TIMEOUT_SEC}s while fetching ${URL}" >&2
    else
        echo "Error: failed to fetch ${URL} (exit code ${FETCH_EXIT})" >&2
    fi
    exit ${FETCH_EXIT}
fi

if [[ ! -s "${TMP_HTML}" ]]; then
    echo "Error: fetched empty response body from ${URL}" >&2
    exit 1
fi

python3 - "${TMP_HTML}" "${URL}" "${MAX_CHARS}" <<'PY'
import datetime
import html as html_lib
import re
import sys
from html.parser import HTMLParser

html_path = sys.argv[1]
url = sys.argv[2]
max_chars = int(sys.argv[3])

with open(html_path, "rb") as f:
    raw = f.read()

doc = raw.decode("utf-8", errors="replace")

title_match = re.search(r"<title[^>]*>(.*?)</title>", doc, flags=re.IGNORECASE | re.DOTALL)
title = html_lib.unescape(title_match.group(1)).strip() if title_match else ""
title = re.sub(r"\s+", " ", title)

desc_match = re.search(
    r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']',
    doc,
    flags=re.IGNORECASE | re.DOTALL,
)
if not desc_match:
    desc_match = re.search(
        r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']',
        doc,
        flags=re.IGNORECASE | re.DOTALL,
    )
description = html_lib.unescape(desc_match.group(1)).strip() if desc_match else ""
description = re.sub(r"\s+", " ", description)


class Extractor(HTMLParser):
    BLOCK_TAGS = {
        "p", "div", "section", "article", "main", "aside", "header", "footer",
        "nav", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "br",
        "pre", "blockquote", "table", "tr", "td", "th"
    }
    SKIP_TAGS = {"script", "style", "noscript", "svg"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.skip_depth = 0
        self.in_anchor = False
        self.anchor_text = []
        self.anchor_href = ""
        self.links = []

    def handle_starttag(self, tag, attrs):
        t = tag.lower()
        if t in self.SKIP_TAGS:
            self.skip_depth += 1
            return
        if self.skip_depth > 0:
            return
        if t in self.BLOCK_TAGS:
            self.parts.append("\n")
        if t == "a":
            self.in_anchor = True
            self.anchor_text = []
            href = ""
            for k, v in attrs:
                if k.lower() == "href" and v:
                    href = v.strip()
            self.anchor_href = href

    def handle_endtag(self, tag):
        t = tag.lower()
        if t in self.SKIP_TAGS and self.skip_depth > 0:
            self.skip_depth -= 1
            return
        if self.skip_depth > 0:
            return
        if t in self.BLOCK_TAGS:
            self.parts.append("\n")
        if t == "a":
            text = re.sub(r"\s+", " ", "".join(self.anchor_text)).strip()
            href = self.anchor_href.strip()
            if href and text:
                self.links.append((text, href))
            self.in_anchor = False
            self.anchor_text = []
            self.anchor_href = ""

    def handle_data(self, data):
        if self.skip_depth > 0:
            return
        if data:
            self.parts.append(data)
            if self.in_anchor:
                self.anchor_text.append(data)


extractor = Extractor()
extractor.feed(doc)
extractor.close()

text = html_lib.unescape("".join(extractor.parts))
lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
lines = [line for line in lines if line]
content = "\n".join(lines)

truncated = False
if len(content) > max_chars:
    content = content[:max_chars].rstrip()
    truncated = True

print("=== FETCHED WEBPAGE ===")
print(f"URL: {url}")
print(f"FETCHED_AT_UTC: {datetime.datetime.utcnow().isoformat(timespec='seconds')}Z")
print(f"TITLE: {title or '(none)'}")
print(f"META_DESCRIPTION: {description or '(none)'}")
print(f"CONTENT_TRUNCATED: {'yes' if truncated else 'no'}")
print("CONTENT_START")
print(content if content else "(no text content extracted)")
print("CONTENT_END")

if extractor.links:
    print("LINKS_START")
    for idx, (text, href) in enumerate(extractor.links[:25], start=1):
        clean_text = re.sub(r"\s+", " ", text).strip()
        print(f"{idx}. {clean_text} -> {href}")
    if len(extractor.links) > 25:
        print(f"... ({len(extractor.links) - 25} more links omitted)")
    print("LINKS_END")
PY
