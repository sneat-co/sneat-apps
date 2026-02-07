import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SpacesCardComponent } from './spaces-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SneatUserService } from '@sneat/auth-core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ErrorLogger } from '@sneat/logging';
import { AnalyticsService } from '@sneat/core';
import { ToastController } from '@ionic/angular';
import { of } from 'rxjs';

import {
	IonInput,
	IonCard,
	IonItem,
	IonLabel,
	IonCardTitle,
	IonButtons,
	IonButton,
	IonIcon,
	IonList,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
	IonSpinner,
	IonSkeletonText,
	IonCardContent,
} from '@ionic/angular/standalone';

describe('SpacesCardComponent', () => {
	let component: SpacesCardComponent;
	let fixture: ComponentFixture<SpacesCardComponent>;

	beforeEach(waitForAsync(async () => {
		const ionic = require('@ionic/angular/standalone');
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
						logErrorHandler: jest.fn(() => vi.fn()),
					},
				},
				{ provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
				{
					provide: ionic.ToastController,
					useValue: {
						create: vi.fn().mockResolvedValue({ present: vi.fn() }),
					},
				},
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(SpacesCardComponent, {
				remove: {
					imports: [
						ionic.IonInput,
						ionic.IonCard,
						ionic.IonItem,
						ionic.IonLabel,
						ionic.IonCardTitle,
						ionic.IonButtons,
						ionic.IonButton,
						ionic.IonIcon,
						ionic.IonList,
						ionic.IonItemSliding,
						ionic.IonItemOptions,
						ionic.IonItemOption,
						ionic.IonSpinner,
						ionic.IonSkeletonText,
						ionic.IonCardContent,
					],
				},
				add: {
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(SpacesCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
