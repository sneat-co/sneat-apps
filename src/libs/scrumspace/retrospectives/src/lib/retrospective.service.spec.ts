import { TestBed } from '@angular/core/testing';

import { RetrospectiveService } from './retrospective.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RetrospectiveService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			],
		}),
	);

	it('should be created', () => {
		const service: RetrospectiveService = TestBed.inject(RetrospectiveService);
		expect(service).toBeTruthy();
	});
});
