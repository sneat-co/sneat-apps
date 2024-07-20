import { TestBed } from '@angular/core/testing';

import { SpaceContextService } from './space-context.service';

describe('TeamContextService', () => {
	let service: SpaceContextService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SpaceContextService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
