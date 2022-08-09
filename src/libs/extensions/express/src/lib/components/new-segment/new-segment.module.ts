import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderModule } from '@sneat/components';
import { ContactInputModule } from '@sneat/extensions/contactus';
import { OrderNavServiceModule } from '../..';
import { OrderContainersSelectorModule } from '../order-containers-selector/order-containers-selector.module';
import { OrderFormModule } from '../order-form.module';
import { NewSegmentDialogComponent } from './new-segment-dialog.component';
import { NewSegmentFormComponent } from './new-segment-form.component';
import { NewSegmentService } from './new-segment.service';
import { SegmentCounterpartyComponent } from './segment-counterparty.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		DialogHeaderModule,
		ContactInputModule,
		FormsModule,
		OrderFormModule,
		OrderContainersSelectorModule,
		OrderNavServiceModule,
	],
	declarations: [
		NewSegmentFormComponent,
		NewSegmentDialogComponent,
		SegmentCounterpartyComponent,
	],
	exports: [
		NewSegmentFormComponent,
		NewSegmentDialogComponent,
	],
	providers: [
		NewSegmentService,
	],
})
export class NewSegmentModule {
}
