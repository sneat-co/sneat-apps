import { TestBed } from '@angular/core/testing';

import { ScrumService } from './scrum.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Firestore } from '@angular/fire/firestore';
import { ErrorLogger, AnalyticsService } from '@sneat/core';
import { SneatApiService } from '@sneat/api';
import { RandomIdService } from '@sneat/random';
import { SneatUserService } from '@sneat/auth-core';
import { of } from 'rxjs';

describe('ScrumService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				ScrumService,
				{ provide: Firestore, useValue: {} },
				{ provide: ErrorLogger, useValue: { logError: () => undefined } },
				{ provide: AnalyticsService, useValue: { logEvent: () => undefined } },
				{
					provide: SneatApiService,
					useValue: { post: vi.fn(), delete: vi.fn() },
				},
				{
					provide: RandomIdService,
					useValue: { newRandomId: () => 'test-id' },
				},
				{
					provide: SneatUserService,
					useValue: {
						userState: of(null),
						userChanged: of(undefined),
						currentUserID: undefined,
					},
				},
			],
		}),
	);

	it('should be created', () => {
		const service: ScrumService = TestBed.inject(ScrumService);
		expect(service).toBeTruthy();
	});
});
