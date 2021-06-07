import {BehaviorSubject} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {Inject, Injectable} from "@angular/core";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";

export enum AuthStatuses {
	authenticating = 'authenticating',
	authenticated = 'authenticated',
	notAuthenticated = 'notAuthenticated',
}

export type AuthStatus = AuthStatuses.authenticated | AuthStatuses.authenticating | AuthStatuses.notAuthenticated;

export interface IAuthState {
	status: AuthStatus;
}

@Injectable()
export class SneatAuthStateService {
	private readonly authState$ = new BehaviorSubject<AuthStatus>(AuthStatuses.authenticating);
	public readonly authState = this.authState$.asObservable();

	constructor(
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		readonly afAuth: AngularFireAuth,
	) {
		afAuth.idToken.subscribe({
			next: token => {
				this.authState$.next(token ? AuthStatuses.authenticated : AuthStatuses.notAuthenticated)
			},
			error: errorLogger.logErrorHandler('failed to get Firebase auth token')
		});
	}
}
