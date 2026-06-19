import { ErrorHandler, Injectable } from '@angular/core';

/**
 * Reloads the app once when a lazy-loaded chunk fails to load.
 *
 * After a deploy, the hash-named lazy chunks are replaced on the server. A tab
 * that was already open is still running an older `main.js` that references the
 * previous chunk hashes, so navigating to a lazy route fetches a chunk URL that
 * now 404s. Firebase Hosting's SPA rewrite then returns `index.html` for the
 * missing `.js`, and the browser throws a `ChunkLoadError` /
 * "'text/html' is not a valid JavaScript MIME type". A single full reload pulls
 * the current `index.html` + matching chunks and transparently recovers.
 *
 * A short time-based guard (in `sessionStorage`) prevents a reload loop when a
 * chunk is genuinely broken rather than merely stale.
 *
 * Alternative considered: an Angular service worker (ngsw) + `SwUpdate` would
 * largely *prevent* this by caching a consistent version set and prompting on a
 * new deploy. We deliberately do NOT add a service worker just for this — the
 * app currently ships without one, and a SW brings its own caching/staleness
 * complexity. If a PWA service worker is adopted later (for offline/installable
 * support), this handler can stay as a cheap backstop.
 */
@Injectable()
export class ChunkLoadErrorHandler implements ErrorHandler {
  private static readonly reloadKey = 'sneat:chunk-reload-at';
  private static readonly reloadGuardMs = 10_000;

  handleError(error: unknown): void {
    if (
      ChunkLoadErrorHandler.isChunkLoadError(error) &&
      this.reloadOnceWithinGuard()
    ) {
      return;
    }
    console.error(error);
  }

  /** Reloads at most once per guard window; returns true if a reload was triggered. */
  private reloadOnceWithinGuard(): boolean {
    let lastReloadAt = 0;
    try {
      lastReloadAt = Number(
        sessionStorage.getItem(ChunkLoadErrorHandler.reloadKey) ?? 0,
      );
    } catch {
      // sessionStorage may be unavailable (e.g. private mode) — fall through.
    }
    if (Date.now() - lastReloadAt <= ChunkLoadErrorHandler.reloadGuardMs) {
      // Reloaded very recently and still failing -> stop to avoid a loop.
      return false;
    }
    try {
      sessionStorage.setItem(
        ChunkLoadErrorHandler.reloadKey,
        String(Date.now()),
      );
    } catch {
      // ignore storage failures; still attempt the reload below.
    }
    location.reload();
    return true;
  }

  private static isChunkLoadError(error: unknown): boolean {
    const err = error as { name?: string; message?: string } | null;
    const name = err?.name ?? '';
    const message = err?.message ?? String(error);
    return (
      name === 'ChunkLoadError' ||
      /Failed to fetch dynamically imported module/i.test(message) ||
      /error loading dynamically imported module/i.test(message) ||
      /Loading chunk [\w-]+ failed/i.test(message) ||
      /Importing a module script failed/i.test(message) ||
      /is not a valid JavaScript MIME type/i.test(message)
    );
  }
}
