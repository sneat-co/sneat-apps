import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AddressFormModule, SneatPipesModule } from '@sneat/components';
import { ContactsListModule } from '../../components/contacts-list/contacts-list.module';
import { ContactServiceModule } from '../../services';

import { ContactPageComponent } from './contact-page.component';

const routes: Routes = [
	{
		path: '',
		component: ContactPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		ContactServiceModule,
		SneatPipesModule,
		ContactsListModule,
		AddressFormModule,
	],
	declarations: [
		ContactPageComponent,
	],
})
export class ContactPageModule {
}
