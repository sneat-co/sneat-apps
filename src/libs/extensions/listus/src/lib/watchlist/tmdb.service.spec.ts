import {TestBed} from '@angular/core/testing';

import {TmdbService} from './tmdb.service';

describe('TmdbService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: TmdbService = TestBed.get(TmdbService);
		expect(service)
			.toBeTruthy();
	});
});
