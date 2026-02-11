import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { TrackusApiService } from './trackus-api.service';

describe('TrackusApiService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        TrackusApiService,
        { provide: SneatApiService, useValue: { post: vi.fn() } },
      ],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(TrackusApiService)).toBeTruthy();
  });
});
