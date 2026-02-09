import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';

import { SchemaService } from './schema.service';

describe('SchemaService', () => {
	let service: SchemaService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				SchemaService,
				{ provide: SneatApiService, useValue: { post: vi.fn() } },
			],
		});
		service = TestBed.inject(SchemaService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
