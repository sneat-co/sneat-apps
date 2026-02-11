import { TestBed } from '@angular/core/testing';

import { DatatugFoldersService } from './datatug-folders.service';
import { DatatugStoreServiceFactory } from '../../services/repo/datatug-store-service-factory.service';

describe('DatatugFoldersService', () => {
  let service: DatatugFoldersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatatugFoldersService,
        {
          provide: DatatugStoreServiceFactory,
          useValue: { getDatatugStoreService: vi.fn() },
        },
      ],
    });
    service = TestBed.inject(DatatugFoldersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
