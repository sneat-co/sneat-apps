import { Pipe, PipeTransform } from '@angular/core';
import { IName } from '@sneat/dto';
import { IPersonContext } from '@sneat/team/models';

const flags: {[id: string]: string} = {
	'au': '🇦🇺',
	'es': '🇪🇸',
	'ie': '🇮🇪',
	'nz': '🇳🇿',
	'ru': '🇷🇺',
	'ua': '🇺🇦',
	'uk': '🇬🇧',
	'us': '🇺🇸',
}
export function countryEmoji(countryID?: string): string {
	if (countryID) {
		return flags[countryID] || countryID;
	}
	return '';
}

@Pipe({ name: 'countryEmoji' })
export class CountryEmoji implements PipeTransform {
	transform(countryID?: string): string {
		return countryEmoji(countryID);
	}
}
