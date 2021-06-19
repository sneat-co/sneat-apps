import {TestBed} from '@angular/core/testing';

// noinspection ES6PreferShortImport
import {TimerFactory} from './timer.service';

describe('TimerService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: TimerFactory = TestBed.inject(TimerFactory);
		expect(service).toBeTruthy();
	});
});
