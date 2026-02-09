import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { OrderContainersSelectorService } from './order-containers-selector.service';

describe('OrderContainersSelectorService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				OrderContainersSelectorService,
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
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(OrderContainersSelectorService)).toBeTruthy();
	});
});
