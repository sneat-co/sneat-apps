import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { ContactsSelectorService } from '@sneat/contactus-shared';
import { HappeningService } from '../services/happening.service';
import { HappeningBaseComponentParams } from './happening-base.component';

describe('HappeningBaseComponentParams', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				HappeningBaseComponentParams,
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{ provide: HappeningService, useValue: {} },
				{
					provide: SpaceNavService,
					useValue: { navigateForwardToSpacePage: vi.fn() },
				},
				{ provide: ContactsSelectorService, useValue: {} },
				{ provide: ModalController, useValue: {} },
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(HappeningBaseComponentParams)).toBeTruthy();
	});
});
