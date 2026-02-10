# components

This library was generated with [Nx](https://nx.dev).

## Features

- Country selector and input components
- Country data (lazy-loaded)
- Country emoji pipes

## Country Data

The country data is now lazy-loaded to reduce bundle size. Use `CountriesLoaderService` to access country information:

```typescript
import { CountriesLoaderService } from '@sneat/components';

// In your component
constructor(private countriesLoader: CountriesLoaderService) {}

async ngOnInit() {
  const countries = await this.countriesLoader.getCountries();
  const usCountry = await this.countriesLoader.getCountryByID('US');
}
```

The deprecated synchronous constants (`countries`, `countriesByID`, `unknownCountry`) are now empty arrays/objects. All components in this library have been updated to use the async loader.

**Note:** This requires `HttpClient` to be provided in your application. The country data (~2200 lines) is loaded from `assets/data/countries.json` on first use.

## Running unit tests

Run `nx test components` to execute the unit tests.
