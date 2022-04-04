import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FilterItemModule } from '@sneat/components';
import { TeamCoreComponentsModule } from '@sneat/team/components';
import { ContactServiceModule } from '../../contact.service';
import { ContactListItemComponent } from './contact-list-item.component';
import { ContactsFamilyComponent } from './contacts-family.component';

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
	],
	declarations: [
		ContactsPageComponent,
		ContactsFamilyComponent,
		ContactListItemComponent,
	],
})
export class ContactsPageModule {
}
