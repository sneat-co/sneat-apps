import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ErrorLogger } from '@sneat/core';

import { ListItemService } from './list-item.service';

describe('ListItemService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [
				ListItemService,
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
			],
		}),
	);

	it('should be created', () => {
		const service: ListItemService = TestBed.inject(ListItemService);
		expect(service).toBeTruthy();
	});
});
