import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PersonFormModule } from '@sneat/components';
import { ContactRoleFormModule } from '../../components/contact-role-form/contact-role-form.module';
import { ContactServiceModule } from '../../services';

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
		ContactServiceModule,
		ContactRoleFormModule,
		PersonFormModule,
	],
	declarations: [NewContactPageComponent],
})
export class NewContactPageModule {
}
