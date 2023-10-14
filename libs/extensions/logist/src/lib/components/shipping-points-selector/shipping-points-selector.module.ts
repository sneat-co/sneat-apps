import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderComponent } from '@sneat/components';
import { LogistOrderServiceModule } from '../../services';
import { NewShippingPointModule } from '../new-shipping-point';
import { ShippingPointsSelectorDialogComponent } from './shipping-points-selector-dialog.component';
import { ShippingPointsSelectorComponent } from './shipping-points-selector.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		DialogHeaderComponent,
		NewShippingPointModule,
		LogistOrderServiceModule,
	],
	declarations: [
		ShippingPointsSelectorDialogComponent,
		ShippingPointsSelectorComponent,
	],
	exports: [
		ShippingPointsSelectorDialogComponent,
		ShippingPointsSelectorComponent,
	],
})
export class ShippingPointsSelectorModule {

}
