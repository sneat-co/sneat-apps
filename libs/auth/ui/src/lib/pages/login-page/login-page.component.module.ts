import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { EmailLoginFormComponent } from './email-login-form/email-login-form.component';

import { LoginPageComponent } from './login-page.component';
import { LoginPageRoutingModule } from './login-page.routing.module';
import { LoginWithTelegramComponent } from './login-with-telegram.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		LoginPageRoutingModule, // TODO: Why we need a 2nd separate module for routing?
		LoginWithTelegramComponent,
	],
	declarations: [LoginPageComponent, EmailLoginFormComponent],
	exports: [LoginPageComponent],
})
export class LoginPageComponentModule {}
