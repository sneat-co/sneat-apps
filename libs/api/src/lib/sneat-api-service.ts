import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { Auth as AngularFireAuth, onIdTokenChanged } from '@angular/fire/auth';
import { Observable, Subject, throwError } from 'rxjs';
import { ISneatApiService } from './sneat-api-service.interface';

const userIsNotAuthenticatedNoFirebaseToken =
	'User is not authenticated yet - no Firebase ID token';

export const SneatApiAuthTokenProvider = new InjectionToken('SneatApiAuthTokenProvider');
export const SneatApiBaseUrl = new InjectionToken('SneatApiBaseUrl');
export const DefaultSneatTeamApiBaseUrl = 'https://api.sneat.team/v0/';
export const DefaultSneatAppApiBaseUrl = 'https://sneat.eu/v0/';

@Injectable({ providedIn: 'root' }) // Should it be in root? Probably it is OK.
export class SneatApiService implements ISneatApiService, OnDestroy {
	private readonly destroyed = new Subject<void>();
	private authToken?: string;

	constructor(
		private readonly httpClient: HttpClient,
		afAuth: AngularFireAuth, // TODO: Get rid of hard dependency on AngularFireAuth and instead have some token provider using SneatApiAuthTokenProvider injection token
		@Inject(SneatApiBaseUrl) private readonly baseUrl?: string,
		// @Inject(SneatApiAuthTokenProvider) private authTokenProvider: Observable<string | undefined>,
	) {
		console.log('SneatApiService.constructor()', baseUrl);
		if (!baseUrl) {
			this.baseUrl = DefaultSneatAppApiBaseUrl;
		}
		onIdTokenChanged(afAuth, {
			next: (user) => {
				user?.getIdToken().then(this.setApiAuthToken).catch(err => console.error('getIdToken() error:', err));
			}, error: (error) => {
				console.error('onIdTokenChanged() error:', error);
			},
			complete: () => void 0,
		});
	}

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
	}

	// TODO: It's made public because we use it in Login page, might be a bad idea consider making private and rely on afAuth.idToken event
	setApiAuthToken = (token?: string) => {
		// console.log('setApiAuthToken()', token);
		this.authToken = token;
	};

	public post<T>(endpoint: string, body: unknown): Observable<T> {
		const url = this.baseUrl + endpoint;
		console.log('post()', endpoint, url, body);
		return (
			this.errorIfNotAuthenticated() ||
			this.httpClient.post<T>(url, body, {
				headers: this.headers(),
			})
		);
	}

	public put<T>(endpoint: string, body: unknown): Observable<T> {
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
		params?: HttpParams,
	): Observable<T> {
		return this.httpClient.get<T>(this.baseUrl + endpoint, {
			params,
		});
	}

	public postAsAnonymous<T>(
		endpoint: string,
		body: unknown,
	): Observable<T> {
		return this.httpClient.post<T>(this.baseUrl + endpoint, body, {
			headers: this.headers(),
		});
	}


	public delete<T>(endpoint: string, params?: HttpParams, body?: unknown): Observable<T> {
		console.log('delete()', endpoint, params);
		const url = this.baseUrl + endpoint;
		return (
			this.errorIfNotAuthenticated() ||
			this.httpClient.delete<T>(url, {
				params,
				headers: this.headers(),
				body,
			})
		);
	}

	private errorIfNotAuthenticated(): Observable<never> | undefined {
		const result: Observable<never> | undefined = (
			(!this.authToken &&
				throwError(() => userIsNotAuthenticatedNoFirebaseToken)) ||
			undefined
		);
		return result;
	}

	private headers(): HttpHeaders {
		let headers = new HttpHeaders();
		if (this.authToken) {
			headers = headers.append('Authorization', 'Bearer ' + this.authToken);
		}
		return headers;
	}
}
