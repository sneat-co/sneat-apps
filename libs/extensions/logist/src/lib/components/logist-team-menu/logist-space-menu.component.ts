import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  ActivationStart,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { AuthMenuItemComponent } from '@sneat/auth-ui';
import { SpaceBaseComponent } from '@sneat/space-components';
import { ClassName } from '@sneat/ui';
import { LogistSpaceMenuItemsComponent } from '../logist-team-menu-items/logist-space-menu-items.component';

@Component({
  selector: 'sneat-logist-space-menu',
  templateUrl: './logist-space-menu.component.html',
  imports: [
    RouterModule,
    AuthMenuItemComponent,
    LogistSpaceMenuItemsComponent,
    IonList,
    IonItem,
    IonLabel,
  ],
  providers: [{ provide: ClassName, useValue: 'LogistSpaceMenuComponent' }],
})
export class LogistSpaceMenuComponent
  extends SpaceBaseComponent
  implements OnInit
{
  private readonly router = inject(Router);

  @ViewChild(RouterOutlet) outlet?: RouterOutlet;

  public constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.router.events.subscribe((e) => {
      if (e instanceof ActivationStart && e.snapshot.outlet === 'menu') {
        this.outlet?.deactivate();
      }
    });
  }
}
