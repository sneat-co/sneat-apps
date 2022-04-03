import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoginRequiredComponent } from './login-required.component';

@NgModule({
	imports: [
		IonicModule,
		CommonModule,
		RouterModule,
	],
	declarations: [
		LoginRequiredComponent,
	],
	exports: [
		LoginRequiredComponent,
	],
})
export class LoginRequiredComponentModule {
	constructor() {
		console.log('LoginRequiredComponentModule.constructor()');
	}
}
