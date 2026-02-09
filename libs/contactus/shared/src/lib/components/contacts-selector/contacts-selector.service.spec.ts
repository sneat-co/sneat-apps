import { TestBed } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ModalController } from '@ionic/angular/standalone';

import { ContactsSelectorService } from './contacts-selector.service';

describe('ContactsSelectorService', () => {
	let service: ContactsSelectorService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ContactsSelectorService,
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: ModalController,
					useValue: { create: vi.fn(), dismiss: vi.fn() },
				},
			],
		});
		service = TestBed.inject(ContactsSelectorService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
