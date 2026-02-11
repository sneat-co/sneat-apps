import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';

import { DatatugNavService } from './datatug-nav.service';

describe('DatatugNavService', () => {
  let service: DatatugNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatatugNavService,
        {
          provide: NavController,
          useValue: { navigateRoot: vi.fn(), navigateForward: vi.fn() },
        },
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
      ],
    });
    service = TestBed.inject(DatatugNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
