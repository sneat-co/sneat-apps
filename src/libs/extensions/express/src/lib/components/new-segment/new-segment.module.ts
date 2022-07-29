import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderModule } from '@sneat/components';
import { ContactInputModule } from '@sneat/extensions/contactus';
import { OrderFormModule } from '../order-form.module';
import { NewSegmentComponent } from './new-segment.component';
import { NewSegmentService } from './new-segment.service';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		DialogHeaderModule,
		ContactInputModule,
		FormsModule,
		OrderFormModule,
	],
	declarations: [
		NewSegmentComponent,
	],
	exports: [
		NewSegmentComponent,
	],
	providers: [
		NewSegmentService,
	]
})
export class NewSegmentModule {
}
