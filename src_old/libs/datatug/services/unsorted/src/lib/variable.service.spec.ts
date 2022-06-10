import { TestBed } from '@angular/core/testing';

import { VariableService } from './variable.service';

describe('VariableService', () => {
	let service: VariableService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(VariableService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
