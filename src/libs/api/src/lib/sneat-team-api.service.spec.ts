import { TestBed } from '@angular/core/testing';

import { SneatTeamApiService } from './sneat-team-api.service';

describe('SneatTeamApiService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: SneatTeamApiService = TestBed.inject(SneatTeamApiService);
		expect(service).toBeTruthy();
	});
});
