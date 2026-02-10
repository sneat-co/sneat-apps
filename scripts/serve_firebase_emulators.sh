#!/bin/sh

# Resolve directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

FIREBASE_DIR="$SCRIPT_DIR/../../sneat-firebase"

if [ ! -d "$FIREBASE_DIR" ]; then
  echo "Cloning sneat-firebase repository..."
  git clone https://github.com/sneat-co/sneat-firebase.git "$FIREBASE_DIR"
fi

"$FIREBASE_DIR/scripts/serve_fb_emulators_ssl.sh"
