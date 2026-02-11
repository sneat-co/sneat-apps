import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { ShippingPointsSelectorService } from './shipping-points-selector.service';

describe('ShippingPointsSelectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShippingPointsSelectorService,
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: () => vi.fn(),
          },
        },
        {
          provide: ModalController,
          useValue: { create: vi.fn() },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(ShippingPointsSelectorService)).toBeTruthy();
  });
});
