import { TestBed } from '@angular/core/testing';

import { ListusAppStateService } from './listus-app-state.service';

describe('ListusAppStateService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({ providers: [ListusAppStateService] }),
	);

	it('should be created', () => {
		const service: ListusAppStateService = TestBed.inject(
			ListusAppStateService,
		);
		expect(service).toBeTruthy();
	});
});
