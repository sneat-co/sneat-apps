import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {LoginPageComponent} from './login-page.component';
import {LoginPageRoutingModule} from './login-page.routing.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		LoginPageRoutingModule, // TODO: Why we need a 2nd separate module for routing?
	],
	declarations: [LoginPageComponent],
	exports: [LoginPageComponent],
})
export class LoginPageComponentModule {
}
