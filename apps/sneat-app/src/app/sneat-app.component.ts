import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenu,
  IonRouterOutlet,
  IonSplitPane,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { BaseAppComponent } from '@sneat/app';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger, ISpaceRef, SpaceType } from '@sneat/core';
import { filter, map } from 'rxjs';
import { SneatAppMenuComponent } from './sneat-app-menu-component/sneat-app-menu.component';

const CURRENT_SPACE_STORAGE_KEY = 'sneat.currentSpace';

@Component({
  selector: 'sneat-app-root',
  templateUrl: 'sneat-app.component.html',
  imports: [
    IonApp,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonText,
    IonContent,
    IonRouterOutlet,
    RouterLink,
    SneatAppMenuComponent,
  ],
})
export class SneatAppComponent extends BaseAppComponent {
  private readonly appRouter = inject(Router);
  private readonly authStateService = inject(SneatAuthStateService);
  private readonly errorLogger = inject(ErrorLogger);

  private sawSignedOut = false;
  private pendingLoginSpaceRedirect = false;

  private readonly currentUrl = toSignal(
    this.appRouter.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.appRouter.url },
  );

  private readonly authState = toSignal(this.authStateService.authState);

  private readonly currentSpace = computed(() =>
    this.spaceFromUrl(this.currentUrl()),
  );

  protected readonly showRouteMenu = computed(() =>
    this.currentUrl().startsWith('/space/'),
  );

  constructor() {
    super();

    effect(() => {
      const space = this.currentSpace();
      if (space) {
        this.pendingLoginSpaceRedirect = false;
        this.writeCurrentSpace(space);
        return;
      }
      this.redirectToCurrentSpaceAfterLogin();
    });

    effect(() => {
      const status = this.authState()?.status;
      if (status === 'notAuthenticated') {
        this.sawSignedOut = true;
        return;
      }
      if (status !== 'authenticated' || !this.sawSignedOut) {
        return;
      }
      this.sawSignedOut = false;
      this.pendingLoginSpaceRedirect = true;
      this.redirectToCurrentSpaceAfterLogin();
    });
  }

  private redirectToCurrentSpaceAfterLogin(): void {
    if (
      !this.pendingLoginSpaceRedirect ||
      this.authState()?.status !== 'authenticated'
    ) {
      return;
    }
    const currentUrl = this.currentUrl();
    if (this.spaceFromUrl(currentUrl)) {
      this.pendingLoginSpaceRedirect = false;
      return;
    }
    const space = this.readCurrentSpace();
    if (!space?.id || !space.type) {
      this.pendingLoginSpaceRedirect = false;
      return;
    }
    const spaceUrl = `/space/${space.type}/${space.id}`;
    if (currentUrl === spaceUrl) {
      this.pendingLoginSpaceRedirect = false;
      return;
    }
    this.appRouter
      .navigateByUrl(spaceUrl)
      .catch(
        this.errorLogger.logErrorHandler(
          'Failed to navigate to the persisted current space after login',
        ),
      );
  }

  private spaceFromUrl(url: string): ISpaceRef | undefined {
    const match = url.match(/^\/space\/([^/?#]+)\/([^/?#]+)/);
    if (!match) {
      return undefined;
    }
    return {
      type: decodeURIComponent(match[1]) as SpaceType,
      id: decodeURIComponent(match[2]),
    };
  }

  private readCurrentSpace(): ISpaceRef | undefined {
    try {
      const value = localStorage.getItem(CURRENT_SPACE_STORAGE_KEY);
      return value ? (JSON.parse(value) as ISpaceRef) : undefined;
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to read current space from storage');
      return undefined;
    }
  }

  private writeCurrentSpace(space: ISpaceRef): void {
    try {
      localStorage.setItem(CURRENT_SPACE_STORAGE_KEY, JSON.stringify(space));
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to write current space to storage');
    }
  }
}
