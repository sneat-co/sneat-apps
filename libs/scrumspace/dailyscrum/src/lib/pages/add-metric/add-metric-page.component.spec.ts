import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ErrorLogger } from '@sneat/core';
import { SpaceService } from '../../services/space.service';

import { AddMetricPageComponent } from './add-metric-page.component';

describe('AddMetricPage', () => {
	let component: AddMetricPageComponent;
	let fixture: ComponentFixture<AddMetricPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [AddMetricPageComponent, IonicModule.forRoot()],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: { queryParamMap: { get: () => null } },
					},
				},
				{ provide: ErrorLogger, useValue: { logError: () => undefined } },
				{
					provide: SpaceService,
					useValue: { getTeam: vi.fn(), addMetric: vi.fn() },
				},
				{ provide: NavController, useValue: { back: vi.fn() } },
				{ provide: ToastController, useValue: { create: vi.fn() } },
			],
		})
			.overrideComponent(AddMetricPageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(AddMetricPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
