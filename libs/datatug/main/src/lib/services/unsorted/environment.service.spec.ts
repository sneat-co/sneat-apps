import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';

import { EnvironmentService } from './environment.service';
import { ProjectContextService } from '../project/project-context.service';
import { ProjectService } from '../project/project.service';
import { StoreApiService } from '../repo/store-api.service';

describe('EnvironmentService', () => {
	let service: EnvironmentService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				EnvironmentService,
				{
					provide: ProjectContextService,
					useValue: { current: undefined, setCurrent: vi.fn() },
				},
				{ provide: SneatApiService, useValue: {} },
				{ provide: ProjectService, useValue: {} },
				{ provide: StoreApiService, useValue: { get: vi.fn() } },
			],
		});
		service = TestBed.inject(EnvironmentService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
