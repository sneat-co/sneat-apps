import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SpaceMenuComponent } from './space-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorLogger } from '@sneat/logging';
import { AnalyticsService } from '@sneat/core';
import { SneatUserService } from '@sneat/auth-core';
import { MenuController, NavController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';

describe('SpaceMenuComponent', () => {
	let component: SpaceMenuComponent;
	let fixture: ComponentFixture<SpaceMenuComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [SpaceMenuComponent, RouterTestingModule],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: jest.fn(),
						logErrorHandler: jest.fn(() => jest.fn()),
					},
				},
				{ provide: AnalyticsService, useValue: { logEvent: jest.fn() } },
				{ provide: SneatUserService, useValue: { userState: of({}) } },
				{ provide: NavController, useValue: {} },
				{ provide: MenuController, useValue: {} },
				{
					provide: Auth,
					useValue: { onIdTokenChanged: jest.fn(() => jest.fn()) },
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
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
