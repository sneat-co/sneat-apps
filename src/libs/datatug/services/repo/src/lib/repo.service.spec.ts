import {TestBed} from '@angular/core/testing';

import {StoreService} from './repo.service';

describe('AgentService', () => {
	let service: StoreService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(StoreService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
