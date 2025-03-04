import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	Inject,
	OnDestroy,
	signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
	ISneatAuthState,
	ISneatUserState,
	SneatAuthStateService,
	SneatUserService,
} from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IonicModule, MenuController, NavController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { personName, SneatPipesModule } from '../pipes';

@Component({
	selector: 'sneat-auth-menu-item',
	templateUrl: './auth-menu-item.component.html',
	imports: [IonicModule, CommonModule, RouterModule, SneatPipesModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthMenuItemComponent implements OnDestroy {
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

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly navCtrl: NavController,
		private readonly authStateService: SneatAuthStateService,
		private readonly menuController: MenuController,
		userService: SneatUserService,
	) {
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

	protected readonly personName = personName;
}
