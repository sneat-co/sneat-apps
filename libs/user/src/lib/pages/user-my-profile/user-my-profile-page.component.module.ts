import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserMessagingAppsComponent } from '@sneat/auth-ui';
import { UserCountryComponent } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { SpacesCardModule } from '@sneat/team-components';
import { UserMyProfilePageComponent } from './user-my-profile-page.component';
import { UserMyProfilePageRoutingModule } from './user-my-profile-page.routing.module';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		UserMyProfilePageRoutingModule,
		SpacesCardModule,
		UserCountryComponent,
		ContactusServicesModule,
		UserMessagingAppsComponent,
	],
	declarations: [UserMyProfilePageComponent],
})
export class UserMyProfilePageComponentModule {
	constructor() {
		console.log('UserMyPageComponentModule.constructor()');
	}
}

console.log('UserMyPageComponentModule loaded');
