import { TestBed } from '@angular/core/testing';

import { SneatUserService } from './sneat-user.service';

describe('SneatUserService', () => {
  let service: SneatUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SneatUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
