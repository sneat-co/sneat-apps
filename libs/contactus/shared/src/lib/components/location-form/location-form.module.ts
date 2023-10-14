import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
	AddressFormComponent,
	CountrySelectorComponent,
} from '@sneat/components';
import { LocationFormComponent } from './location-form.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		CountrySelectorComponent,
		FormsModule,
		AddressFormComponent,
		ReactiveFormsModule,
	],
	declarations: [LocationFormComponent],
	exports: [LocationFormComponent],
})
export class LocationFormModule {}
