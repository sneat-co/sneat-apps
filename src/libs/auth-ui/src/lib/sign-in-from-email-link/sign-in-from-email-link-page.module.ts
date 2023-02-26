import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SignInFromEmailLinkPageComponent } from './sign-in-from-email-link-page.component';
import { SignInFromEmailLinkPageRoutingModule } from './sign-in-from-email-link-page.routing';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		SignInFromEmailLinkPageRoutingModule,
	],
	declarations: [
		SignInFromEmailLinkPageComponent,
	],
})
export class SignInFromEmailLinkPageModule {

}
