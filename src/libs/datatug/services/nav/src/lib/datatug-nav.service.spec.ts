import {TestBed} from '@angular/core/testing';

import {DatatugNavService} from './datatug-nav.service';

describe('DatatugNavService', () => {
	let service: DatatugNavService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DatatugNavService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
