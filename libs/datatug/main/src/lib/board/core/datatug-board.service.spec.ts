import { TestBed } from '@angular/core/testing';

import { DatatugBoardService } from './datatug-board.service';

describe('BoardService', () => {
	let service: DatatugBoardService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DatatugBoardService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
