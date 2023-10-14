import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvitePersonalPageRoutingModule } from './invite-personal-routing.module';

import { InvitePersonalPageComponent } from './invite-personal-page.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		InvitePersonalPageRoutingModule,
	],
	declarations: [InvitePersonalPageComponent],
})
export class InvitePersonalPageModule {
}
