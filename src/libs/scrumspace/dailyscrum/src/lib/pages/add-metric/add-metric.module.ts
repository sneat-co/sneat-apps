import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AddMetricPageRoutingModule} from './add-metric-routing.module';

import {AddMetricPage} from './add-metric.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		AddMetricPageRoutingModule
	],
	declarations: [AddMetricPage]
})
export class AddMetricPageModule {
}
