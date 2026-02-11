import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  OnDestroy,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  MenuController,
  NavController,
} from '@ionic/angular/standalone';
import {
  ISneatAuthState,
  ISneatUserState,
  SneatAuthStateService,
  SneatUserService,
} from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { Subject, takeUntil } from 'rxjs';
import { PersonNamesPipe, personNames } from '../../pipes/person-names.pipe';
@Component({
  selector: 'sneat-auth-menu-item',
  templateUrl: './auth-menu-item.component.html',
  imports: [
    RouterModule,
    PersonNamesPipe,
    IonItemDivider,
    IonLabel,
    IonItem,
    IonIcon,
    IonButtons,
    IonButton,
    JsonPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthMenuItemComponent implements OnDestroy {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly navCtrl = inject(NavController);
  private readonly authStateService = inject(SneatAuthStateService);
  private readonly menuController = inject(MenuController);

  protected readonly $user = signal<ISneatUserState | undefined>(undefined);
  protected $err = signal<unknown>(undefined);

  protected readonly $authState = signal<ISneatAuthState | undefined>(
    undefined,
  );
  protected readonly $authStatus = computed(() => this.$authState()?.status);
  protected readonly $isAuthenticating = computed(
    () => this.$authStatus() === 'authenticating',
  );

  protected readonly $destroyed = new Subject<void>();

  public ngOnDestroy(): void {
    this.$destroyed.next();
    this.$destroyed.complete();
  }

  constructor() {
    const errorLogger = this.errorLogger;
    const authStateService = this.authStateService;
    const userService = inject(SneatUserService);

    userService.userState
      .pipe(takeUntil(this.$destroyed))
      .subscribe(this.$user.set);
    authStateService.authState.pipe(takeUntil(this.$destroyed)).subscribe({
      next: this.$authState.set,
      error: (err) => {
        this.$err.set(err);
        errorLogger.logError('failed to get auth state');
      },
    });
  }

  public closeMenu(): void {
    this.menuController
      .close()
      .catch(this.errorLogger.logErrorHandler('Failed to close menu'));
  }

  public logout(event: Event): boolean {
    event.stopPropagation();
    event.preventDefault();
    try {
      this.authStateService
        .signOut()
        .then(() => {
          this.navCtrl
            .navigateBack('/signed-out')
            .catch(
              this.errorLogger.logErrorHandler(
                'Failed to navigate to signed out page',
              ),
            );
        })
        .catch(this.errorLogger.logErrorHandler('Failed to sign out'));
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to logout');
    }
    return false;
  }

  protected readonly personName = personNames;
}
