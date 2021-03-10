import {BehaviorSubject} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {Inject, Injectable} from "@angular/core";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";

export enum AuthStates {
	authenticating = 'authenticating',
	authenticated = 'authenticated',
	notAuthenticated = 'notAuthenticated',
}

export type AuthState = AuthStates.authenticated | AuthStates.authenticating | AuthStates.notAuthenticated;

@Injectable()
export class SneatAuthStateService {
	private readonly authState$ = new BehaviorSubject<AuthState>(AuthStates.authenticating);
	public readonly authState = this.authState$.asObservable();

	constructor(
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		readonly afAuth: AngularFireAuth,
	) {
		afAuth.idToken.subscribe({
			next: token => {
				this.authState$.next(token ? AuthStates.authenticated : AuthStates.notAuthenticated)
			},
			error: errorLogger.logErrorHandler('failed to get Firebase auth token')
		});
	}
}
