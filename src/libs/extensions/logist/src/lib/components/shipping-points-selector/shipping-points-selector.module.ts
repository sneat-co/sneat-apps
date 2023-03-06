import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ShippingPointsSelectorComponent } from './shipping-points-selector.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
	],
	declarations: [
		ShippingPointsSelectorComponent,
	],
	exports: [
		ShippingPointsSelectorComponent,
	]
})
export class ShippingPointsSelectorModule {

}
