---
name: fetch-url
description: [research|url-ingestion] Fetch webpage content with hard timeout for agent context ingestion
---

# Fetch URL

Use the provided script to fetch webpage content safely with hard timeouts, then output a structured plain-text payload that LLM agents can parse.

## Usage

Run the script:

`scripts/fetch-url.sh <url> [--timeout <seconds>] [--max-chars <count>]`

Examples:
- `scripts/fetch-url.sh "https://kubernetes.io/docs/home/"`
- `scripts/fetch-url.sh "https://example.com" --timeout 20 --max-chars 18000`

## Agent instructions

- Use this skill whenever you need live webpage content in context.
- Pass the target URL directly to the script.
- On success, include the script output in context as-is (it already includes title, description, content bounds, and links).
- If the command fails or times out, report the error and ask for an alternate URL or timeout value.

The script enforces both an outer `timeout` and `curl --max-time`, preventing hung fetches.
