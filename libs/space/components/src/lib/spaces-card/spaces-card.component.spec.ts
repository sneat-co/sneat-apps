import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

import { SpacesCardComponent } from './spaces-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SneatUserService } from '@sneat/auth-core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ErrorLogger } from '@sneat/core';
import { AnalyticsService } from '@sneat/core';
import { of } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

describe('SpacesCardComponent', () => {
	let component: SpacesCardComponent;
	let fixture: ComponentFixture<SpacesCardComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [
				SpacesCardComponent,
				RouterTestingModule,
				HttpClientTestingModule,
			],
			providers: [
				{ provide: SpaceService, useValue: {} },
				{ provide: SpaceNavService, useValue: {} },
				{ provide: SneatUserService, useValue: { userState: of({}) } },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
				{
					provide: Auth,
					useValue: {
						onIdTokenChanged: vi.fn(() => () => void 0),
						onAuthStateChanged: vi.fn(() => () => void 0),
					},
				},
				{ provide: Firestore, useValue: {} },
				{
					provide: ToastController,
					useValue: {
						create: vi.fn().mockResolvedValue({ present: vi.fn() }),
					},
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpacesCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
