import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISelectItem } from '../select-from-list/select-from-list.component';

@Component({
	selector: 'sneat-country-selector',
	templateUrl: './country-selector.component.html',
})
export class CountrySelectorComponent {

	@Input() disabled = false;
	@Input() label = 'Country';
	@Input() country?: string;
	@Output() countryChange = new EventEmitter<string>();

	readonly countries: ISelectItem[] = [
		{id: 'au', title: 'Australia', emoji: '🇦🇺'},
		{id: 'ie', title: 'Ireland', emoji: '🇮🇪'},
		{id: 'nz', title: 'New Zealand', emoji: '🇳🇿'},
		{id: 'ru', title: 'Russia', emoji: '🇷🇺'},
		{id: 'es', title: 'Spain', emoji: '🇪🇸'},
		{id: 'uk', title: 'United Kingdom', emoji: '🇬🇧'},
		{id: 'ua', title: 'Ukraine', emoji: '🇺🇦'},
		{id: 'us', title: 'United States Of America', emoji: '🇺🇸'},
	];

	onChanged(): void {
		console.log('CountrySelectorComponent.onChanged()', this.country);
		this.countryChange.emit(this.country);
	}

}
