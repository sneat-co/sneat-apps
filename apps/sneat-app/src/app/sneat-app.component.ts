import { Component, computed, inject } from '@angular/core';
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
import { filter, map } from 'rxjs';
import { SneatAppMenuComponent } from './sneat-app-menu-component/sneat-app-menu.component';

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

  private readonly currentUrl = toSignal(
    this.appRouter.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.appRouter.url },
  );

  // When on a space route, render the space-specific side menu via the named outlet.
  protected readonly showRouteMenu = computed(() =>
    this.currentUrl().startsWith('/space/'),
  );
}
