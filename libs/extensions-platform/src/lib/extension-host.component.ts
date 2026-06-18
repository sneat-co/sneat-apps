import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FrameSrcAllowlistService } from './frame-src-allowlist.service';
import { ExtensionMenuItem, ExtensionRegistration } from './models';
import { menuItemUrl } from './menu-contribution';

/**
 * Renders a registered extension in a single sandboxed `<iframe>` pointed at the
 * extension's own `https` origin. The sandbox grants `allow-scripts
 * allow-same-origin` so the framed document keeps its OWN origin (its own
 * `localStorage`/`IndexedDB`) while the same-origin policy isolates it from
 * sneat-app's session/storage. The host renders contributed menu items and
 * re-routes the single content iframe on activation - never spawning a second
 * iframe.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 * Verifies: extension-host-and-bridge#ac:cross-origin-isolation-from-host
 * Verifies: extension-host-and-bridge#ac:extension-has-own-origin-storage
 * Verifies: extension-host-and-bridge#ac:single-iframe-only
 * Verifies: extension-host-and-bridge#ac:menu-items-rendered-and-route
 */
@Component({
  selector: 'sneat-extension-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (allowed()) {
      @if (menuItems().length) {
        <nav class="sneat-ext-menu">
          @for (item of menuItems(); track item.path) {
            <button
              type="button"
              class="sneat-ext-menu-item"
              (click)="activate(item)"
            >
              @if (item.emoji) {
                <span class="sneat-ext-menu-emoji">{{ item.emoji }}</span>
              }
              {{ item.title }}
            </button>
          }
        </nav>
      }
      <iframe
        class="sneat-ext-frame"
        [src]="frameSrc()"
        sandbox="allow-scripts allow-same-origin"
        referrerpolicy="no-referrer"
      ></iframe>
    } @else {
      <p class="sneat-ext-blocked">
        This extension's origin is not allowed to be embedded.
      </p>
    }
  `,
})
export class ExtensionHostComponent {
  private readonly allowlist = inject(FrameSrcAllowlistService);
  private readonly sanitizer = inject(DomSanitizer);

  /** The extension to embed. */
  readonly registration = input.required<ExtensionRegistration>();
  /** Well-formed menu items contributed over the bridge. */
  readonly menuItems = input<readonly ExtensionMenuItem[]>([]);

  /** Current single-iframe url; null until an entry is activated. */
  private readonly currentUrl = signal<string | null>(null);

  /** True only when the registration's origin is on the `frame-src` allowlist. */
  readonly allowed = computed(() =>
    this.allowlist.isAllowed(this.registration().origin),
  );

  /** The single iframe's src - the activated route, or the extension root. */
  readonly frameSrc = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      this.currentUrl() ?? this.registration().origin + '/',
    ),
  );

  /** Re-route the single iframe to the activated menu item. */
  activate(item: ExtensionMenuItem): void {
    this.currentUrl.set(menuItemUrl(this.registration().origin, item));
  }
}
