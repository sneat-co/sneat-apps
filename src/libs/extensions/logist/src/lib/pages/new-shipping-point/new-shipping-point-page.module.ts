import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NewSegmentPageComponent } from '../new-segment/new-segment-page.component';
import { NewShippingPointPageComponent } from './new-shipping-point-page.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: NewSegmentPageComponent,
			},
		]),
	],
	declarations: [
		NewShippingPointPageComponent,
	],
})
export class NewShippingPointPageModule {

}
