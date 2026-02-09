import { TestBed } from '@angular/core/testing';

import { QueriesService } from './queries.service';
import { QUERY_PROJ_ITEM_SERVICE } from './queries.service.token';

describe('QueriesService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				QueriesService,
				{
					provide: QUERY_PROJ_ITEM_SERVICE,
					useValue: {
						getFolder: vi.fn(),
						getProjItem: vi.fn(),
						createProjItem: vi.fn(),
						updateProjItem: vi.fn(),
						deleteProjItem: vi.fn(),
					},
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(QueriesService)).toBeTruthy();
	});
});
