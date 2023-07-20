import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ISelectItem } from '../selector';
import { countries, unknownCountry } from './countries';

@Component({
	selector: 'sneat-country-selector',
	templateUrl: './country-selector.component.html',
})
export class CountrySelectorComponent implements OnChanges {

	@Input() disabled = false;
	@Input() label = 'Country';
	@Input() country?: string;
	@Input() canBeUnknown = false;

	@Output() countryChange = new EventEmitter<string>();


	protected countries: ISelectItem[] = countries;

	onChanged(): void {
		console.log('CountrySelectorComponent.onChanged()', this.country);
		this.countryChange.emit(this.country);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['canBeUnknown']) {
			this.countries = this.canBeUnknown ? [...countries, unknownCountry] : countries;
		}
		if (changes['country'] && this.country === '--' && !this.canBeUnknown) {
			this.country = undefined;
		}
	}

}
