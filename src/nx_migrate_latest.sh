# https://nx.dev/core-features/automate-updating-dependencies
pnx migrate latest # same as nx migrate @nx/workspace@latest
pnpm install
pnx migrate --run-migrations
