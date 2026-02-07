import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SpaceNavService } from './space-nav.service';

describe('SpaceNavService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [provideRouter([])]}),
	);

	it('should be created', () => {
		const service: SpaceNavService = TestBed.inject(SpaceNavService);
		expect(service).toBeTruthy();
	});
});
