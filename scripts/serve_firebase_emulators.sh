#!/bin/sh

# Resolve directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

"$SCRIPT_DIR/../../sneat-firebase/scripts/serve_fb_emulators_ssl.sh"

