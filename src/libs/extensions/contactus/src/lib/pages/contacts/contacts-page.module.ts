import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FilterItemModule, SneatPipesModule } from '@sneat/components';
import { TeamCoreComponentsModule } from '@sneat/team/components';
import { ContactsListModule } from '../../components/contacts-list/contacts-list.module';
import { ContactServiceModule } from '../../services';
import { ContactsByTypeComponent } from '../../components/contacts-by-type/contacts-by-type.component';

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
		ContactServiceModule,
		SneatPipesModule,
		ContactsListModule,
	],
	declarations: [
		ContactsPageComponent,
		ContactsByTypeComponent,
	],
	providers: [],
})
export class ContactsPageModule {
}
