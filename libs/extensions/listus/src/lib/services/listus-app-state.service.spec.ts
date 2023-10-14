import { TestBed } from '@angular/core/testing';

import { ListusAppStateService } from './listus-app-state.service';

describe('ListusAppStateService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: ListusAppStateService = TestBed.get(ListusAppStateService);
		expect(service).toBeTruthy();
	});
});
