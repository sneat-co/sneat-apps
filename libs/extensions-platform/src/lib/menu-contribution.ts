import { ExtensionMenuItem } from './models';

/** True when a contributed menu item is well-formed (non-empty title and path). */
export function isWellFormedMenuItem(item: unknown): item is ExtensionMenuItem {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const m = item as Record<string, unknown>;
  return (
    typeof m['title'] === 'string' &&
    m['title'].length > 0 &&
    typeof m['path'] === 'string' &&
    m['path'].length > 0 &&
    (m['emoji'] === undefined || typeof m['emoji'] === 'string') &&
    (m['args'] === undefined ||
      (typeof m['args'] === 'object' && m['args'] !== null))
  );
}

/**
 * Keep only well-formed menu items, dropping malformed ones.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 * Verifies: extension-host-and-bridge#ac:menu-items-rendered-and-route
 */
export function sanitizeMenuItems(
  items: readonly unknown[],
): ExtensionMenuItem[] {
  return items.filter(isWellFormedMenuItem);
}

/**
 * Compute the single content-iframe `src` for activating a menu item: the
 * extension's `origin` + `path`, with `args` serialised as query parameters.
 * Re-routing the one existing iframe (never spawning another) is the caller's
 * responsibility - this only derives the URL.
 *
 * Verifies: extension-host-and-bridge#ac:single-iframe-only
 */
export function menuItemUrl(origin: string, item: ExtensionMenuItem): string {
  const url = new URL(item.path, origin);
  if (item.args) {
    for (const [key, value] of Object.entries(item.args)) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}
