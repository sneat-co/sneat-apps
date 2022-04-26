import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';

import { HappeningCommonModule } from './happening-common.module';
import { RecurringSlotFormComponent } from './recurring-slot-form/recurring-slot-form.component';
import { RecurringSlotsComponent } from './recurring-slots/recurring-slots.component';
import { SingleSlotFormComponent } from './single-slot-form/single-slot-form.component';
import { StartEndDatetimeFormComponent } from './start-end-datetime-form/start-end-datetime-form.component';

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
		RecurringSlotsComponent,
		RecurringSlotFormComponent,
		SingleSlotFormComponent,
		StartEndDatetimeFormComponent,
	],
	exports: [
		RecurringSlotsComponent,
		RecurringSlotFormComponent,
		SingleSlotFormComponent,
		StartEndDatetimeFormComponent,
	],
})
export class RecurringCommonModule {
}
