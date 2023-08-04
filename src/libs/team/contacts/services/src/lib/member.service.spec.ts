import { TestBed } from '@angular/core/testing';

import { MemberService } from './member.service';
import { TeamService } from '../../../../services/src/lib/team.service';
import { UserService } from './user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MemberService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			],
			providers: [TeamService, UserService],
		}),
	);

	it('should be created', () => {
		const service: MemberService = TestBed.inject(MemberService);
		expect(service).toBeTruthy();
	});
});
