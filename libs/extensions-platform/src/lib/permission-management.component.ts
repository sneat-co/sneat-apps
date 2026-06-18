import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ScopeId } from './scope-catalog';
import {
  ExtensionPermissionView,
  PermissionManagementService,
} from './permission-management.service';

/**
 * The settings / permission-management screen. Lists every extension the
 * signed-in user has installed (name, icon, origin); for an untrusted extension
 * it shows the currently-granted scopes by catalog label with a per-scope Revoke
 * control; for a trusted extension it shows a "Trusted — full account access"
 * badge instead of a scope list. Each extension exposes a Remove action. When no
 * extensions are installed it renders a non-error empty state.
 *
 * It holds no consent logic of its own: every read and mutation delegates to
 * {@link PermissionManagementService}, which in turn delegates to F2's consent
 * store and F1's deregistration.
 *
 * specscore: https://specscore.md/features/extension-permission-management-ui
 * Verifies: extension-permission-management-ui#ac:list-shows-installed-extensions
 * Verifies: extension-permission-management-ui#ac:empty-state-when-none-installed
 * Verifies: extension-permission-management-ui#ac:shows-currently-granted-scopes
 * Verifies: extension-permission-management-ui#ac:trusted-extension-shows-full-access-badge
 * Verifies: extension-permission-management-ui#ac:revoke-single-scope
 * Verifies: extension-permission-management-ui#ac:remove-extension-fully
 */
@Component({
  selector: 'sneat-extension-permissions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="sneat-ext-permissions">
      <h2 class="sneat-ext-permissions-title">Installed extensions</h2>

      @if (extensions().length === 0) {
        <p class="sneat-ext-empty" data-test="empty-state">
          You have no installed extensions.
        </p>
      } @else {
        <ul class="sneat-ext-list">
          @for (ext of extensions(); track ext.id) {
            <li class="sneat-ext-item" [attr.data-test-ext]="ext.id">
              <header class="sneat-ext-identity">
                <img
                  class="sneat-ext-icon"
                  [src]="ext.icon"
                  [alt]="ext.name + ' icon'"
                  data-test="ext-icon"
                />
                <span class="sneat-ext-name" data-test="ext-name">{{
                  ext.name
                }}</span>
                <span class="sneat-ext-origin" data-test="ext-origin">{{
                  ext.origin
                }}</span>
              </header>

              @if (ext.isTrusted) {
                <p class="sneat-ext-trusted-badge" data-test="trusted-badge">
                  Trusted — full account access
                </p>
              } @else {
                @if (ext.grantedScopes.length === 0) {
                  <p class="sneat-ext-no-scopes" data-test="no-scopes">
                    No scopes granted.
                  </p>
                } @else {
                  <ul class="sneat-ext-scopes" data-test="scope-list">
                    @for (scope of ext.grantedScopes; track scope.id) {
                      <li
                        class="sneat-ext-scope"
                        [attr.data-test-scope]="scope.id"
                      >
                        <span class="sneat-ext-scope-label">{{
                          scope.label
                        }}</span>
                        <button
                          type="button"
                          class="sneat-ext-revoke"
                          data-test="revoke"
                          (click)="revokeScope(ext.id, scope.id)"
                        >
                          Revoke
                        </button>
                      </li>
                    }
                  </ul>
                }
              }

              <footer class="sneat-ext-actions">
                <button
                  type="button"
                  class="sneat-ext-remove"
                  data-test="remove"
                  (click)="remove(ext.id)"
                >
                  Remove
                </button>
              </footer>
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class PermissionManagementComponent {
  private readonly service = inject(PermissionManagementService);

  /** The signed-in user whose installed extensions and grants are shown. */
  readonly userId = input.required<string>();

  /** Bumped after every mutation to recompute the view from the stores. */
  private readonly version = signal(0);

  /** The current display model, recomputed whenever a mutation occurs. */
  readonly extensions = computed<readonly ExtensionPermissionView[]>(() => {
    this.version();
    return this.service.list(this.userId());
  });

  /** Revoke one scope and reflect the change immediately. */
  revokeScope(extId: string, scope: ScopeId): void {
    this.service.revokeScope(this.userId(), extId, scope);
    this.refresh();
  }

  /** Remove (uninstall) an extension and reflect the change immediately. */
  remove(extId: string): void {
    this.service.remove(this.userId(), extId);
    this.refresh();
  }

  private refresh(): void {
    this.version.update((v) => v + 1);
  }
}
