import { TestBed } from '@angular/core/testing';

import { NavService } from './nav.service';

describe('NavServiceService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: NavService = TestBed.inject(NavService);
		expect(service).toBeTruthy();
	});
});
