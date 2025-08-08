import { TestBed } from '@angular/core/testing';

import { NewProjectService } from './new-project.service';

describe('NewProjectService', () => {
	let service: NewProjectService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NewProjectService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
