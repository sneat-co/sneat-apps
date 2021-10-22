import { TestBed } from '@angular/core/testing';

import { DatatugFoldersService } from './datatug-folders.service';

describe('DatatugFoldersService', () => {
	let service: DatatugFoldersService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DatatugFoldersService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
