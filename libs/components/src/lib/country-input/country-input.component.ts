import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { countries } from '../country-selector';

@Component({
	selector: 'sneat-country-input',
	templateUrl: './country-input.component.html',
	imports: [CommonModule, FormsModule, IonicModule],
})
export class CountryInputComponent {
	@Input() canReset = true;
	@Input() label = 'Country';
	@Input() countryID = '';
	@Output() countryIDChange = new EventEmitter<string>();

	readonly countries = countries;

	// constructor(
	// 	// private readonly countrySelectorService: CountrySelectorService,
	// ) {
	// }

	public onCountryChanged(): void {
		console.log('CountryInputComponent.onCountryChanged()', this.countryID);
		this.countryIDChange.emit(this.countryID);
	}

	reset(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.countryID = '';
		this.countryIDChange.emit('');
	}

	// protected openCountrySelector(): void {
	// 	// const options: ISelectorOptions<ICountry> = {
	// 	// 	items: of(countries),
	// 	// };
	// 	// this.countrySelectorService
	// 	// 	.selectSingleInModal(options)
	// 	// 	.then();
	// }
}
