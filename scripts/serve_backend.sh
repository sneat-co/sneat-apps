#!/bin/sh

# Resolve directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"


if [ "$GITHUB_ACTIONS" = "true" ]; then
  echo "Running in GitHub Actions"
  ./sneat-server
else
  # Resolve directory where this script lives
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

  # We assume backend repo is cloned
  "$SCRIPT_DIR/../../sneat-go-server/serve_gae.sh"
fi
