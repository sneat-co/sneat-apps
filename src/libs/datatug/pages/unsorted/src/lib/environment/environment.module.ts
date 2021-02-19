import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EnvironmentPageRoutingModule} from './environment-routing.module';

import {EnvironmentPage} from './environment.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EnvironmentPageRoutingModule,
	],
	declarations: [EnvironmentPage]
})
export class EnvironmentPageModule {
}
