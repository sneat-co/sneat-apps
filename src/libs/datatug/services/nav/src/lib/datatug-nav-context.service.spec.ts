import {TestBed} from '@angular/core/testing';

import {DatatugNavContextService} from './datatug-nav-context.service';

describe('DatatugNavContextService', () => {
	let service: DatatugNavContextService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DatatugNavContextService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
