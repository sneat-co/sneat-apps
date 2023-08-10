import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PersonFormModule } from '@sneat/components';
import { ContactRoleFormModule } from '@sneat/contactus/shared';

import { NewContactPageComponent } from './new-contact-page.component';

const routes: Routes = [
	{
		path: '',
		component: NewContactPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		ContactRoleFormModule,
		PersonFormModule,
	],
	declarations: [NewContactPageComponent],
})
export class NewContactPageModule {
}
