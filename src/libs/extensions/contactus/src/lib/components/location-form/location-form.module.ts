import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddressFormModule, CountrySelectorModule } from '@sneat/components';
import { LocationFormComponent } from './location-form.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		CountrySelectorModule,
		FormsModule,
		AddressFormModule,
	],
	declarations: [
		LocationFormComponent,
	],
	exports: [
		LocationFormComponent,
	],
})
export class LocationFormModule {
}
