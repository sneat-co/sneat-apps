import { TestBed } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { OrderPrintService } from './order-print.service';

describe('OrderPrintService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderPrintService,
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: () => vi.fn(),
          },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(OrderPrintService)).toBeTruthy();
  });
});
