import { TestBed } from '@angular/core/testing';

import { ErrorLogger } from '@sneat/logging';
import { TimerFactory } from './timer.service';

describe('TimerService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [
				TimerFactory,
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
			],
		}),
	);

	it('should be created', () => {
		const service: TimerFactory = TestBed.inject(TimerFactory);
		expect(service).toBeTruthy();
	});
});
