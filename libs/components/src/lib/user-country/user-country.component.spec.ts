import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ErrorLogger } from '@sneat/core';
import { SneatUserService } from '@sneat/auth-core';
import { ClassName } from '@sneat/ui';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { UserCountryComponent } from './user-country.component';
import { CountriesLoaderService } from '../country-selector';

describe('UserCountryComponent', () => {
  let component: UserCountryComponent;
  let fixture: ComponentFixture<UserCountryComponent>;
  let httpClient: { get: ReturnType<typeof vi.fn> };
  let userService: {
    userState: BehaviorSubject<{ record?: { countryID?: string } }>;
    user$: BehaviorSubject<unknown>;
    userChanged: BehaviorSubject<unknown>;
    setUserCountry: ReturnType<typeof vi.fn>;
  };
  let errorLogger: { logError: ReturnType<typeof vi.fn>; logErrorHandler: ReturnType<typeof vi.fn> };
  let countriesLoader: {
    getCountryByID: ReturnType<typeof vi.fn>;
    getCountries: ReturnType<typeof vi.fn>;
  };

  beforeEach(waitForAsync(async () => {
    httpClient = {
      get: vi.fn(() => of('US')),
    };
    
    userService = {
      userState: new BehaviorSubject<{ record?: { countryID?: string } }>({ 
        record: undefined 
      }),
      user$: new BehaviorSubject({}),
      userChanged: new BehaviorSubject(undefined),
      setUserCountry: vi.fn(() => of({})),
    };
    
    errorLogger = {
      logError: vi.fn(),
      logErrorHandler: () => vi.fn(),
    };

    countriesLoader = {
      getCountryByID: vi.fn(() => Promise.resolve({ 
        id: 'US', 
        emoji: '🇺🇸', 
        title: 'United States' 
      })),
      getCountries: vi.fn(() => Promise.resolve([])),
    };

    await TestBed.configureTestingModule({
      imports: [UserCountryComponent],
      providers: [
        { provide: ClassName, useValue: 'TestComponent' },
        { provide: ErrorLogger, useValue: errorLogger },
        { provide: HttpClient, useValue: httpClient },
        { provide: SneatUserService, useValue: userService },
        { provide: CountriesLoaderService, useValue: countriesLoader },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(UserCountryComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
      })
      .compileComponents();
    fixture = TestBed.createComponent(UserCountryComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track user record and update userCountryID', () => {
    userService.userState.next({ record: { countryID: 'UA' } });
    expect(component['$userCountryID']()).toBe('UA');
  });

  it('should set userCountryID to "--" when record has no countryID', () => {
    userService.userState.next({ record: {} });
    expect(component['$userCountryID']()).toBe('--');
  });

  it('should call setCountry when onCountryOfResidenceChanged is invoked', () => {
    const setCountrySpy = vi.spyOn(component as any, 'setCountry');
    component['onCountryOfResidenceChanged']('US');
    expect(setCountrySpy).toHaveBeenCalledWith('US');
  });

  it('should set user country when setCountry is called with valid countryID', () => {
    component['setCountry']('US');
    expect(component['$saving']()).toBe(true);
    expect(userService.setUserCountry).toHaveBeenCalledWith('US');
  });

  it('should not set country when countryID is undefined', () => {
    component['setCountry'](undefined);
    expect(userService.setUserCountry).not.toHaveBeenCalled();
  });

  it('should handle error when setting user country fails', () => {
    const error = new Error('Set country failed');
    userService.setUserCountry = vi.fn(() => throwError(() => error));
    
    component['setCountry']('US');
    
    expect(errorLogger.logError).toHaveBeenCalledWith(
      'UserCountryComponent: Failed to set user country',
      error
    );
  });

  it('should compute userHasCountry correctly', () => {
    component['$userCountryID'].set('US');
    expect(component['$userHasCountry']()).toBe(true);
    
    component['$userCountryID'].set('--');
    expect(component['$userHasCountry']()).toBe(false);
    
    component['$userCountryID'].set('');
    expect(component['$userHasCountry']()).toBe(false);
  });

  it('should initialize with default values', () => {
    expect(component['$ipCountryID']()).toBe('');
    expect(component['$ipCountry']()).toBeUndefined();
    expect(component['isCountryDetectionStarted']).toBe(false);
    expect(component['$detectingCountry']()).toBe(false);
    expect(component['$saving']()).toBe(false);
    expect(component.doNotHide).toBe(false);
  });
});
