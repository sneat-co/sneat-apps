import { Pipe, PipeTransform } from '@angular/core';
import { countriesByID } from '../country-selector';

export const countryFlagEmoji = (countryID?: string): string =>
	countryID
		? countriesByID[countryID]?.emoji
		|| countryID : '';

@Pipe({ name: 'countryFlag' })
export class CountryFlagPipe implements PipeTransform {
	readonly transform = countryFlagEmoji;
}

@Pipe({ name: 'countryTitle' })
export class CountryTitle implements PipeTransform {
	transform(countryID?: string): string {
		return countryID ? countriesByID[countryID]?.title || countryID : '';
	}
}
