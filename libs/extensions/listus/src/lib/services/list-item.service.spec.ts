import { TestBed } from '@angular/core/testing';

import { ListItemService } from './list-item.service';

describe('ListItemService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: ListItemService = TestBed.get(ListItemService);
		expect(service).toBeTruthy();
	});
});
