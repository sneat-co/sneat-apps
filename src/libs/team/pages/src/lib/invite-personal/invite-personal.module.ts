import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvitePersonalPageRoutingModule } from './invite-personal-routing.module';

import { InvitePersonalPage } from './invite-personal.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		InvitePersonalPageRoutingModule,
	],
	declarations: [InvitePersonalPage],
})
export class InvitePersonalPageModule {
}
