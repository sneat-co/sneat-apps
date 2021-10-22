import { TestBed } from '@angular/core/testing';

import { MemberService } from './member.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';
import { TeamService } from './team.service';
import { UserService } from './user-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MemberService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [TeamService, UserService],
		})
	);

	it('should be created', () => {
		const service: MemberService = TestBed.inject(MemberService);
		expect(service).toBeTruthy();
	});
});
