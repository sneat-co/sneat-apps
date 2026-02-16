import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CountriesLoaderService } from './countries-loader.service';
import { GeoRegion } from './countries';

describe('CountriesLoaderService', () => {
  let service: CountriesLoaderService;
  let httpClient: { get: ReturnType<typeof vi.fn> };

  const mockCountriesData = {
    countriesByID: {
      US: {
        id: 'US',
        id3: 'USA',
        title: 'United States',
        geoRegions: ['Americas', 'Northern America'] as GeoRegion[],
        emoji: '🇺🇸',
      },
      UA: {
        id: 'UA',
        id3: 'UKR',
        title: 'Ukraine',
        geoRegions: ['Europe', 'Eastern Europe'] as GeoRegion[],
        emoji: '🇺🇦',
      },
      JP: {
        id: 'JP',
        id3: 'JPN',
        title: 'Japan',
        geoRegions: ['Asia', 'Eastern Asia'] as GeoRegion[],
        emoji: '🇯🇵',
      },
    },
    unknownCountry: {
      id: '--',
      id3: '---',
      title: 'Unknown',
      geoRegions: [] as GeoRegion[],
      emoji: '🏳️',
    },
  };

  beforeEach(() => {
    httpClient = {
      get: vi.fn(() => of(mockCountriesData)),
    };

    TestBed.configureTestingModule({
      providers: [
        CountriesLoaderService,
        { provide: HttpClient, useValue: httpClient },
      ],
    });
    service = TestBed.inject(CountriesLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load countries from JSON file', async () => {
    const countries = await service.getCountries();
    expect(httpClient.get).toHaveBeenCalledWith('assets/data/countries.json');
    expect(countries.length).toBe(3);
  });

  it('should return countries by ID', async () => {
    const countriesByID = await service.getCountriesByID();
    expect(countriesByID['US']).toBeDefined();
    expect(countriesByID['US'].title).toBe('United States');
    expect(countriesByID['UA'].title).toBe('Ukraine');
  });

  it('should return specific country by ID', async () => {
    const country = await service.getCountryByID('US');
    expect(country).toBeDefined();
    expect(country?.title).toBe('United States');
    expect(country?.emoji).toBe('🇺🇸');
  });

  it('should return undefined for non-existent country', async () => {
    const country = await service.getCountryByID('XX');
    expect(country).toBeUndefined();
  });

  it('should return unknown country', async () => {
    const unknownCountry = await service.getUnknownCountry();
    expect(unknownCountry).toBeDefined();
    expect(unknownCountry.id).toBe('--');
    expect(unknownCountry.title).toBe('Unknown');
  });

  it('should filter countries by region', async () => {
    const europeanCountries = await service.getCountriesByRegion('Europe' as GeoRegion);
    expect(europeanCountries.length).toBe(1);
    expect(europeanCountries[0].id).toBe('UA');
  });

  it('should return empty array for region with no countries', async () => {
    const africaCountries = await service.getCountriesByRegion('Africa' as GeoRegion);
    expect(africaCountries.length).toBe(0);
  });

  it('should cache countries data and not reload', async () => {
    await service.getCountries();
    expect(httpClient.get).toHaveBeenCalledTimes(1);

    await service.getCountries();
    expect(httpClient.get).toHaveBeenCalledTimes(1); // Still only called once
  });

  it('should handle load error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    httpClient.get = vi.fn(() => throwError(() => new Error('Load failed')));

    const service2 = TestBed.inject(CountriesLoaderService);
    const countries = await service2.getCountries();

    expect(consoleSpy).toHaveBeenCalledWith('Failed to load countries:', expect.any(Error));
    expect(countries).toEqual([]);
    consoleSpy.mockRestore();
  });

  it('should return unknown country after load error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    httpClient.get = vi.fn(() => throwError(() => new Error('Load failed')));

    const service2 = TestBed.inject(CountriesLoaderService);
    const unknownCountry = await service2.getUnknownCountry();

    expect(unknownCountry).toBeDefined();
    expect(unknownCountry.id).toBe('--');
    consoleSpy.mockRestore();
  });

  it('should handle concurrent load requests', async () => {
    const [countries1, countries2, countries3] = await Promise.all([
      service.getCountries(),
      service.getCountriesByID(),
      service.getCountryByID('US'),
    ]);

    expect(httpClient.get).toHaveBeenCalledTimes(1); // Should only load once
    expect(countries1.length).toBe(3);
    expect(Object.keys(countries2).length).toBe(3);
    expect(countries3?.id).toBe('US');
  });
});
