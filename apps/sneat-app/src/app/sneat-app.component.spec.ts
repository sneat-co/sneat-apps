import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, EMPTY } from 'rxjs';
import { SneatAuthStateService, TelegramAuthService } from '@sneat/auth-core';
import { AnalyticsService, TopMenuService } from '@sneat/core';

import { SneatAppComponent } from './sneat-app.component';

describe('AppComponent', () => {
	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [SneatAppComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: Router, useValue: { events: EMPTY } },
				{
					provide: ActivatedRoute,
					useValue: {
						firstChild: null,
						paramMap: of({ get: () => null }),
						queryParamMap: of({ get: () => null }),
						snapshot: {
							paramMap: { get: () => null },
							queryParamMap: { get: () => null },
						},
					},
				},
				{
					provide: TelegramAuthService,
					useValue: { authenticateIfTelegramWebApp: vi.fn() },
				},
				{ provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
				{ provide: TopMenuService, useValue: { visibilityChanged: vi.fn() } },
				{
					provide: SneatAuthStateService,
					useValue: { authState: of({ status: 'notAuthenticated' }) },
				},
			],
		})
			.overrideComponent(SneatAppComponent, {
				set: { imports: [], template: '', schemas: [CUSTOM_ELEMENTS_SCHEMA] },
			})
			.compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(SneatAppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
});
