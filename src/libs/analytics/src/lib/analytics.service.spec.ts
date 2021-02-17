import {TestBed} from '@angular/core/testing';

import {FireAnalyticsService} from './fire-analytics.service';

describe('AnalyticsService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: FireAnalyticsService = TestBed.inject(FireAnalyticsService);
		expect(service).toBeTruthy();
	});
});
