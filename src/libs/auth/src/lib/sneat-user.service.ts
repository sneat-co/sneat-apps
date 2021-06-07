import {Inject, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {BehaviorSubject, Observable, ReplaySubject, Subscription} from 'rxjs';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import {SneatTeamApiService} from '@sneat/api';
import {IUserRecord} from '@sneat/auth-models';
import {IRecord} from '@sneat/data';

@Injectable({providedIn: 'root'})
export class SneatUserService {
	public userDocSubscription?: Subscription;
	private userCollection: AngularFirestoreCollection<IUserRecord>;

	private uid?: string;
	private $userTitle?: string;

	private readonly userChanged$ = new ReplaySubject<string | undefined>();
	public readonly userChanged = this.userChanged$.asObservable();

	private readonly userRecord$ = new BehaviorSubject<IRecord<IUserRecord> | undefined>(undefined);
	public readonly userRecord = this.userRecord$.asObservable();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly db: AngularFirestore,
		private readonly afAuth: AngularFireAuth,
		private readonly sneatTeamApiService: SneatTeamApiService,
	) {
		console.log('SneatUserService.constructor()');
		afAuth.user.subscribe(afUser => {
			console.log('SneatUserService received Firebase auth user with UID=', afUser?.uid, afUser?.email, afUser?.emailVerified);
			this.userChanged$.next(this.uid);
			if (afUser) {
				// afUser.getIdToken().then(idToken => {
				// 	console.log('idToken:', idToken);
				// });
				this.userCollection = db.collection<IUserRecord>('users');
				this.onUserSignedIn(afUser);
			} else {
				this.onUserSignedOut();
			}
		}, this.errorLogger.logErrorHandler('SneatUserService failed to get Firebase auth state'));
		// this.userRecord.subscribe(userRecord => console.log('userRecord:', userRecord));
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

	public onUserSignedIn(afUser: firebase.User): void {
		console.log('onUserSignedIn()', afUser);
		if (afUser.uid === this.uid) {
			return;
		}
		// afUser.getIdToken().then(idToken => {
		// 	console.log('Firebase idToken:', idToken);
		// }).catch(err => this.errorLoggerService.logError(err, 'Failed to get Firebase ID token'));
		if (afUser.email && afUser.emailVerified) {
			this.$userTitle = afUser.email;
		}
		if (this.uid === afUser.uid) {
			return;
		}
		if (this.userDocSubscription) {
			this.userDocSubscription.unsubscribe();
			this.userDocSubscription = undefined;
		}
		const {uid} = afUser;
		this.uid = uid;
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
				console.log('Firestore: User record changed', changes);
				if (changes.type === 'value' || changes.type === 'added') {
					const userDocSnapshot = changes.payload;
					if (userDocSnapshot.exists) {
						if (userDocSnapshot.ref.id === this.uid) { // Should always be equal as we unsubscribe if uid changes
							const userRecord: IRecord<IUserRecord> = {
								id: uid,
								data: userDocSnapshot.data() as IUserRecord,
							};
							this.userRecord$.next(userRecord);
						}
					} else {
						setTimeout(() => this.createUserRecord(userDocRef.ref, afUser), 1);
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

	private createUserRecord(userDocRef: DocumentReference, afUser: firebase.User): void {
		if (this.userRecord$.value) {
			return;
		}
		this.db.firestore.runTransaction(async tx => {
			if (this.userRecord$.value) {
				return undefined;
			}
			const u = await tx.get(userDocRef);
			if (!u.exists) {
				const title = afUser.displayName || afUser.email || afUser.uid;
				const user: IUserRecord = afUser.email
					? {title, email: afUser.email, emailVerified: afUser.emailVerified}
					: {title};
				await tx.set(userDocRef, user);
				return user;
			}
			return undefined;
		}).then(user => {
			if (user) {
				console.log('user record created:', user);
			}
			if (!this.userRecord$.value) {
				this.userRecord$.next({id: afUser.uid, data: user});
			}
		}).catch(this.errorLogger.logErrorHandler('failed to create user record'));
	}
}
