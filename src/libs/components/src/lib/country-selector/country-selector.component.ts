import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ISelectItem } from '../selector';
import { SelectFromListModule } from '../selector/select-from-list';
import { countries, unknownCountry } from './countries';

@Component({
	selector: 'sneat-country-selector',
	templateUrl: './country-selector.component.html',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SelectFromListModule,
	],
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
