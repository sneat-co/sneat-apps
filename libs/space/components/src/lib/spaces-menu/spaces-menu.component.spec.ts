import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
	selector: 'sneat-spaces-list',
	template: '',
	standalone: true,
})
class SpacesListStubComponent {
	@Input() userID?: string;
	@Input() spaces?: any[];
	@Input() pathPrefix = '/space';
}

import { SpacesMenuComponent } from './spaces-menu.component';
import { ErrorLogger } from '@sneat/logging';
import { AnalyticsService, APP_INFO, LOGGER_FACTORY } from '@sneat/core';
import { SneatUserService } from '@sneat/auth-core';
import { MenuController, NavController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

import { IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';

describe('SpacesMenuComponent', () => {
	let component: SpacesMenuComponent;
	let fixture: ComponentFixture<SpacesMenuComponent>;

	beforeEach(waitForAsync(async () => {
		const ionic = require('@ionic/angular/standalone');
		await TestBed.configureTestingModule({
			imports: [SpacesMenuComponent],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: jest.fn(),
						logErrorHandler: jest.fn(() => jest.fn()),
					},
				},
				{ provide: AnalyticsService, useValue: { logEvent: jest.fn() } },
				{ provide: LOGGER_FACTORY, useValue: { getLogger: () => console } },
				{ provide: APP_INFO, useValue: {} },
				{ provide: SneatUserService, useValue: { userState: of({}) } },
				{ provide: ionic.NavController, useValue: {} },
				{ provide: ionic.MenuController, useValue: {} },
				{
					provide: Auth,
					useValue: {
						onIdTokenChanged: jest.fn(() => jest.fn()),
						onAuthStateChanged: jest.fn(() => jest.fn()),
					},
				},
				{ provide: Firestore, useValue: {} },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(SpacesMenuComponent, {
				remove: { imports: [ionic.IonIcon, ionic.IonItem, ionic.IonLabel] },
				add: {
					imports: [SpacesListStubComponent],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SpacesMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
