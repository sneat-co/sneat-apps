import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ContactServiceModule } from '../../contact.service';

import {ContactPageComponent} from './contact-page.component';

const routes: Routes = [
	{
		path: '',
		component: ContactPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		ContactServiceModule,
		SneatPipesModule,
	],
	declarations: [ContactPageComponent]
})
export class ContactPageModule {
}
