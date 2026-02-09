import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { EntityService } from './entity.service';
import { StoreApiService } from '../repo/store-api.service';

describe('EntityService', () => {
	let service: EntityService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				EntityService,
				{
					provide: StoreApiService,
					useValue: {
						get: vi.fn(),
						post: vi.fn(),
						put: vi.fn(),
						delete: vi.fn(),
					},
				},
				{ provide: HttpClient, useValue: { get: vi.fn(), post: vi.fn() } },
			],
		});
		service = TestBed.inject(EntityService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
