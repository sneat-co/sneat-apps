#!/bin/sh

git pull
pnpm install
pnpm run nx build sneat-app
