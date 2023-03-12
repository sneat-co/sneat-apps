import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShippingPointsSelectorComponent } from './shipping-points-selector.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
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
