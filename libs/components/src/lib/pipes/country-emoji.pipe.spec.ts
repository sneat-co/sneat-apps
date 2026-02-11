import { TestBed } from '@angular/core/testing';
import { CountryFlagPipe, CountryTitle } from './country-emoji.pipe';
import { CountriesLoaderService } from '../country-selector';

describe('CountryFlagPipe', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      providers: [
        CountryFlagPipe,
        {
          provide: CountriesLoaderService,
          useValue: { getCountriesByID: () => Promise.resolve({}) },
        },
      ],
    });
    expect(TestBed.inject(CountryFlagPipe)).toBeTruthy();
  });
});

describe('CountryTitle', () => {
  it('should create', () => {
    TestBed.configureTestingModule({
      providers: [
        CountryTitle,
        {
          provide: CountriesLoaderService,
          useValue: { getCountriesByID: () => Promise.resolve({}) },
        },
      ],
    });
    expect(TestBed.inject(CountryTitle)).toBeTruthy();
  });
});
