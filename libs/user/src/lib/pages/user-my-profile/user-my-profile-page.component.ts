import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserMessagingAppsComponent } from '@sneat/auth-ui';
import { UserCountryComponent } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';

@Component({
	selector: 'sneat-user-my--profile-page',
	templateUrl: 'user-my-profile-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		UserCountryComponent,
		ContactusServicesModule,
		UserMessagingAppsComponent,
	],
})
export class UserMyProfilePageComponent {
	constructor() {
		console.log('UserMyPageComponent.constructor()');
	}
}
