import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
	selector: 'sneat-auth-menu-item',
	template: '',
	standalone: true,
})
class AuthMenuItemStubComponent {}

import { SpaceMenuComponent } from './space-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorLogger } from '@sneat/logging';
import { AnalyticsService, APP_INFO, LOGGER_FACTORY } from '@sneat/core';
import { SneatUserService } from '@sneat/auth-core';
import { of } from 'rxjs';

describe('SpaceMenuComponent', () => {
	let component: SpaceMenuComponent;
	let fixture: ComponentFixture<SpaceMenuComponent>;

	beforeEach(waitForAsync(async () => {
		const ionic = require('@ionic/angular/standalone');
		await TestBed.configureTestingModule({
			imports: [SpaceMenuComponent, RouterTestingModule],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
				{ provide: LOGGER_FACTORY, useValue: { getLogger: () => console } },
				{ provide: APP_INFO, useValue: {} },
				{ provide: SneatUserService, useValue: { userState: of({}) } },
				{ provide: ionic.NavController, useValue: {} },
				{ provide: ionic.MenuController, useValue: {} },
				{
					provide: Auth,
					useValue: {
						onIdTokenChanged: vi.fn(() => vi.fn()),
						onAuthStateChanged: vi.fn(() => vi.fn()),
					},
				},
				{ provide: Firestore, useValue: {} },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(SpaceMenuComponent, {
				remove: {
					imports: [
						ionic.IonList,
						ionic.IonItem,
						ionic.IonSelect,
						ionic.IonSelectOption,
						ionic.IonIcon,
						ionic.IonLabel,
						ionic.IonButtons,
						ionic.IonButton,
					],
				},
				add: {
					imports: [AuthMenuItemStubComponent],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpaceMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
