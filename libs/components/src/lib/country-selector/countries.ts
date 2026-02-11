export type GeoRegion =
  | 'Europe'
  | 'Asia'
  | 'Americas'
  | 'South America'
  | 'North America'
  | 'Pacific Ocean'
  | 'Africa';

export interface ICountry {
  id: string;
  id3: string;
  geoRegions: GeoRegion[];
  title: string;
  longTitle?: string;
  shortTitle?: string;
  emoji: string;
}

/**
 * @deprecated Use CountriesLoaderService.getCountriesByID() instead.
 * Country data is now lazy-loaded to reduce bundle size.
 */
export const countriesByID: Record<string, ICountry> = {};

/**
 * @deprecated Use CountriesLoaderService.getUnknownCountry() instead.
 * Country data is now lazy-loaded to reduce bundle size.
 */
export const unknownCountry: ICountry = {
  id: '--',
  id3: '---',
  title: 'Unknown',
  geoRegions: [],
  emoji: '🏳️',
};

/**
 * @deprecated Use CountriesLoaderService.getCountries() instead.
 * Country data is now lazy-loaded to reduce bundle size.
 */
export const countries: ICountry[] = [];
