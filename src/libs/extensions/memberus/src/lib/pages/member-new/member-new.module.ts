import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {MemberNewPageComponent} from './member-new-page.component';

const routes: Routes = [
	{
		path: '',
		component: MemberNewPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	declarations: [MemberNewPageComponent]
})
export class MemberNewPageModule {
}
