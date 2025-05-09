import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonSelect,
	IonSelectOption,
} from '@ionic/angular/standalone';
import { countries } from '../country-selector';

@Component({
	selector: 'sneat-country-input',
	templateUrl: './country-input.component.html',
	imports: [
		FormsModule,
		IonItem,
		IonSelect,
		IonSelectOption,
		IonButtons,
		IonButton,
		IonIcon,
	],
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
