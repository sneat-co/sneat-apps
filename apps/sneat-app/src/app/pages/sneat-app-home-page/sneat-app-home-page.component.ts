import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	Inject,
	signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthStatus, SneatAuthStateService } from '@sneat/auth-core';
import { UserCountryComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { SneatBaseComponent } from '@sneat/ui';
import { takeUntil } from 'rxjs';
import { ForEducatorsComponent } from './for-educators.component';
import { ForFamiliesComponent } from './for-families.component';
import { ForWorkComponent } from './for-work.component';

@Component({
	// Do not make it standalone component,
	// as it requires few other components specific just to this page
	selector: 'sneat-sneat-app-home-page',
	templateUrl: './sneat-app-home-page.component.html',
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		UserCountryComponent,
		ForFamiliesComponent,
		ForEducatorsComponent,
		ForWorkComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SneatAppHomePageComponent extends SneatBaseComponent {
	protected readonly $authStatus = signal<AuthStatus | undefined>(undefined);
	protected readonly $isAuthenticated = computed(
		() => this.$authStatus() === 'authenticated',
	);

	protected readonly url: string = location.href;

	protected readonly $err = signal<unknown>(undefined);

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		authStateService: SneatAuthStateService,
		router: Router,
	) {
		super('SneatAppHomePageComponent', errorLogger);
		authStateService.authState.pipe(takeUntil(this.destroyed$)).subscribe({
			next: (authState) => {
				this.$authStatus.set(authState.status);
				if (authState.status === 'notAuthenticated') {
					router.navigate(['login']).catch((err) => {
						this.$err.set(err);
						errorLogger.logError(err, 'Failed to navigate to login page');
					});
				} else if (authState.err) {
					this.$err.set(authState.err);
				}
			},
			error: (err) => {
				this.$err.set(err);
				errorLogger.logError(err, 'Failed to get authState');
			},
		});
	}
}
