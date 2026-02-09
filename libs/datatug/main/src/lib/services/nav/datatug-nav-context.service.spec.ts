import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';

import { DatatugNavContextService } from './datatug-nav-context.service';
import { AppContextService } from '../../core/services/app-context.service';
import { ProjectContextService } from '../project/project-context.service';
import { ProjectService } from '../project/project.service';
import { EnvironmentService } from '../unsorted/environment.service';

describe('DatatugNavContextService', () => {
	let service: DatatugNavContextService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				DatatugNavContextService,
				{ provide: AppContextService, useValue: { currentApp: of(undefined) } },
				{
					provide: ProjectContextService,
					useValue: {
						current: undefined,
						setCurrent: vi.fn(),
						current$: of(undefined),
					},
				},
				{ provide: Router, useValue: { events: of(), navigate: vi.fn() } },
				{
					provide: ProjectService,
					useValue: { watchProjectSummary: vi.fn(), getFull: vi.fn() },
				},
				{ provide: EnvironmentService, useValue: { getEnvSummary: vi.fn() } },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
			],
		});
		service = TestBed.inject(DatatugNavContextService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
