import { TestBed } from '@angular/core/testing';
import { PrivateTokenStoreService } from './private-token-store.service';

describe('PrivateTokenStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivateTokenStoreService],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(PrivateTokenStoreService)).toBeTruthy();
  });
});
