import { TestBed } from '@angular/core/testing';

import { ScrumService } from './scrum.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';
import { TeamService } from './team.service';
import { UserService } from './user-service';

describe('ScrumService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
			providers: [TeamService, UserService],
		}),
	);

	it('should be created', () => {
		const service: ScrumService = TestBed.inject(ScrumService);
		expect(service).toBeTruthy();
	});
});
