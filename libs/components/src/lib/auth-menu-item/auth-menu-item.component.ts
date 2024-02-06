import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
	ISneatAuthState,
	ISneatUserState,
	SneatAuthStateService,
	SneatUserService,
} from '@sneat/auth-core';
import { gitHash } from '../app-version/git-version';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IonicModule, MenuController, NavController } from '@ionic/angular';
import { personName, SneatPipesModule } from '../pipes';

@Component({
	selector: 'sneat-auth-menu-item',
	templateUrl: './auth-menu-item.component.html',
	standalone: true,
	imports: [IonicModule, CommonModule, RouterModule, SneatPipesModule],
})
export class AuthMenuItemComponent {
	protected readonly gitHash2 = gitHash;

	public authState?: ISneatAuthState;

	protected user?: ISneatUserState;

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly navCtrl: NavController,
		private readonly authStateService: SneatAuthStateService,
		private readonly userService: SneatUserService,
		private readonly menuController: MenuController,
	) {
		userService.userState.subscribe({
			next: (userState) => {
				this.user = userState;
			},
		});
		authStateService.authState.subscribe({
			next: (authState) => (this.authState = authState),
			error: errorLogger.logErrorHandler('failed to get auth state'),
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
