import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import {
	NavController,
	MenuController,
	IonIcon,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';
import { SpacesListComponent } from '../spaces-list';
import { SpacesMenuComponent } from './spaces-menu.component';
import { ErrorLogger } from '@sneat/core';
import { AnalyticsService, APP_INFO, LOGGER_FACTORY } from '@sneat/core';
import { of } from 'rxjs';
import { SneatUserService } from '@sneat/auth-core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Component({
	selector: 'sneat-spaces-list',
	template: '',
	standalone: true,
})
class SpacesListStubComponent {
	@Input() spaces?: unknown[];
	@Input() pathPrefix = '/space';
}

describe('SpacesMenuComponent', () => {
	let component: SpacesMenuComponent;
	let fixture: ComponentFixture<SpacesMenuComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [SpacesMenuComponent],
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
			.overrideComponent(SpacesMenuComponent, {
				remove: { imports: [IonIcon, IonItem, IonLabel, SpacesListComponent] },
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
