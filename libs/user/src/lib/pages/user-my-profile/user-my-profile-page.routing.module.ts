import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserMyProfilePageComponent } from './user-my-profile-page.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{path: '', pathMatch: 'full', component: UserMyProfilePageComponent},
		]),
	],
})
export class UserMyProfilePageRoutingModule {
	constructor() {
		console.log('UserMyProfilePageRoutingModule.constructor()');
	}
}
console.log('UserMyProfilePageRoutingModule loaded');
