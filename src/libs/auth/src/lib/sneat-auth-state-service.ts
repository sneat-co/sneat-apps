import {BehaviorSubject} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Inject, Injectable} from "@angular/core";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import firebase from "firebase/compat/app";
import {distinctUntilChanged, shareReplay, tap} from 'rxjs/operators';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {RandomId} from '@sneat/random';

export enum AuthStatuses {
	authenticating = 'authenticating',
	authenticated = 'authenticated',
	notAuthenticated = 'notAuthenticated',
}

export type AuthStatus = AuthStatuses.authenticated | AuthStatuses.authenticating | AuthStatuses.notAuthenticated;

export interface ISneatAuthUser extends firebase.UserInfo {
	isAnonymous: boolean;
	emailVerified: boolean;
}

export interface ISneatAuthState {
	status: AuthStatus;
	token?: string;
	user?: ISneatAuthUser;
}

const initialAuthStatus = AuthStatuses.authenticating;
export const initialSneatAuthState = {status: initialAuthStatus};

@Injectable({providedIn: 'root'})
export class SneatAuthStateService {
	private readonly id = RandomId.newRandomId(5);

	private readonly authStatus$ = new BehaviorSubject<AuthStatus>(initialAuthStatus);
	public readonly authStatus = this.authStatus$.asObservable().pipe(distinctUntilChanged());

	private readonly authUser$ = new BehaviorSubject<ISneatAuthUser>(undefined);
	public readonly authUser = this.authUser$.asObservable();

	private readonly authState$ = new BehaviorSubject<ISneatAuthState>(initialSneatAuthState);
	public readonly authState = this.authState$.asObservable()
		.pipe(
			// tap(v => console.log('SneatAuthStateService => SneatAuthState:', v)),
			shareReplay(1),
		);

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly afAuth: AngularFireAuth,
	) {
		console.log(`SneatAuthStateService.constructor(): id=${this.id}`);
		afAuth.idToken.subscribe({
			next: token => {
				// console.log('SneatAuthStateService => token', token);
				const status: AuthStatus = token ? AuthStatuses.authenticated : AuthStatuses.notAuthenticated;
				this.authStatus$.next(status);
				const current = this.authState$.value || {};
				this.authState$.next({
					...current,
					status,
					token,
					user: this.authUser$.value,
				});
			},
			error: errorLogger.logErrorHandler('failed to get Firebase auth token')
		});
		afAuth.user.subscribe({
			next: (fbUser: firebase.User) => {
				// console.log(`SneatAuthStateService => authStatus: ${this.authStatus$.value}; fbUser`, fbUser);
				const user: ISneatAuthUser = fbUser && {
					isAnonymous: fbUser.isAnonymous,
					emailVerified: fbUser.emailVerified,
					email: fbUser.email,
					uid: fbUser.uid,
					displayName: fbUser.displayName,
					phoneNumber: fbUser.phoneNumber,
					photoURL: fbUser.photoURL,
					providerId: fbUser.providerId,
				};
				const status = user ? AuthStatuses.authenticated : AuthStatuses.notAuthenticated
				this.authStatus$.next(status);
				this.authUser$.next(user);
				this.authState$.next({...this.authState$.value, user, status});
			},
			error: this.errorLogger.logErrorHandler('failed to retrieve Firebase auth user information'),
		});
	}

	public signOut(): Promise<void> {
		return this.afAuth.signOut()
	}
}
