import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { DatatugStoreService } from './datatug-store.service';
import { DatatugUserService } from '../base/datatug-user-service';

describe('DatatugStoreService', () => {
	let service: DatatugStoreService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				DatatugStoreService,
				{ provide: HttpClient, useValue: { get: vi.fn(), post: vi.fn() } },
				{ provide: DatatugUserService, useValue: { datatugUserState: of({}) } },
			],
		});
		service = TestBed.inject(DatatugStoreService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
