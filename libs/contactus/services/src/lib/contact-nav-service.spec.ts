import { TestBed } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { ContactNavService } from './contact-nav-service';

describe('ContactNavService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        ContactNavService,
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: () => vi.fn(),
          },
        },
        {
          provide: SpaceNavService,
          useValue: { navigateForwardToSpacePage: vi.fn() },
        },
      ],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(ContactNavService)).toBeTruthy();
  });
});
