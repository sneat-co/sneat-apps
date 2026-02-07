import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { ErrorLogger } from '@sneat/logging';

import { AppComponentService } from './app-component.service';

describe('AppComponentService', () => {
	let service: AppComponentService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AppComponentService,
				{
					provide: Platform,
					useValue: { ready: jest.fn().mockResolvedValue('') },
				},
				{ provide: ErrorLogger, useValue: { logError: jest.fn() } },
			],
		});
		service = TestBed.inject(AppComponentService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
