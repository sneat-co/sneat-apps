import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { EnvironmentPageComponent } from './environment-page.component';
import { EnvironmentService } from '../../../services/unsorted/environment.service';
import { DatatugNavContextService } from '../../../services/nav/datatug-nav-context.service';

describe('EnvironmentPage', () => {
	let component: EnvironmentPageComponent;
	let fixture: ComponentFixture<EnvironmentPageComponent>;

	beforeEach(waitForAsync(async () => {
		Object.defineProperty(window, 'history', {
			value: { ...window.history, state: { projEnv: undefined } },
			writable: true,
			configurable: true,
		});
		await TestBed.configureTestingModule({
			imports: [EnvironmentPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						queryParamMap: of({ get: () => null }),
						paramMap: of({ get: () => null }),
						snapshot: { paramMap: { get: () => null } },
					},
				},
				{ provide: EnvironmentService, useValue: { getEnvSummary: vi.fn() } },
				{
					provide: NavController,
					useValue: { navigateForward: vi.fn(() => Promise.resolve(true)) },
				},
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: DatatugNavContextService,
					useValue: {
						currentProject: of(undefined),
						currentEnv: of(undefined),
					},
				},
			],
		})
			.overrideComponent(EnvironmentPageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(EnvironmentPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
