import { TestBed } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';

import { QueryContextSqlService } from './query-context-sql.service';
import { TableService } from '../services/unsorted/table.service';

describe('QueryContextSqlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QueryContextSqlService,
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
        {
          provide: TableService,
          useValue: {
            getDbCatalogRefs: vi.fn(),
            getTableMeta: vi.fn(),
          },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(QueryContextSqlService)).toBeTruthy();
  });
});
