import { Component, Inject } from '@angular/core';
import { ISneatAuthState, SneatAuthStateService } from '../sneat-auth-state-service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { MenuController, NavController } from '@ionic/angular';

@Component({
	selector: 'sneat-auth-menu-item',
	templateUrl: './auth-menu-item.component.html',
})
export class AuthMenuItemComponent {

	public authState?: ISneatAuthState;

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly navCtrl: NavController,
		readonly authStateService: SneatAuthStateService,
		private readonly menuController: MenuController,
	) {
		authStateService.authState.subscribe({
			next: authState => this.authState = authState,
			error: errorLogger.logErrorHandler('failed to get auth state'),
		});
	}

	public closeMenu(): void {
		this.menuController.close().catch(this.errorLogger.logErrorHandler('Failed to close menu'));
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

}
