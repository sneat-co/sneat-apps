import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SneatApiService } from './sneat-api-service';

@Injectable({ providedIn: 'root' })
export class SneatTeamApiService extends SneatApiService {
	constructor(
		httpClient: HttpClient,
		// TODO: Get rid of hard dependency on AngularFireAuth and instead have some token provider
		afAuth?: AngularFireAuth,
	) {
		super(httpClient, undefined, 'https://api.sneat.team/v0/');
		afAuth?.idToken.subscribe(this.setFirebaseToken);
	}
}
