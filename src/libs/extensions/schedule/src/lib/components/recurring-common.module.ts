import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';

import { HappeningCommonModule } from './happening-common.module';
import { RecurringSlotFormComponent } from './recurring-slot-form/recurring-slot-form.component';
import { RecurringSlotsComponent } from './recurring-slots/recurring-slots.component';
import { SingleSlotFormComponent } from './single-slot-form/single-slot-form.component';

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
	],
	exports: [RecurringSlotsComponent, RecurringSlotFormComponent],
})
export class RecurringCommonModule {}
