#!/bin/sh

set -e

# Resolve directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Executing $SCRIPT_DIR/.serve_firebase_emulators.sh..."

FIREBASE_DIR="$SCRIPT_DIR/../../sneat-firebase"

if [ ! -d "$FIREBASE_DIR" ]; then
  echo "Cloning sneat-firebase repository..."
  git clone https://github.com/sneat-co/sneat-firebase.git "$FIREBASE_DIR"
  echo "Cloned sneat-firebase repository to $FIREBASE_DIR"
fi

if [ "$GITHUB_ACTIONS" = "true" ]; then
  EMULATOR_SCRIPT="$FIREBASE_DIR/scripts/serve_fb_emulators_ci.sh"
else
  EMULATOR_SCRIPT="$FIREBASE_DIR/scripts/serve_fb_emulators_ssl.sh"
fi

if [ ! -f "$EMULATOR_SCRIPT" ]; then
  echo "ERROR: Emulator script not found: $EMULATOR_SCRIPT"
  echo "Contents of $FIREBASE_DIR:"
  ls -la "$FIREBASE_DIR" 2>&1 || true
  echo "Contents of $FIREBASE_DIR/scripts:"
  ls -la "$FIREBASE_DIR/scripts" 2>&1 || true
  exit 1
fi

echo "Running emulator script: $EMULATOR_SCRIPT"
sh "$EMULATOR_SCRIPT"
