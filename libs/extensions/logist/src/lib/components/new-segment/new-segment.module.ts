import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderComponent } from '@sneat/components';
import { ContactInputModule } from '@sneat/contactus-shared';
import { OrderNavServiceModule } from '../../services';
import { OrderContainersSelectorModule } from '../order-containers-selector/order-containers-selector.module';
import { OrderFormModule } from '../order-form.module';
import { ContactWithRefNumModule } from '../contact-with-refnum/contact-with-ref-num.module';
import { NewSegmentDialogComponent } from './new-segment-dialog.component';
import { NewSegmentFormComponent } from './new-segment-form.component';
import { NewSegmentService } from './new-segment.service';
import { SegmentCounterpartyComponent } from './segment-counterparty.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DialogHeaderComponent,
    ContactInputModule,
    FormsModule,
    OrderFormModule,
    OrderContainersSelectorModule,
    OrderNavServiceModule,
		ContactWithRefNumModule,
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
