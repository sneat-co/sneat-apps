import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';

import { HappeningCommonModule } from './happening-common.module';
import { RecurringSlotFormComponent } from './recurring-slot-form/recurring-slot-form.component';
import { HappeningSlotsComponent } from './happening-slots/happening-slots.component';
import { SingleSlotFormComponent } from './single-slot-form/single-slot-form.component';
import { StartEndDatetimeFormComponent } from './start-end-datetime-form/start-end-datetime-form.component';
import { TimeSelectorComponent } from './start-end-datetime-form/time-selector.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		HappeningCommonModule,
		SneatPipesModule,
	],
	declarations: [
		HappeningSlotsComponent,
		RecurringSlotFormComponent,
		SingleSlotFormComponent,
		StartEndDatetimeFormComponent,
		TimeSelectorComponent,
	],
	exports: [
		HappeningSlotsComponent,
		RecurringSlotFormComponent,
		SingleSlotFormComponent,
		StartEndDatetimeFormComponent,
	],
})
export class HappeningSlotComponentsModule {}
