import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { httpsOriginOf } from './origin';

const CSP_META_ID = 'sneat-ext-frame-src-csp';

/**
 * Maintains the dynamic CSP `frame-src` allowlist of extension origins the user
 * has explicitly consented to embed, and reflects it into the host page's
 * Content-Security-Policy. Only origins on the allowlist can be framed; an
 * origin absent from the allowlist is blocked by CSP and never loads.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 * Verifies: extension-host-and-bridge#ac:frame-src-allowlist-blocks-unknown-origin
 * Verifies: extension-host-and-bridge#ac:deregistration-drops-allowlist
 */
@Injectable({ providedIn: 'root' })
export class FrameSrcAllowlistService {
  private readonly document = inject(DOCUMENT);
  private readonly origins = new Set<string>();

  /**
   * Add an `https` origin to the allowlist and refresh the CSP.
   * Returns the normalised origin, or `undefined` for a non-`https` input.
   */
  add(originOrUrl: string): string | undefined {
    const origin = httpsOriginOf(originOrUrl);
    if (!origin) {
      return undefined;
    }
    this.origins.add(origin);
    this.applyCsp();
    return origin;
  }

  /** Remove an origin from the allowlist and refresh the CSP. */
  remove(originOrUrl: string): boolean {
    const origin = httpsOriginOf(originOrUrl) ?? originOrUrl;
    const removed = this.origins.delete(origin);
    if (removed) {
      this.applyCsp();
    }
    return removed;
  }

  /** True when the origin is on the allowlist (and may be framed). */
  isAllowed(originOrUrl: string): boolean {
    const origin = httpsOriginOf(originOrUrl);
    return origin !== undefined && this.origins.has(origin);
  }

  /** Snapshot of allowed origins. */
  list(): readonly string[] {
    return [...this.origins];
  }

  /** Current `frame-src` directive value (always begins with `'none'`). */
  frameSrcDirective(): string {
    return ["frame-src 'none'", ...this.origins].join(' ');
  }

  private applyCsp(): void {
    const head = this.document.head;
    if (!head) {
      return;
    }
    let meta = this.document.getElementById(
      CSP_META_ID,
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = this.document.createElement('meta');
      meta.id = CSP_META_ID;
      meta.httpEquiv = 'Content-Security-Policy';
      head.appendChild(meta);
    }
    meta.setAttribute('content', this.frameSrcDirective());
  }
}
