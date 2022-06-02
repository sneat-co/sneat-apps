import { Inject, Injectable } from '@angular/core';
import {
	Action,
	AngularFirestore,
	AngularFirestoreCollection,
	DocumentSnapshot,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, EMPTY, Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
// import { SneatTeamApiService } from '@sneat/api';
import { IUserRecord } from '@sneat/auth-models';
import { initialSneatAuthState, ISneatAuthState, SneatAuthStateService } from '@sneat/auth';
import { SneatApiService } from '@sneat/api';
import { HttpClient } from '@angular/common/http';

export interface ISneatUserState extends ISneatAuthState {
	record?: IUserRecord | null; // undefined => not loaded yet, null = does not exists
}

const UsersCollection = 'users';

@Injectable({ providedIn: 'root' }) // TODO: lazy loading
export class SneatUserService {
	public userDocSubscription?: Subscription;
	private userCollection: AngularFirestoreCollection<IUserRecord>;

	private uid?: string;
	private $userTitle?: string;

	private readonly userChanged$ = new ReplaySubject<string | undefined>(1);
	public readonly userChanged = this.userChanged$.asObservable();

	private readonly userState$ = new BehaviorSubject<ISneatUserState>(
		initialSneatAuthState,
	);
	public readonly userState = this.userState$.asObservable();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly httpClient: HttpClient,
		private readonly db: AngularFirestore,
		private readonly sneatAuthStateService: SneatAuthStateService,
		private readonly sneatApiService: SneatApiService,
		// private readonly sneatTeamApiService: SneatTeamApiService
	) {

		console.log('SneatUserService.constructor()');
		this.userCollection = db.collection<IUserRecord>(UsersCollection);
		sneatAuthStateService.authState
			.subscribe({
				next: this.onAuthStateChanged,
				error: this.errorLogger.logErrorHandler(
					'failed to get sneat auth state',
				),
			});
	}

	public get currentUserId(): string | undefined {
		return this.uid;
	}

	public get userTitle(): string | undefined {
		return this.$userTitle;
	}


	public onUserSignedIn(authState: ISneatAuthState): void {
		console.log('onUserSignedIn()', authState);
		const authUser = authState.user;
		// afUser.getIdToken().then(idToken => {
		// 	console.log('Firebase idToken:', idToken);
		// }).catch(err => this.errorLoggerService.logError(err, 'Failed to get Firebase ID token'));
		if (authUser?.email && authUser.emailVerified) {
			this.$userTitle = authUser.email;
		}
		if (this.uid === authUser?.uid) {
			return;
		}
		this.userDocSubscription?.unsubscribe();
		this.userDocSubscription = undefined;
		if (!authUser) {
			if (this.userState$.value?.record !== null) {
				this.userState$.next({ ...this.userState$.value });
			}
			return;
		}
		const { uid } = authUser;
		this.uid = uid;
		this.userState$.next({
			...authState,
		});
		const userDocRef = this.userCollection.doc(uid);
		console.log('SneatUserService: Loading user record...');
		this.userDocSubscription = userDocRef.snapshotChanges().subscribe({
			next: (userDocSnapshot) => this.userDocChanged(userDocSnapshot, authState),
			error: this.errorLogger.logErrorHandler('SneatUserService failed to get user record'),
		});
	}

	private onAuthStateChanged = (authState: ISneatAuthState): void => {
		console.log('SneatUserService => authState changed:', authState);
		if (authState.user) {
			this.onUserSignedIn(authState);
		} else {
			this.userState$.next(authState);
			this.onUserSignedOut();
		}
	};

	private userDocChanged(
		changes: Action<DocumentSnapshot<IUserRecord>>,
		authState: ISneatAuthState,
	): void {
		console.log('SneatUserService => userDocChanged:', changes, authState);
		if (
			changes.type === 'value' ||
			changes.type === 'added' ||
			changes.type === 'removed'
		) {
			const userDocSnapshot = changes.payload;
			if (userDocSnapshot.ref.id !== this.uid) {
				return; // Should always be equal as we unsubscribe if uid changes
			}
			// console.log('SneatUserService => userDocSnapshot.exists:', userDocSnapshot.exists)
			const authUser = authState.user;
			if (!userDocSnapshot.exists) {
				this.sneatApiService
					.post('users/create_user', {
						creator: location.host,
						title: authUser?.displayName,
						email: authUser?.email,
					})
					.subscribe({
						next: response => {
							console.log('User record created:', response);
						},
						error: this.errorLogger.logErrorHandler('failed to create user record'),
					});
			}
			this.userState$.next({
				...authState,
				record: userDocSnapshot.exists
					? (userDocSnapshot.data() as IUserRecord)
					: authUser ? { title: authUser.displayName || authUser.email || authUser.uid } : null,
			});
		}
	}

	private onUserSignedOut(): void {
		this.uid = undefined;
		if (this.userDocSubscription) {
			this.userDocSubscription.unsubscribe();
		}
	}

	// private createUserRecord(userDocRef: DocumentReference, authUser: ISneatAuthUser): void {
	// 	if (this.userState$.value) {
	// 		return;
	// 	}
	// 	this.db.firestore.runTransaction(async tx => {
	// 		if (this.userState$.value) {
	// 			return undefined;
	// 		}
	// 		const u = await tx.get(userDocRef);
	// 		if (!u.exists) {
	// 			const title = authUser.displayName || authUser.email || authUser.uid;
	// 			const user: IUserRecord = authUser.email
	// 				? {title, email: authUser.email, emailVerified: authUser.emailVerified}
	// 				: {title};
	// 			await tx.set(userDocRef, user);
	// 			return user;
	// 		}
	// 		return undefined;
	// 	}).then(user => {
	// 		if (user) {
	// 			console.log('user record created:', user);
	// 		}
	// 		if (!this.userState$.value) {
	// 			const userState: ISneatUserState = {
	// 				status: AuthStatuses.authenticated,
	// 				record: user,
	// 				user: authUser,
	// 			};
	// 			this.userState$.next(userState);
	// 		}
	// 	}).catch(this.errorLogger.logErrorHandler('failed to create user record'));
	// }
}
