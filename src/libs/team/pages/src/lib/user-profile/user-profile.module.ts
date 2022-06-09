import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePageComponent } from './user-profile-page.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		UserProfilePageRoutingModule,
		ReactiveFormsModule,
	],
	declarations: [UserProfilePageComponent],
})
export class UserProfilePageModule {
}

