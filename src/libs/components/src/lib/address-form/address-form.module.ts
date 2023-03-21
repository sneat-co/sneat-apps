import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CountrySelectorModule } from '@sneat/components';
import { AddressFormComponent } from './address-form.component';

@NgModule({
	imports: [
		ReactiveFormsModule,
		FormsModule,
		CommonModule,
		IonicModule,
		CountrySelectorModule,
	],
	declarations: [
		AddressFormComponent,
	],
	exports: [
		AddressFormComponent,
	],
})
export class AddressFormModule {

}
