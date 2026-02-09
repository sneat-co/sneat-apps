#!/bin/sh

# Resolve directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Call target script relative to this file
# We make assumption you have access backed repositories and it's cloned
"$SCRIPT_DIR/../../sneat-go-server/serve_gae.sh"
