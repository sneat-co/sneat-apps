import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { DbServerService } from './db-server.service';
import { ProjectContextService } from '../project/project-context.service';
import { ProjectService } from '../project/project.service';

describe('DbServerService', () => {
  let service: DbServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DbServerService,
        {
          provide: HttpClient,
          useValue: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
        },
        {
          provide: ProjectContextService,
          useValue: { current: undefined, setCurrent: vi.fn() },
        },
        { provide: ProjectService, useValue: { getFull: vi.fn() } },
      ],
    });
    service = TestBed.inject(DbServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
