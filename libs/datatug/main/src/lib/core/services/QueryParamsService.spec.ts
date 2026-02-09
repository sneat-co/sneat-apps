import { TestBed } from '@angular/core/testing';

import { QueryParamsService } from './QueryParamsService';

describe('QueryParamsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				QueryParamsService,
				{
					provide: Location,
					useValue: { href: 'http://localhost/' },
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(QueryParamsService)).toBeTruthy();
	});
});
