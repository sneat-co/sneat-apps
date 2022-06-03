import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserMyPageComponent } from './user-my-page.component';
import { UserMyPageRoutingModule } from './user-my-page.routing.module';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		UserMyPageRoutingModule,
	],
	declarations: [
		UserMyPageComponent,
	],
})
export class UserMyPageComponentModule {
	constructor() {
		console.log('UserMyPageComponentModule.constructor()');
	}
}

console.log('UserMyPageComponentModule loaded');
