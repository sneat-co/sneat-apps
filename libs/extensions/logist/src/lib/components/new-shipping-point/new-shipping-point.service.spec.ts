import { TestBed } from '@angular/core/testing';
import { ModalController, NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { OrderNavService } from '../../services';
import { NewShippingPointService } from './new-shipping-point.service';

describe('NewShippingPointService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				NewShippingPointService,
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: () => vi.fn(),
					},
				},
				{
					provide: ModalController,
					useValue: { create: vi.fn() },
				},
				{
					provide: OrderNavService,
					useValue: {
						goOrderPage: vi.fn(() => Promise.resolve(true)),
					},
				},
				{
					provide: NavController,
					useValue: {},
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(NewShippingPointService)).toBeTruthy();
	});
});
