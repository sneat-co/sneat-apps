import { TestBed } from '@angular/core/testing';

import { TeamNavService } from './team-nav.service';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../environments/environment';

describe('TeamNavService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
			],
		}),
	);

	it('should be created', () => {
		const service: TeamNavService = TestBed.inject(TeamNavService);
		expect(service).toBeTruthy();
	});
});
