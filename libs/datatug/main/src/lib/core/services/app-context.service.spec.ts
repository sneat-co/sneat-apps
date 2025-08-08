import { TestBed } from '@angular/core/testing';

import { AppContextService } from './app-context.service';

describe('AppContextService', () => {
	let service: AppContextService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(AppContextService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
