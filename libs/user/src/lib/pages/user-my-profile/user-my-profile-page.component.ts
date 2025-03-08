import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserMessagingAppsComponent } from '@sneat/auth-ui';
import { UserCountryComponent } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';

@Component({
	selector: 'sneat-user-my--profile-page',
	templateUrl: 'user-my-profile-page.component.html',
	imports: [
		CommonModule,
		IonicModule,
		UserCountryComponent,
		ContactusServicesModule,
		UserMessagingAppsComponent,
		FormsModule,
	],
})
export class UserMyProfilePageComponent {
	protected tab: 'authentication' | 'beta_testing' = 'authentication';

	constructor() {
		console.log('UserMyPageComponent.constructor()');
	}
}
