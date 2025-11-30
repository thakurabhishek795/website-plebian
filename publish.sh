#!/usr/bin/env zsh
# Simple publish helper. Usage:
#   ./publish.sh <REMOTE_URL> [branch]
# Example:
#   ./publish.sh git@github.com:YOUR_USERNAME/REPO_NAME.git main

set -e
REMOTE_URL="$1"
BRANCH="${2:-main}"

if [[ -z "$REMOTE_URL" ]]; then
  echo "Usage: $0 <git-remote-url> [branch]"
  exit 1
fi

if [[ ! -d .git ]]; then
  git init
fi

git add -A
if git rev-parse --verify HEAD >/dev/null 2>&1; then
  git commit -m "Update site" || true
else
  git commit -m "Initial site commit" || true
fi

git branch -M "$BRANCH"
if git remote | grep -q '^origin$'; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

echo "Pushing to origin/$BRANCH..."
git push -u origin "$BRANCH"

echo "Done. If you want GitHub Pages from the repository root, enable Pages -> Deploy from `main` branch in repo settings." 
