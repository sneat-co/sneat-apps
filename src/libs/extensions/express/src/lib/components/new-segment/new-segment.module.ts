import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DialogModule } from '@sneat/components';
import { ContactInputModule } from '@sneat/extensions/contactus';
import { NewSegmentComponent } from './new-segment.component';
import { NewSegmentService } from './new-segment.service';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		DialogModule,
		ContactInputModule,
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
