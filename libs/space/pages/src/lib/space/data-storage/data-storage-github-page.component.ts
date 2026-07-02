import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  SpaceComponentBaseParams,
  SpacePageBaseComponent,
} from '@sneat/space-components';
import { ClassName } from '@sneat/ui';
import { OVDB_GITHUB_APP_SLUG } from './ovdb-github.config';
import { IOvdbGithubGrant, OvdbGithubService } from './ovdb-github.service';
import {
  isSpaceAdmin,
  isValidRepo,
  parseInstallationID,
} from './ovdb-github.utils';

type LoadState = 'loading' | 'error' | 'loaded';

// Space settings section: "Data storage · GitHub (OpenVaultDB)" — an
// Experimental preview that lets a space admin bind this space's data to their
// own GitHub repo through the Sneat GitHub App. Talks to the sneat-go OVDB grant
// endpoints via OvdbGithubService. No live sync yet (see
// backstage/docs/roadmaps/space-storage-strategy.md — the choice ships labelled
// Experimental) and access-token/grant design in ovdb-access-tokens-grants.md.
//
// Flow: reached from the space page settings; Back returns to the space home.
// States: loading / error (retry) / no-grant (explainer + install + save form) /
// grant (repo·branch·status + Update + Revoke). Mutating controls are gated
// behind the current user being a space admin (UI-only; backend re-checks).
@Component({
  selector: 'sneat-space-data-storage-github-page',
  templateUrl: './data-storage-github-page.component.html',
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonList,
    IonInput,
    IonNote,
    IonButton,
    IonIcon,
    IonBadge,
    IonText,
    IonSpinner,
  ],
  providers: [
    { provide: ClassName, useValue: 'DataStorageGithubPageComponent' },
    SpaceComponentBaseParams,
    OvdbGithubService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataStorageGithubPageComponent extends SpacePageBaseComponent {
  private readonly ovdbGithubService = inject(OvdbGithubService);
  private readonly alertCtrl = inject(AlertController);
  private readonly appSlug = inject(OVDB_GITHUB_APP_SLUG);

  protected readonly $loadState = signal<LoadState>('loading');
  protected readonly $loadError = signal<string | undefined>(undefined);
  protected readonly $grant = signal<IOvdbGithubGrant | null>(null);

  // Whether the current user may mutate the grant (derived from their roles in
  // the space; see isSpaceAdmin). Backend is the source of truth.
  protected readonly $isAdmin = signal(false);

  // Grant form (kept as strings so partial/invalid input renders; parsed on save).
  protected readonly $installationID = signal('');
  protected readonly $repo = signal('');
  protected readonly $branch = signal('main');
  protected readonly $isSaving = signal(false);
  protected readonly $saveError = signal<string | undefined>(undefined);
  protected readonly $isRevoking = signal(false);

  // Install URL is built from the per-environment app slug, never hardcoded.
  protected readonly $installUrl = computed(
    () => `https://github.com/apps/${this.appSlug}/installations/new`,
  );

  protected readonly $canSave = computed(
    () =>
      !!parseInstallationID(this.$installationID()) &&
      isValidRepo(this.$repo()) &&
      !!this.$branch().trim(),
  );

  // Latest per-space roles map for the signed-in user, kept so admin can be
  // recomputed when either the user state or the current spaceID changes.
  private userSpaceRoles?: Record<string, { readonly roles: string[] }>;

  constructor() {
    super();
    this.spaceIDChanged$.pipe(this.takeUntilDestroyed()).subscribe(() => {
      this.recomputeAdmin();
      this.loadGrant();
    });
    this.userService.userState
      .pipe(this.takeUntilDestroyed())
      .subscribe((state) => {
        this.userSpaceRoles = state.record?.spaces;
        this.recomputeAdmin();
      });
  }

  private recomputeAdmin(): void {
    const spaceID = this.space?.id;
    const roles = spaceID ? this.userSpaceRoles?.[spaceID]?.roles : undefined;
    this.$isAdmin.set(isSpaceAdmin(roles));
  }

  private loadGrant(): void {
    const spaceID = this.space?.id;
    if (!spaceID) {
      return;
    }
    this.$loadState.set('loading');
    this.$loadError.set(undefined);
    this.ovdbGithubService
      .getGithubGrant(spaceID)
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => {
          this.$grant.set(response.grant ?? null);
          this.prefillForm(response.grant);
          this.$loadState.set('loaded');
        },
        error: (err) => {
          this.logError(err, 'Failed to load GitHub storage grant', {
            show: false,
          });
          this.$loadError.set(
            'Could not load the storage settings. Check your connection and try again.',
          );
          this.$loadState.set('error');
        },
      });
  }

  protected retryLoad(): void {
    this.loadGrant();
  }

  private prefillForm(grant: IOvdbGithubGrant | null | undefined): void {
    if (grant) {
      this.$installationID.set(String(grant.installationID));
      this.$repo.set(grant.repo);
      this.$branch.set(grant.branch || 'main');
    }
  }

  protected saveGrant(): void {
    const spaceID = this.space?.id;
    const installationID = parseInstallationID(this.$installationID());
    const repo = this.$repo().trim();
    const branch = this.$branch().trim() || 'main';
    if (
      !spaceID ||
      !this.$isAdmin() ||
      !installationID ||
      !isValidRepo(repo) ||
      this.$isSaving()
    ) {
      return;
    }
    this.$isSaving.set(true);
    this.$saveError.set(undefined);
    this.ovdbGithubService
      .setGithubGrant({ spaceID, installationID, repo, branch })
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => {
          this.$isSaving.set(false);
          this.$grant.set(response.grant ?? null);
          this.prefillForm(response.grant);
          this.$loadState.set('loaded');
        },
        error: (err) => {
          this.$isSaving.set(false);
          this.logError(err, 'Failed to save GitHub storage grant');
          this.$saveError.set(
            'Could not save the grant. Double-check the installation ID and repo, then try again.',
          );
        },
      });
  }

  protected async confirmRevoke(): Promise<void> {
    if (!this.$isAdmin() || !this.$grant()) {
      return;
    }
    const alert = await this.alertCtrl.create({
      header: 'Disconnect GitHub storage?',
      message:
        'Sneat will stop writing this space to your GitHub repo. Your repo and its data are left untouched. You can reconnect later.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Disconnect',
          role: 'destructive',
          handler: () => this.revokeGrant(),
        },
      ],
    });
    await alert.present();
  }

  private revokeGrant(): void {
    const spaceID = this.space?.id;
    if (!spaceID || !this.$isAdmin() || this.$isRevoking()) {
      return;
    }
    this.$isRevoking.set(true);
    this.$saveError.set(undefined);
    this.ovdbGithubService
      .revokeGithubGrant({ spaceID })
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (response) => {
          this.$isRevoking.set(false);
          this.$grant.set(response.grant ?? null);
        },
        error: (err) => {
          this.$isRevoking.set(false);
          this.logError(err, 'Failed to revoke GitHub storage grant');
          this.$saveError.set(
            'Could not disconnect GitHub storage. Please try again.',
          );
        },
      });
  }

  protected statusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'broken':
        return 'warning';
      default:
        return 'medium';
    }
  }
}
