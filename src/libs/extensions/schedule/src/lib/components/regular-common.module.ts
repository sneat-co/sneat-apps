import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {RegularSlotsComponent} from './regular-slots/regular-slots.component';
import {RegularSlotFormComponent} from './regular-slot-form/regular-slot-form.component';
import {HappeningCommonModule} from './happening-common.module';
import {IonicModule} from '@ionic/angular';
import {SharedComponentsModule} from '../../../components/shared-components.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		HappeningCommonModule,
		SharedComponentsModule,
	],
	declarations: [
		RegularSlotsComponent,
		RegularSlotFormComponent
	],
	exports: [
		RegularSlotsComponent,
		RegularSlotFormComponent
	],
})
export class RegularCommonModule {
}
