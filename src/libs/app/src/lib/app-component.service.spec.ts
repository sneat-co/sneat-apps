import { TestBed } from '@angular/core/testing';

import { AppComponentService } from './app-component.service';

describe('AppComponentService', () => {
  let service: AppComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
