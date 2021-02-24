import {TestBed} from '@angular/core/testing';

import {TeamNavService} from './team-nav.service';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../environments/environment';

describe('TeamNavService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [
			RouterTestingModule,
			AngularFireModule.initializeApp(environment.firebaseConfig),
		],
	}));

	it('should be created', () => {
		const service: TeamNavService = TestBed.inject(TeamNavService);
		expect(service).toBeTruthy();
	});
});
