import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { OrderNavService } from './order-nav.service';

describe('OrderNavService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				OrderNavService,
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: () => vi.fn(),
					},
				},
				{
					provide: NavController,
					useValue: {
						navigateForward: vi.fn(() => Promise.resolve(true)),
						navigateBack: vi.fn(() => Promise.resolve(true)),
					},
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(OrderNavService)).toBeTruthy();
	});
});
