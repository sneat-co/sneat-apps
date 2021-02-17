import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {LoginPage} from './login.page';
import {LoginPageRoutingModule} from './login-routing.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		LoginPageRoutingModule, // TODO: Why we need a 2nd separate module for routing?
	],
	declarations: [LoginPage],
	exports: [LoginPage],
})
export class LoginPageModule {
}
