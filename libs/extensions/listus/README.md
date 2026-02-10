# extensions-listus

This library was generated with [Nx](https://nx.dev).

## Features

- List management functionality
- Emoji detection for list items (lazy-loaded)

## Emoji Detection

The emoji data is now lazy-loaded to reduce bundle size. Use `EmojisLoaderService.detectEmoji()` instead of the deprecated `detectEmoji()` function:

```typescript
import { EmojisLoaderService } from '@sneat/ext-listus';

// In your component
constructor(private emojisLoader: EmojisLoaderService) {}

async addItem(title: string) {
  const emoji = await this.emojisLoader.detectEmoji(title);
  // Use the emoji...
}
```

**Note:** This requires `HttpClient` to be provided in your application. The emoji data (~1000 lines) is loaded from `assets/data/emojis.json` on first use.

## Running unit tests

Run `nx test extensions-listus` to execute the unit tests.
