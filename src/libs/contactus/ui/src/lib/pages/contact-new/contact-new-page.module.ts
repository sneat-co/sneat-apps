import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ContactNewPageComponent} from './contact-new-page.component';

const routes: Routes = [
	{
		path: '',
		component: ContactNewPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	declarations: [ContactNewPageComponent]
})
export class ContactNewPageModule {
}
