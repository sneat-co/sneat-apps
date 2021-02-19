import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {WidgetsPageRoutingModule} from './widgets-routing.module';

import {WidgetsPage} from './widgets.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		WidgetsPageRoutingModule
	],
	declarations: [WidgetsPage]
})
export class WidgetsPageModule {
}
