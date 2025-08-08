import { TestBed } from '@angular/core/testing';

import { DatatugStoreService } from './datatug-store.service';

describe('DatatugStoreService', () => {
	let service: DatatugStoreService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DatatugStoreService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
