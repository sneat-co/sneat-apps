import { TestBed } from '@angular/core/testing';

import { RetrospectiveService } from './retrospective.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environments/environment';

describe('RetrospectiveService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				AngularFireModule.initializeApp(environment.firebaseConfig),
			],
		})
	);

	it('should be created', () => {
		const service: RetrospectiveService = TestBed.inject(RetrospectiveService);
		expect(service).toBeTruthy();
	});
});
