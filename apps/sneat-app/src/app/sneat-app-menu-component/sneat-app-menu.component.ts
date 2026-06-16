import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import {
  IonItem,
  IonLabel,
  IonList,
  ModalController,
} from '@ionic/angular/standalone';
import { SneatAuthStateService } from '@sneat/auth-core';
import { AuthMenuItemComponent } from '@sneat/auth-ui';
import { AppVersionComponent } from '@sneat/components';
import { SpacesMenuComponent } from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';
import { filter } from 'rxjs';

@Component({
  selector: 'sneat-app-menu',
  templateUrl: './sneat-app-menu.component.html',
  providers: [ModalController],
  imports: [
    SpacesMenuComponent,
    AuthMenuItemComponent,
    AppVersionComponent,
    IonItem,
    IonLabel,
    IonList,
    SpaceServiceModule,
  ],
})
export class SneatAppMenuComponent {
  private readonly authStateService = inject(SneatAuthStateService);
  private readonly router = inject(Router);

  // Signal-backed so the menu renders reactively under zoneless change
  // detection — fixes the empty side-menu on large screens and the
  // NG0100 ExpressionChangedAfterItHasBeenChecked error.
  protected readonly authState = toSignal(this.authStateService.authState);

  protected readonly isLoginPage = signal(false);

  constructor() {
    this.isLoginPage.set(this.router.url === '/login');

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.isLoginPage.set(
          (e as NavigationEnd).urlAfterRedirects === '/login',
        );
      });
  }
}
