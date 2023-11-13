import { TestBed } from '@angular/core/testing';

import { MovieService } from './movie.service';

describe('MovieService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [MovieService],
		}),
	);

	it('should be created', () => {
		const service: MovieService = TestBed.inject(MovieService);
		expect(service).toBeTruthy();
	});
});
