import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EnvironmentsPageRoutingModule} from './environments-routing.module';

import {EnvironmentsPage} from './environments.page';
import {SneatCardListModule} from '@sneat/components/card-list';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EnvironmentsPageRoutingModule,
		SneatCardListModule,
	],
	declarations: [EnvironmentsPage]
})
export class EnvironmentsPageModule {
}
