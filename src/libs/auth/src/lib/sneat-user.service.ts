import {Inject, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {BehaviorSubject, Observable, ReplaySubject, Subscription} from 'rxjs';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {SneatTeamApiService} from '@sneat/api';
import {IUserRecord} from '@sneat/auth-models';
import {
	AuthStatuses,
	initialSneatAuthState,
	ISneatAuthState,
	ISneatAuthUser,
	SneatAuthStateService
} from "./sneat-auth-state-service";

export interface ISneatUserState extends ISneatAuthState {
	record?: IUserRecord | null; // undefined => not loaded yet, null = does not exists
}

@Injectable({providedIn: 'root'})
export class SneatUserService {
	public userDocSubscription?: Subscription;
	private userCollection: AngularFirestoreCollection<IUserRecord>;

	private uid?: string;
	private $userTitle?: string;

	private readonly userChanged$ = new ReplaySubject<string | undefined>();
	public readonly userChanged = this.userChanged$.asObservable();

	private readonly userState$ = new BehaviorSubject<ISneatUserState>(initialSneatAuthState);
	public readonly userState = this.userState$.asObservable();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly db: AngularFirestore,
		private readonly sneatAuthStateService: SneatAuthStateService,
		private readonly sneatTeamApiService: SneatTeamApiService,
	) {
		console.log('SneatUserService.constructor()');
		this.userCollection = db.collection<IUserRecord>('users');
		sneatAuthStateService.authState
			// .pipe(
			// 	filter(authState => !!authState.user),
			// )
			.subscribe({
				next: authState => {
					console.log('SneatUserService => authState:', authState);
					this.userChanged$.next(this.uid);
					if (authState.user) {
						this.onUserSignedIn(authState);
					} else {
						this.onUserSignedOut();
					}
				},
				error: this.errorLogger.logErrorHandler('failed to get sneat auth state'),
			})
	}

	public get currentUserId(): string | undefined {
		return this.uid;
	}

	public get userTitle(): string | undefined {
		return this.$userTitle;
	}

	public setUserTitle(title: string): Observable<void> {
		return this.sneatTeamApiService.post<void>('users/set_user_title', {title});
	}

	public onUserSignedIn(authState: ISneatAuthState): void {
		console.log('onUserSignedIn()', authState);
		const authUser = authState.user;
		if (authUser.uid === this.uid) {
			return;
		}
		// afUser.getIdToken().then(idToken => {
		// 	console.log('Firebase idToken:', idToken);
		// }).catch(err => this.errorLoggerService.logError(err, 'Failed to get Firebase ID token'));
		if (authUser.email && authUser.emailVerified) {
			this.$userTitle = authUser.email;
		}
		if (this.uid === authUser.uid) {
			return;
		}
		if (this.userDocSubscription) {
			this.userDocSubscription.unsubscribe();
			this.userDocSubscription = undefined;
		}
		const {uid} = authUser;
		this.uid = uid;
		this.userState$.next({
			...authState,
		});
		const userDocRef = this.userCollection.doc(uid);
		userDocRef.get().subscribe({
			next: userDoc => {
				console.log('userDoc:', userDoc.data());
			},
			error: this.errorLogger.logErrorHandler('failed to get user record from Firestore'),
		});
		this.userDocSubscription = userDocRef
			.snapshotChanges()
			.subscribe(changes => {
				console.log('SneatUserService => User record changed', changes);
				if (changes.type === 'value' || changes.type === 'added' || changes.type === 'removed') {
					const userDocSnapshot = changes.payload;
					console.log('SneatUserService => userDocSnapshot.exists:', userDocSnapshot.exists)
					if (userDocSnapshot.exists) {
						if (userDocSnapshot.ref.id === this.uid) { // Should always be equal as we unsubscribe if uid changes
							const userState: ISneatUserState = {
								...authState,
								record: userDocSnapshot.data() as IUserRecord
							};
							this.userState$.next(userState);
						}
					} else {
						this.userState$.next({...authState, record: null})
						setTimeout(() => this.createUserRecord(userDocRef.ref, authUser), 1);
					}
				}
			}, this.errorLogger.logErrorHandler('failed to process user changed'));
	}

	private onUserSignedOut(): void {
		this.uid = undefined;
		if (this.userDocSubscription) {
			this.userDocSubscription.unsubscribe();
		}
	}

	private createUserRecord(userDocRef: DocumentReference, authUser: ISneatAuthUser): void {
		if (this.userState$.value) {
			return;
		}
		this.db.firestore.runTransaction(async tx => {
			if (this.userState$.value) {
				return undefined;
			}
			const u = await tx.get(userDocRef);
			if (!u.exists) {
				const title = authUser.displayName || authUser.email || authUser.uid;
				const user: IUserRecord = authUser.email
					? {title, email: authUser.email, emailVerified: authUser.emailVerified}
					: {title};
				await tx.set(userDocRef, user);
				return user;
			}
			return undefined;
		}).then(user => {
			if (user) {
				console.log('user record created:', user);
			}
			if (!this.userState$.value) {
				const userState: ISneatUserState = {
					status: AuthStatuses.authenticated,
					record: user,
					user: authUser,
				};
				this.userState$.next(userState);
			}
		}).catch(this.errorLogger.logErrorHandler('failed to create user record'));
	}
}
