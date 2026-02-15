import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CountryFlagPipe, CountryTitle } from './country-emoji.pipe';
import { CountriesLoaderService } from '../country-selector';

describe('Country pipes', () => {
  let countriesLoader: { getCountriesByID: () => Promise<unknown> };
  const mockCountries = {
    US: { emoji: '🇺🇸', title: 'United States' },
    UA: { emoji: '🇺🇦', title: 'Ukraine' },
  };

  beforeEach(() => {
    countriesLoader = {
      getCountriesByID: vi.fn().mockReturnValue(Promise.resolve(mockCountries)),
    };

    TestBed.configureTestingModule({
      providers: [
        CountryFlagPipe,
        CountryTitle,
        {
          provide: CountriesLoaderService,
          useValue: countriesLoader,
        },
      ],
    });
  });

  describe('CountryFlagPipe', () => {
    it('should create', () => {
      expect(TestBed.inject(CountryFlagPipe)).toBeTruthy();
    });

    it('should return empty string for empty input', () => {
      const pipe = TestBed.inject(CountryFlagPipe);
      expect(pipe.transform('')).toBe('');
      expect(pipe.transform('--')).toBe('');
    });

    it('should return countryID when cache is not yet loaded', () => {
      const pipe = TestBed.inject(CountryFlagPipe);
      expect(pipe.transform('US')).toBe('US');
    });

    it('should return emoji when cache is loaded', fakeAsync(() => {
      const pipe = TestBed.inject(CountryFlagPipe);
      tick(); // resolve promise
      expect(pipe.transform('US')).toBe('🇺🇸');
      expect(pipe.transform('UA')).toBe('🇺🇦');
    }));

    it('should return countryID for unknown country', fakeAsync(() => {
      const pipe = TestBed.inject(CountryFlagPipe);
      tick();
      expect(pipe.transform('XX')).toBe('XX');
    }));
  });

  describe('CountryTitle', () => {
    it('should create', () => {
      expect(TestBed.inject(CountryTitle)).toBeTruthy();
    });

    it('should return empty string for empty input', () => {
      const pipe = TestBed.inject(CountryTitle);
      expect(pipe.transform('')).toBe('');
    });

    it('should return countryID when cache is not yet loaded', () => {
      const pipe = TestBed.inject(CountryTitle);
      expect(pipe.transform('US')).toBe('US');
    });

    it('should return title when cache is loaded', fakeAsync(() => {
      const pipe = TestBed.inject(CountryTitle);
      tick();
      expect(pipe.transform('US')).toBe('United States');
      expect(pipe.transform('UA')).toBe('Ukraine');
    }));
  });
});
