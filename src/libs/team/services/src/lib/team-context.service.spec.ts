import { TestBed } from '@angular/core/testing';

import { TeamContextService } from './team-context.service';

describe('TeamContextService', () => {
	let service: TeamContextService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TeamContextService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
