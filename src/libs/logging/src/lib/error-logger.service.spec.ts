import {TestBed} from '@angular/core/testing';

import {ErrorLoggerService} from './error-logger.service';

describe('ErrorLoggerService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: ErrorLoggerService = TestBed.inject(ErrorLoggerService);
		expect(service).toBeTruthy();
	});
});
