import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { CountrySelectorService } from './country-selector.service';

describe('CountrySelectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CountrySelectorService,
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        { provide: ModalController, useValue: { create: vi.fn() } },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(CountrySelectorService)).toBeTruthy();
  });
});
