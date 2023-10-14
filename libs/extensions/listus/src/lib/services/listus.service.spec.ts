import { TestBed } from '@angular/core/testing';

import { ListusDbService } from './listus-db.service';

describe('ListusService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: ListusDbService = TestBed.get(ListusDbService);
		expect(service).toBeTruthy();
	});
});
