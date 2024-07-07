import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthStatus, SneatAuthStateService } from '@sneat/auth-core';
import { UserCountryComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { TeamsListComponent } from '@sneat/team-components';
import { SneatBaseComponent } from '@sneat/ui';
import { takeUntil } from 'rxjs';
import { ForTeamTypeCardComponent } from '../../components/for-team-type-card.component';
import { ForEducatorsComponent } from './for-educators.component';
import { ForFamiliesComponent } from './for-families.component';
import { ForWorkComponent } from './for-work.component';

@Component({
	// Do not make it standalone component,
	// as it requires few other components specific just to this page
	selector: 'sneat-sneat-app-home-page',
	templateUrl: './sneat-app-home-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		TeamsListComponent,
		UserCountryComponent,
		ForTeamTypeCardComponent,
		ForFamiliesComponent,
		ForEducatorsComponent,
		ForWorkComponent,
	],
})
export class SneatAppHomePageComponent extends SneatBaseComponent {
	protected readonly authStatus = signal<AuthStatus | undefined>(undefined);

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		authStateService: SneatAuthStateService,
		// navService: NavService,
	) {
		super('SneatAppHomePageComponent', errorLogger);
		authStateService.authState.pipe(takeUntil(this.destroyed$)).subscribe({
			next: (authState) => {
				this.authStatus.set(authState.status);
				// if (authState.status === 'notAuthenticated') {
				// 	navService.navigateToLogin();
				// }
			},
		});
	}
}
