import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CountrySelectorModule } from '../country-selector';
import { CountryInputComponent } from './country-input.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CountrySelectorModule,
	],
	declarations: [
		CountryInputComponent,
	],
	exports: [
		CountryInputComponent,
	],
})
export class CountryInputModule {

}
