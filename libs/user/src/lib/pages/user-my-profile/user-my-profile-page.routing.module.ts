import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { UserMyProfilePageComponent } from './user-my-profile-page.component';

@NgModule({
	imports: [
		ContactusServicesModule,
		RouterModule.forChild([
			{ path: '', pathMatch: 'full', component: UserMyProfilePageComponent },
		]),
	],
})
export class UserMyProfilePageRoutingModule {
	constructor() {
		console.log('UserMyProfilePageRoutingModule.constructor()');
	}
}
console.log('UserMyProfilePageRoutingModule loaded');
