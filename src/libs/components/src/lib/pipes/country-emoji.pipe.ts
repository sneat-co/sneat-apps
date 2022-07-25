import { Pipe, PipeTransform } from '@angular/core';
import { countriesByID } from '../country-selector';

export function countryEmoji(countryID?: string): string {
	if (countryID) {
		return countriesByID[countryID].emoji || countryID;
	}
	return '';
}

@Pipe({ name: 'countryEmoji' })
export class CountryEmoji implements PipeTransform {
	transform(countryID?: string): string {
		return countryEmoji(countryID);
	}
}

@Pipe({ name: 'countryTitle' })
export class CountryTitle implements PipeTransform {
	transform(countryID?: string): string {
		return countryID ? countriesByID[countryID].title || countryID : '';
	}
}
