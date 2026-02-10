import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GeoRegion, ICountry } from './countries';

interface CountriesData {
	countriesByID: Record<string, ICountry>;
	unknownCountry: ICountry;
}

/**
 * Service to lazy load country data.
 * This reduces the initial bundle size by loading country data on-demand.
 */
@Injectable({ providedIn: 'root' })
export class CountriesLoaderService {
	private readonly http = inject(HttpClient);
	private countriesData?: CountriesData;
	private loadPromise?: Promise<void>;

	/**
	 * Loads country data from JSON file.
	 * Subsequent calls return the same promise (singleton pattern).
	 */
	private async loadCountries(): Promise<void> {
		if (this.countriesData) {
			return; // Already loaded
		}

		if (!this.loadPromise) {
			this.loadPromise = (async () => {
				try {
					this.countriesData = await firstValueFrom(
						this.http.get<CountriesData>('assets/data/countries.json'),
					);
				} catch (error) {
					console.error('Failed to load countries:', error);
					// Set to empty to avoid repeated failures
					this.countriesData = {
						countriesByID: {},
						unknownCountry: {
							id: '--',
							id3: '---',
							title: 'Unknown',
							geoRegions: [],
							emoji: '🏳️',
						},
					};
				}
			})();
		}

		return this.loadPromise;
	}

	/**
	 * Gets all countries as an array.
	 * Automatically loads country data if not yet loaded.
	 */
	async getCountries(): Promise<readonly ICountry[]> {
		await this.loadCountries();
		return Object.values(this.countriesData!.countriesByID);
	}

	/**
	 * Gets countries by ID lookup.
	 * Automatically loads country data if not yet loaded.
	 */
	async getCountriesByID(): Promise<Record<string, ICountry>> {
		await this.loadCountries();
		return this.countriesData!.countriesByID;
	}

	/**
	 * Gets a specific country by ID.
	 * Automatically loads country data if not yet loaded.
	 */
	async getCountryByID(id: string): Promise<ICountry | undefined> {
		await this.loadCountries();
		return this.countriesData!.countriesByID[id];
	}

	/**
	 * Gets the unknown country constant.
	 * Automatically loads country data if not yet loaded.
	 */
	async getUnknownCountry(): Promise<ICountry> {
		await this.loadCountries();
		return this.countriesData!.unknownCountry;
	}

	/**
	 * Gets countries filtered by geo region.
	 * Automatically loads country data if not yet loaded.
	 */
	async getCountriesByRegion(region: GeoRegion): Promise<readonly ICountry[]> {
		const countries = await this.getCountries();
		return countries.filter((c) => c.geoRegions.includes(region));
	}
}
