import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatAuthServicesModule } from '@sneat/auth';
import { AuthMenuItemComponent } from './auth-menu-item.component';

@NgModule({
	imports: [
		IonicModule,
		CommonModule,
		RouterModule,
		SneatAuthServicesModule,
	],
	declarations: [
		AuthMenuItemComponent,
	],
	exports: [
		AuthMenuItemComponent,
	],
})
export class AuthMenuItemModule {
	constructor() {
		console.log('AuthMenuItemModule.constructor()');
	}
}
