import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
	NavController,
	MenuController,
	IonList,
	IonItem,
	IonSelect,
	IonSelectOption,
	IonIcon,
	IonLabel,
	IonButtons,
	IonButton,
} from '@ionic/angular/standalone';
import { AuthMenuItemComponent } from '@sneat/auth-ui';
import { SpaceMenuComponent } from './space-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorLogger } from '@sneat/logging';
import { AnalyticsService, APP_INFO, LOGGER_FACTORY } from '@sneat/core';
import { SneatUserService } from '@sneat/auth-core';
import { of } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Component({
	selector: 'sneat-auth-menu-item',
	template: '',
	standalone: true,
})
class AuthMenuItemStubComponent {}

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
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
				{ provide: LOGGER_FACTORY, useValue: { getLogger: () => console } },
				{ provide: APP_INFO, useValue: {} },
				{ provide: SneatUserService, useValue: { userState: of({}) } },
				{ provide: NavController, useValue: {} },
				{ provide: MenuController, useValue: {} },
				{
					provide: Auth,
					useValue: {
						onIdTokenChanged: vi.fn(() => () => void 0),
						onAuthStateChanged: vi.fn(() => () => void 0),
					},
				},
				{ provide: Firestore, useValue: {} },
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(SpaceMenuComponent, {
				remove: {
					imports: [
						IonList,
						IonItem,
						IonSelect,
						IonSelectOption,
						IonIcon,
						IonLabel,
						IonButtons,
						IonButton,
						AuthMenuItemComponent,
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
