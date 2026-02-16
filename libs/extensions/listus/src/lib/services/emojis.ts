/**
 * @deprecated This function is deprecated. Use EmojisLoaderService.detectEmoji() instead.
 * The emoji data is now lazy-loaded to reduce bundle size.
 *
 * For backwards compatibility, this synchronous function is kept but will console.warn.
 * In the future, all code should use the async EmojisLoaderService.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function detectEmoji(_s?: string): string | undefined {
  console.warn(
    'detectEmoji() is deprecated. Use EmojisLoaderService.detectEmoji() for async loading.',
  );
  // Return undefined for now - callers should migrate to the service
  return undefined;
}
