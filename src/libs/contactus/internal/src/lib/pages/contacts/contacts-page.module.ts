import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FilterItemModule, SneatPipesModule } from '@sneat/components';
import { ContactsByTypeComponent, ContactsListModule } from '@sneat/contactus/shared';
import { TeamCoreComponentsModule } from '@sneat/team/components';

import { ContactsPageComponent } from './contacts-page.component';

const routes: Routes = [
	{
		path: '',
		component: ContactsPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		TeamCoreComponentsModule,
		FilterItemModule,
		SneatPipesModule,
		ContactsListModule,
		ContactsByTypeComponent,
	],
	declarations: [
		ContactsPageComponent,
	],
	providers: [],
})
export class ContactsPageModule {
}
