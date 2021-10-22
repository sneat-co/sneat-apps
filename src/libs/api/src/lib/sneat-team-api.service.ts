import { Injectable, Optional } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ISneatApiService } from './sneat-api-service.interface';

const userIsNotAuthenticatedNoFirebaseToken =
	'User is not authenticated yet - no Firebase ID token';

export class SneatApiService implements ISneatApiService {
	constructor(
		private readonly httpClient: HttpClient,
		private firebaseIdToken?: string,
		private readonly baseUrl?: string
	) {
		// if (!baseUrl) {
		// 	baseUrl = 'https://api.sneat.team/v0/';
		// }
		// if (firebaseIdToken) {
		// 	this.setFirebaseToken(firebaseIdToken);
		// }
	}

	// TODO: It's made public because we use it in Login page, might be a bad idea consider making private and rely on afAuth.idToken event
	setFirebaseToken = (token?: string | null) => {
		this.firebaseIdToken = token ?? undefined;
	};

	public post<T>(endpoint: string, body: any): Observable<T> {
		console.log('post()', endpoint);
		const url = this.baseUrl + endpoint;
		return (
			this.errorIfNotAuthenticated() ||
			this.httpClient.post<T>(url, body, {
				headers: this.headers(),
			})
		);
	}

	public put<T>(endpoint: string, body: any): Observable<T> {
		return (
			this.errorIfNotAuthenticated() ||
			this.httpClient.put<T>(this.baseUrl + endpoint, body, {
				headers: this.headers(),
			})
		);
	}

	public get<T>(endpoint: string, params?: HttpParams): Observable<T> {
		return (
			this.errorIfNotAuthenticated() ||
			this.httpClient.get<T>(this.baseUrl + endpoint, {
				headers: this.headers(),
				params,
			})
		);
	}

	public getAsAnonymous<T>(
		endpoint: string,
		params?: HttpParams
	): Observable<T> {
		return this.httpClient.get<T>(this.baseUrl + endpoint, {
			params,
		});
	}

	public delete<T>(endpoint: string, params: HttpParams): Observable<T> {
		return (
			this.errorIfNotAuthenticated() ||
			this.httpClient.delete<T>(this.baseUrl + endpoint, {
				params,
				headers: this.headers(),
			})
		);
	}

	private errorIfNotAuthenticated(): Observable<never> | undefined {
		return (
			(!this.firebaseIdToken &&
				throwError(userIsNotAuthenticatedNoFirebaseToken)) ||
			undefined
		);
	}

	private headers(): HttpHeaders {
		let headers = new HttpHeaders();
		if (this.firebaseIdToken) {
			headers = headers.append('X-Firebase-Id-Token', this.firebaseIdToken);
		}
		return headers;
	}
}

@Injectable({ providedIn: 'root' })
export class SneatTeamApiService extends SneatApiService {
	constructor(
		httpClient: HttpClient,
		// TODO: Get rid of hard dependency on AngularFireAuth and instead have some token provider
		afAuth?: AngularFireAuth
	) {
		super(httpClient, undefined, 'https://api.sneat.team/v0/');
		afAuth?.idToken.subscribe(this.setFirebaseToken);
	}
}
