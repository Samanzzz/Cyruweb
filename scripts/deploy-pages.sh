#!/usr/bin/env bash
# Builds the site locally and publishes it to the gh-pages branch, which GitHub Pages
# serves at cyrutech.com. Used instead of the Actions workflow while Actions is unavailable.
# Usage: bash scripts/deploy-pages.sh
set -euo pipefail
cd "$(dirname "$0")/.."
SHA=$(git rev-parse --short HEAD)
if [ -n "$(git status --porcelain -- site src scripts public next.config.ts package.json)" ]; then
  echo "Commit your changes first (site/, src/, scripts/ ...)" >&2; exit 1
fi
rm -rf out
npx --no-install next build
bash scripts/overlay-site.sh out
touch out/.nojekyll
echo cyrutech.com > out/CNAME
TMP=$(mktemp -d)
cp -R out/. "$TMP"/
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$OLDPWD" config user.name)" -c user.email="$(git -C "$OLDPWD" config user.email)" \
  commit -q -m "Deploy cyrutech.com from master $SHA"
git push -q -f "$(git -C "$OLDPWD" remote get-url origin)" gh-pages
cd - >/dev/null && rm -rf "$TMP"
echo "Deployed $SHA to gh-pages; GitHub Pages will publish it in a minute or two."
