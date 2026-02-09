import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';

import { ParameterLookupService } from './parameter-lookup.service';
import { AgentService } from '../../services/repo/agent.service';

describe('ParameterLookupService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ParameterLookupService,
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: ModalController,
					useValue: {
						create: vi.fn(() => Promise.resolve({ present: vi.fn() })),
						dismiss: vi.fn(),
					},
				},
				{
					provide: AgentService,
					useValue: { select: vi.fn() },
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(ParameterLookupService)).toBeTruthy();
	});
});
