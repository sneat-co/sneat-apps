import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { DebtusService } from './debtus-service';

describe('DebtusService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        DebtusService,
        { provide: SneatApiService, useValue: { post: vi.fn() } },
      ],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(DebtusService)).toBeTruthy();
  });
});
