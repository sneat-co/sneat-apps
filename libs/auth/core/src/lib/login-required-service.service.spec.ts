import { TestBed } from '@angular/core/testing';

import { LoginRequiredServiceService } from './login-required-service.service';

describe('LoginRequiredServiceService', () => {
	let service: LoginRequiredServiceService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LoginRequiredServiceService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
