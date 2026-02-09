import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService, SpaceService } from '@sneat/space-services';

import { MetricsComponent } from './metrics.component';

describe('MetricsComponent', () => {
	let component: MetricsComponent;
	let fixture: ComponentFixture<MetricsComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [MetricsComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: () => vi.fn(),
					},
				},
				{ provide: SpaceService, useValue: { deleteMetrics: vi.fn() } },
				{ provide: NavController, useValue: {} },
				{
					provide: SpaceNavService,
					useValue: {
						navigateForwardToSpacePage: vi.fn(),
						navigateToAddMetric: vi.fn(),
					},
				},
			],
		})
			.overrideComponent(MetricsComponent, {
				set: {
					imports: [],
					providers: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(MetricsComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
