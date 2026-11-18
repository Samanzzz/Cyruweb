#!/usr/bin/env bash
# Lays the static CyruTech site (site/) over the Next.js export (out/).
# The new site owns /, /404, /pages/* and /assets/*; old Next routes that have a
# new equivalent redirect to it; the rest (/ignite, /unicorns, /summer-2027) stay as they are.
set -euo pipefail
OUT="${1:-out}"
test -d "$OUT" || { echo "no $OUT directory; run next build first" >&2; exit 1; }
cp -R site/. "$OUT"/
rm -f "$OUT/index.txt"

redirect() { # route target
  cat > "$OUT/$1.html" <<HTML
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Redirecting…</title>
<meta name="robots" content="noindex"><link rel="canonical" href="https://cyrutech.com$2">
<meta http-equiv="refresh" content="0; url=$2">
<script>location.replace("$2" + location.search + location.hash)</script>
</head><body><p><a href="$2">Continue to $2</a></p></body></html>
HTML
  rm -f "$OUT/$1.txt"
}
redirect bootcamp /pages/education.html
redirect careers /pages/careers.html
redirect contact /pages/contact.html
echo "overlay done"
