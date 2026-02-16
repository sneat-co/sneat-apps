import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CountryInputComponent } from './country-input.component';
import { CountriesLoaderService } from '../country-selector';

describe('CountryInputComponent', () => {
  let component: CountryInputComponent;
  let fixture: ComponentFixture<CountryInputComponent>;
  let countriesLoader: { getCountries: ReturnType<typeof vi.fn> };

  const mockCountries = [
    { id: 'US', emoji: '🇺🇸', title: 'United States' },
    { id: 'UA', emoji: '🇺🇦', title: 'Ukraine' },
  ];

  beforeEach(waitForAsync(async () => {
    countriesLoader = {
      getCountries: vi.fn().mockResolvedValue(mockCountries),
    };

    await TestBed.configureTestingModule({
      imports: [CountryInputComponent],
      providers: [
        {
          provide: CountriesLoaderService,
          useValue: countriesLoader,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(CountryInputComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
      })
      .compileComponents();
    fixture = TestBed.createComponent(CountryInputComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.canReset).toBe(true);
    expect(component.label).toBe('Country');
    expect(component.countryID).toBe('');
  });

  it('should load countries on init', async () => {
    await component.ngOnInit();
    expect(countriesLoader.getCountries).toHaveBeenCalled();
    // Wait for promise to resolve
    await Promise.resolve();
    expect(component.countries()).toEqual(mockCountries);
  });

  it('should emit countryIDChange when onCountryChanged is called', () => {
    const emitSpy = vi.fn();
    component.countryIDChange.subscribe(emitSpy);
    component.countryID = 'US';

    component.onCountryChanged();

    expect(emitSpy).toHaveBeenCalledWith('US');
  });

  it('should reset countryID and emit when reset is called', () => {
    const emitSpy = vi.fn();
    component.countryIDChange.subscribe(emitSpy);
    component.countryID = 'US';

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as Event;

    component.reset(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.countryID).toBe('');
    expect(emitSpy).toHaveBeenCalledWith('');
  });
});
