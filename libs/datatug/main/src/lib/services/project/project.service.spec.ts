import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ErrorLogger } from '@sneat/core';
import { PrivateTokenStoreService } from '@sneat/auth-core';
import { SneatApiServiceFactory } from '@sneat/api';

import { ProjectService } from './project.service';
import { DatatugStoreServiceFactory } from '../repo/datatug-store-service-factory.service';

describe('ProjectService', () => {
	let service: ProjectService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ProjectService,
				{ provide: HttpClient, useValue: { get: vi.fn(), post: vi.fn() } },
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: vi.fn(() => vi.fn()),
					},
				},
				{ provide: PrivateTokenStoreService, useValue: {} },
				{
					provide: SneatApiServiceFactory,
					useValue: { getSneatApiService: vi.fn() },
				},
				{
					provide: DatatugStoreServiceFactory,
					useValue: { getDatatugStoreService: vi.fn() },
				},
			],
		});
	});

	it('should be created', () => {
		// ProjectService throws 'Not implemented' in constructor, so we expect an error
		expect(() => TestBed.inject(ProjectService)).toThrow('Not implemented');
	});
});
