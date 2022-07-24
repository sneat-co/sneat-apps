import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DialogModule } from '@sneat/components';
import { ContactInputModule } from '@sneat/extensions/contactus';
import { NewSegmentComponent } from './new-segment.component';

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
	]
})
export class NewSegmentModule {

}
