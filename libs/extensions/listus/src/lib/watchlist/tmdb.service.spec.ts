import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TmdbService } from './tmdb.service';

describe('TmdbService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [TmdbService],
			imports: [HttpClientModule],
		}),
	);

	it('should be created', () => {
		const service: TmdbService = TestBed.inject(TmdbService);
		expect(service).toBeTruthy();
	});
});
