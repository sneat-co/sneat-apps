import {TestBed} from '@angular/core/testing';

import {ProjectContextService} from './project-context.service';

describe('ProjectContextService', () => {
	let service: ProjectContextService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ProjectContextService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
