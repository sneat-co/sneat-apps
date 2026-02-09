import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { ProjectPageComponent } from './project-page.component';
import { DatatugNavService } from '../../../services/nav/datatug-nav.service';
import { DatatugNavContextService } from '../../../services/nav/datatug-nav-context.service';
import { ProjectService } from '../../../services/project/project.service';
import { SchemaService } from '../../../services/unsorted/schema.service';
import { EnvironmentService } from '../../../services/unsorted/environment.service';
import { EntityService } from '../../../services/unsorted/entity.service';

describe('ProjectPage', () => {
	let component: ProjectPageComponent;
	let fixture: ComponentFixture<ProjectPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ProjectPageComponent],
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
					provide: DatatugNavService,
					useValue: {
						goEnvironment: vi.fn(),
						goEntity: vi.fn(),
						goBoard: vi.fn(),
						goProjPage: vi.fn(),
						goProject: vi.fn(),
						projectPageUrl: vi.fn(),
					},
				},
				{
					provide: DatatugNavContextService,
					useValue: {
						currentProject: of(undefined),
						currentEnv: of(undefined),
						setCurrentEnvironment: vi.fn(),
					},
				},
				{
					provide: ProjectService,
					useValue: {
						watchProjectSummary: vi.fn(() => of()),
						getFull: vi.fn(),
					},
				},
				{ provide: SchemaService, useValue: {} },
				{ provide: EnvironmentService, useValue: { getEnvSummary: vi.fn() } },
				{ provide: EntityService, useValue: {} },
				{
					provide: NavController,
					useValue: {
						navigateForward: vi.fn(() => Promise.resolve(true)),
						navigateRoot: vi.fn(),
					},
				},
			],
		})
			.overrideComponent(ProjectPageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(ProjectPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
