import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderModule } from '@sneat/components';
import { ShippingPintsSelectorDialogComponent } from './shipping-pints-selector-dialog.component';
import { ShippingPointsSelectorComponent } from './shipping-points-selector.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		DialogHeaderModule,
	],
	declarations: [
		ShippingPintsSelectorDialogComponent,
		ShippingPointsSelectorComponent,
	],
	exports: [
		ShippingPintsSelectorDialogComponent,
		ShippingPointsSelectorComponent,
	],
})
export class ShippingPointsSelectorModule {

}
