import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserAuthAccountsComponent } from '@sneat/auth-ui';
import { UserCountryComponent } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { BetaFlagsComponent } from './beta-flags.component';

@Component({
	selector: 'sneat-user-my--profile-page',
	templateUrl: 'user-my-profile-page.component.html',
	imports: [
		CommonModule,
		IonicModule,
		UserCountryComponent,
		ContactusServicesModule,
		UserAuthAccountsComponent,
		FormsModule,
		BetaFlagsComponent,
	],
})
export class UserMyProfilePageComponent {
	protected tab: 'authentication' | 'beta_testing' = 'authentication';

	constructor() {
		console.log('UserMyPageComponent.constructor()');
	}
}
