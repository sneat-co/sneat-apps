import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserCountryComponent } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { TeamsCardModule } from '@sneat/team-components';
import { UserMyProfilePageComponent } from './user-my-profile-page.component';
import { UserMyProfilePageRoutingModule } from './user-my-profile-page.routing.module';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		UserMyProfilePageRoutingModule,
		TeamsCardModule,
		UserCountryComponent,
		ContactusServicesModule,
	],
	declarations: [UserMyProfilePageComponent],
})
export class UserMyProfilePageComponentModule {
	constructor() {
		console.log('UserMyPageComponentModule.constructor()');
	}
}

console.log('UserMyPageComponentModule loaded');
