import { TestBed } from '@angular/core/testing';

import { DbServerService } from './db-server.service';

describe('DbServerService', () => {
	let service: DbServerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DbServerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
