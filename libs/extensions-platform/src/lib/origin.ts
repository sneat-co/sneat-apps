/**
 * Origin helpers shared across the extension platform.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 */

/**
 * Parse a URL string and return its `https` origin, or `undefined` when the
 * URL is not a valid absolute `https` URL.
 */
export function httpsOriginOf(url: string): string | undefined {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }
  if (parsed.protocol !== 'https:') {
    return undefined;
  }
  return parsed.origin;
}

/**
 * Registration id = origin `host[:port]` (no scheme), per the Feature.
 * Returns `undefined` for a non-`https` origin/URL.
 */
export function extensionIdOf(originOrUrl: string): string | undefined {
  const origin = httpsOriginOf(originOrUrl);
  if (!origin) {
    return undefined;
  }
  return new URL(origin).host;
}
