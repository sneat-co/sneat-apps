#!/bin/sh

# Resolve directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ "$GITHUB_ACTIONS" = "true" ]; then
  echo "Running in GitHub Actions"
# TODO: Clone https://github.com/sneat-co/sneat-firebase repository
fi

# We assume sneat-firebase repo is cloned
"$SCRIPT_DIR/../../sneat-firebase/scripts/serve_fb_emulators_ssl.sh"
