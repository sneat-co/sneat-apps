import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISelectItem } from '../selector';
import { countries } from './countries';

@Component({
	selector: 'sneat-country-selector',
	templateUrl: './country-selector.component.html',
})
export class CountrySelectorComponent {

	@Input() disabled = false;
	@Input() label = 'Country';
	@Input() country?: string;
	@Output() countryChange = new EventEmitter<string>();

	readonly countries: ISelectItem[] = countries;

	onChanged(): void {
		console.log('CountrySelectorComponent.onChanged()', this.country);
		this.countryChange.emit(this.country);
	}

}
