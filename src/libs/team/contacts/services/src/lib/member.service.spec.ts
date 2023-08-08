import { TestBed } from '@angular/core/testing';
import { TeamService } from '@sneat/team/services';

import { MemberService } from './member.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MemberService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			],
			providers: [TeamService],
		}),
	);

	it('should be created', () => {
		const service: MemberService = TestBed.inject(MemberService);
		expect(service).toBeTruthy();
	});
});
