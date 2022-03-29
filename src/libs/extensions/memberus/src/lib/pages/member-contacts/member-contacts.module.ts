import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {MemberContactsPageComponent} from './member-contacts-page.component';

const routes: Routes = [
	{
		path: '',
		component: MemberContactsPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	declarations: [MemberContactsPageComponent]
})
export class MemberContactsPageModule {
}
