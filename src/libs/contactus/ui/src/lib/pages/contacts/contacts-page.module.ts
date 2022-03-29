import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ContactsPageComponent} from './contacts-page.component';
import {ContactsFamilyComponent} from './contacts-family.component';
import {ContactListItemComponent} from './contact-list-item.component';
import {SharedComponentsModule} from '../../../../components/shared-components.module';

const routes: Routes = [
	{
		path: '',
		component: ContactsPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		SharedComponentsModule,
	],
	declarations: [
		ContactsPageComponent,
		ContactsFamilyComponent,
		ContactListItemComponent,
	]
})
export class ContactsPageModule {
}
