import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TeamsCardModule } from '@sneat/team/components';
import { UserMyProfilePageComponent } from './user-my-profile-page.component';
import { UserMyProfilePageRoutingModule } from './user-my-profile-page.routing.module';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		UserMyProfilePageRoutingModule,
		TeamsCardModule,
	],
	declarations: [
		UserMyProfilePageComponent,
	],
})
export class UserMyProfilePageComponentModule {
	constructor() {
		console.log('UserMyPageComponentModule.constructor()');
	}
}

console.log('UserMyPageComponentModule loaded');
