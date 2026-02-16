import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  MenuController,
} from '@ionic/angular/standalone';
import { ISneatUserState } from '@sneat/auth-core';
import { IUserSpaceBrief } from '@sneat/auth-models';
import { AuthMenuItemComponent } from '@sneat/auth-ui';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { IIdAndBrief } from '@sneat/core';
import { zipMapBriefsWithIDs } from '@sneat/space-models';
import { SpaceServiceModule } from '@sneat/space-services';
import { filter } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpaceBaseComponent } from '../space-base-component.directive';
import { SpaceComponentBaseParams } from '../space-component-base-params.service';
import { ClassName } from '@sneat/ui';

@Component({
  selector: 'sneat-space-menu',
  templateUrl: './space-menu.component.html',
  styles: '.currentPage ion-label {font-weight: bold}',
  imports: [
    AuthMenuItemComponent,
    ContactusServicesModule,
    SpaceServiceModule,
    TitleCasePipe,
    RouterLink,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonLabel,
    IonButtons,
    IonButton,
  ],
  providers: [
    {
      provide: ClassName,
      useValue: 'SpaceMenuComponent',
    },
    SpaceComponentBaseParams,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaceMenuComponent extends SpaceBaseComponent {
  protected readonly $spaces = signal<
    readonly IIdAndBrief<IUserSpaceBrief>[] | undefined
  >(undefined);

  protected readonly $disabled = computed(() => !this.$spaceID());

  protected readonly $currentPage = signal<string>('');

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly menuCtrl = inject(MenuController);

  constructor() {
    const router = inject(Router);

    super();
    this.spaceParams.userService.userState
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: this.onUserStateChanged,
        error: this.errorLogger.logErrorHandler('failed to get user stage'),
      });
    router.events
      .pipe(
        this.takeUntilDestroyed(),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        const url = event.urlAfterRedirects.split('/');
        this.$currentPage.set(url.length > 4 ? url[4] : '');
      });
  }

  // TODO: Should we use goSpacePage('') instead?
  protected goOverview(): boolean {
    const space = this.$space();
    if (!space) {
      this.errorLogger.logError('no space context');
      return false;
    }
    this.spaceParams.spaceNavService.navigateToSpace(space).then((v) => {
      if (v) {
        this.closeMenu();
      }
    });
    return false;
  }

  protected goSpacePage(event: Event, p: string): boolean {
    // At the moment we use routerLink for navigation
    event.stopPropagation();
    // event.preventDefault();
    this.closeMenu();
    return false;
  }

  protected closeMenu(): void {
    this.menuCtrl.close().catch(this.errorLogger.logError);
  }

  protected onSpaceSelected(event: Event): void {
    const spaceID = (event as CustomEvent).detail.value as string;
    if (spaceID === this.space?.id) {
      return;
    }
    const space = this.$spaces()?.find((t) => t.id === spaceID);
    if (space) {
      this.setSpaceRef(space);
      this.spaceNav
        .navigateToSpace(space)
        .catch(
          this.errorLogger.logErrorHandler(
            'Failed to navigate to teams page on current team changed from team menu dropdown',
          ),
        );
    }
    this.menuCtrl.close().catch(console.error);
    return;
  }

  private readonly onUserStateChanged = (userState: ISneatUserState): void => {
    this.$spaces.set(
      userState?.record
        ? zipMapBriefsWithIDs(userState.record.spaces) || []
        : undefined,
    );
  };
}
