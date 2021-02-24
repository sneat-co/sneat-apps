import {TestBed} from '@angular/core/testing';

import {TimerFactory} from './timer.service';

describe('TimerService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: TimerFactory = TestBed.inject(TimerFactory);
		expect(service).toBeTruthy();
	});
});
