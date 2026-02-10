import { inject, Pipe, PipeTransform } from '@angular/core';
import { CountriesLoaderService } from '../country-selector';

/**
 * Base class for country-related pipes that need to cache country data.
 */
abstract class CountryDataPipe {
	protected readonly countriesLoader = inject(CountriesLoaderService);
	protected countriesCache?: Record<string, { emoji: string; title: string }>;
	protected isLoading = false;
	protected loadError = false;

	constructor() {
		// Eagerly load countries data when pipe is created
		this.loadCountriesData();
	}

	private loadCountriesData(): void {
		if (this.isLoading) return;
		this.isLoading = true;

		this.countriesLoader
			.getCountriesByID()
			.then((countries) => {
				this.countriesCache = Object.fromEntries(
					Object.entries(countries).map(([id, country]) => [
						id,
						{ emoji: country.emoji, title: country.title },
					]),
				);
			})
			.catch((error) => {
				console.error('Failed to load countries data for pipe:', error);
				this.loadError = true;
				// Set empty cache to avoid repeated load attempts
				this.countriesCache = {};
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}

export const countryFlagEmoji = (countryID?: string): string =>
	countryID && countryID !== '--' ? countryID : '';

@Pipe({ name: 'countryFlag' })
export class CountryFlagPipe extends CountryDataPipe implements PipeTransform {
	transform(countryID?: string): string {
		if (!countryID || countryID === '--') {
			return '';
		}
		// Return country emoji from cache if available, otherwise return countryID
		return this.countriesCache?.[countryID]?.emoji || countryID;
	}
}

@Pipe({ name: 'countryTitle' })
export class CountryTitle extends CountryDataPipe implements PipeTransform {
	transform(countryID?: string): string {
		if (!countryID) {
			return '';
		}
		// Return country title from cache if available, otherwise return countryID
		return this.countriesCache?.[countryID]?.title || countryID;
	}
}

