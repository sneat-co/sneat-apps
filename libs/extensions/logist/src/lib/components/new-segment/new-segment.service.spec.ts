import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { OrderNavService } from '../../services';
import { NewSegmentService } from './new-segment.service';

describe('NewSegmentService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				NewSegmentService,
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
					useValue: {
						navigateForward: vi.fn(() => Promise.resolve(true)),
					},
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(NewSegmentService)).toBeTruthy();
	});
});
