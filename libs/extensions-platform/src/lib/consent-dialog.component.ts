import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ScopeDescriptor, ScopeId } from './scope-catalog';

/**
 * The per-scope decision for a single requested scope.
 */
export interface ScopeDecision {
  readonly scope: ScopeId;
  readonly granted: boolean;
}

/** The outcome of the consent dialog: a per-scope decision for every prompted scope. */
export interface ConsentDecision {
  readonly decisions: readonly ScopeDecision[];
}

/**
 * Granular consent dialog. Prominently displays the extension's identity and
 * origin and lists each requested catalog scope with its label and description,
 * each independently grant-able or decline-able. Nothing is granted implicitly:
 * every scope starts un-granted and the user must opt each one in. On confirm it
 * emits the per-scope decisions; on cancel every prompted scope is declined.
 *
 * specscore: https://specscore.md/features/extension-consent-and-scopes
 * Verifies: extension-consent-and-scopes#ac:granular-grant-and-decline
 * Verifies: extension-consent-and-scopes#ac:consent-shows-origin
 */
@Component({
  selector: 'sneat-extension-consent-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="sneat-consent">
      <header class="sneat-consent-header">
        <h2 class="sneat-consent-name">{{ extensionName() }}</h2>
        <p class="sneat-consent-origin" data-test="consent-origin">
          {{ origin() }}
        </p>
        <p class="sneat-consent-intro">
          This extension is requesting access to:
        </p>
      </header>

      <ul class="sneat-consent-scopes">
        @for (scope of scopes(); track scope.id) {
          <li class="sneat-consent-scope">
            <label>
              <input
                type="checkbox"
                [checked]="isGranted(scope.id)"
                (change)="toggle(scope.id, $event)"
              />
              <span class="sneat-consent-scope-label">{{ scope.label }}</span>
              <span class="sneat-consent-scope-desc">{{
                scope.description
              }}</span>
            </label>
          </li>
        }
      </ul>

      <footer class="sneat-consent-actions">
        <button type="button" (click)="decline()">Decline all</button>
        <button type="button" (click)="confirm()">Allow selected</button>
      </footer>
    </section>
  `,
})
export class ConsentDialogComponent {
  /** Human-readable extension name shown in the dialog header. */
  readonly extensionName = input.required<string>();
  /** The extension's origin, shown prominently so the user knows who is asking. */
  readonly origin = input.required<string>();
  /** The catalog scopes (already filtered to known scopes) being requested. */
  readonly scopes = input.required<readonly ScopeDescriptor[]>();

  /** Emits the per-scope decisions when the user confirms or declines all. */
  readonly decided = output<ConsentDecision>();

  /** Scopes the user has opted in so far. Nothing is granted implicitly. */
  private readonly granted = signal<ReadonlySet<ScopeId>>(new Set());

  readonly grantedScopes = computed(() => [...this.granted()]);

  isGranted(scope: ScopeId): boolean {
    return this.granted().has(scope);
  }

  toggle(scope: ScopeId, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.set(scope, checked);
  }

  /** Grant or revoke a single scope's pending selection. */
  set(scope: ScopeId, granted: boolean): void {
    const next = new Set(this.granted());
    if (granted) {
      next.add(scope);
    } else {
      next.delete(scope);
    }
    this.granted.set(next);
  }

  /** Emit a decision for every prompted scope, granting only opted-in ones. */
  confirm(): void {
    const grantedSet = this.granted();
    this.decided.emit({
      decisions: this.scopes().map((s) => ({
        scope: s.id,
        granted: grantedSet.has(s.id),
      })),
    });
  }

  /** Decline every prompted scope. */
  decline(): void {
    this.decided.emit({
      decisions: this.scopes().map((s) => ({ scope: s.id, granted: false })),
    });
  }
}
