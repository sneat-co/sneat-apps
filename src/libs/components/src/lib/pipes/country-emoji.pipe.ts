import { Pipe, PipeTransform } from '@angular/core';
import { countriesByID } from '../country-selector';

export function countryFlagEmoji(countryID?: string): string {
	return countryID ? countriesByID[countryID]?.emoji || countryID : '';
}

@Pipe({ name: 'countryFlag' })
export class CountryFlagPipe implements PipeTransform {
	transform(countryID?: string): string {
		return countryFlagEmoji(countryID);
	}
}

@Pipe({ name: 'countryTitle' })
export class CountryTitle implements PipeTransform {
	transform(countryID?: string): string {
		return countryID ? countriesByID[countryID]?.title || countryID : '';
	}
}
