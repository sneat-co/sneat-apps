import { TestBed } from '@angular/core/testing';

import { ListService } from './list.service';

describe('ListService', () => {
  it('should be created', () => {
    const service = {
      createList: vi.fn(),
      deleteList: vi.fn(),
    } as unknown as ListService;
    expect(service).toBeTruthy();
  });
});
