import { TestBed } from '@angular/core/testing';
import { SneatApiServiceFactory } from '@sneat/api';

import { DatatugBoardService } from './datatug-board.service';

describe('BoardService', () => {
	let service: DatatugBoardService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				DatatugBoardService,
				{
					provide: SneatApiServiceFactory,
					useValue: { getSneatApiService: vi.fn() },
				},
			],
		});
		service = TestBed.inject(DatatugBoardService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
