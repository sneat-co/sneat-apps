import { TestBed } from '@angular/core/testing';
import { PopoverController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';

import { NewProjectService } from './new-project.service';

describe('NewProjectService', () => {
	let service: NewProjectService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				NewProjectService,
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: PopoverController,
					useValue: { create: vi.fn(), dismiss: vi.fn() },
				},
			],
		});
		service = TestBed.inject(NewProjectService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
