import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { EnvDbTablePageComponent } from './env-db-table.page';
import { DatatugNavContextService } from '../../../services/nav/datatug-nav-context.service';
import { ProjectService } from '../../../services/project/project.service';
import { AgentService } from '../../../services/repo/agent.service';
import { DatatugNavService } from '../../../services/nav/datatug-nav.service';

describe('EnvDbTablePage', () => {
	let component: EnvDbTablePageComponent;
	let fixture: ComponentFixture<EnvDbTablePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [EnvDbTablePageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{
					provide: ActivatedRoute,
					useValue: {
						queryParamMap: of({ get: () => null }),
						paramMap: of({ get: () => null }),
						snapshot: { paramMap: { get: () => null }, params: {} },
					},
				},
				{
					provide: DatatugNavContextService,
					useValue: {
						currentProject: of(undefined),
						currentEnv: of(undefined),
						currentEnvDbTable: of(undefined),
						setCurrentEnvironment: vi.fn(),
					},
				},
				{
					provide: ProjectService,
					useValue: { watchProjectSummary: vi.fn(), getFull: vi.fn() },
				},
				{ provide: AgentService, useValue: { select: vi.fn() } },
				{ provide: PopoverController, useValue: { create: vi.fn() } },
				{ provide: DatatugNavService, useValue: { goTable: vi.fn() } },
			],
		})
			.overrideComponent(EnvDbTablePageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(EnvDbTablePageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
