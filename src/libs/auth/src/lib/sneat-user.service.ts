import {Inject, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {BehaviorSubject, Observable, ReplaySubject, Subscription} from 'rxjs';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import {SneatTeamApiService} from '@sneat/api';
import {IUserRecord} from '@sneat/auth-models';
import {IRecord} from '@sneat/data';

@Injectable()
export class SneatUserService {
	public userDocSubscription?: Subscription;
	private readonly userCollection: AngularFirestoreCollection<IUserRecord>;

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
		this.userCollection = db.collection<IUserRecord>('users');
		afAuth.authState.subscribe(afUser => {
			if (afUser) {
				this.onUserSignedIn(afUser);
			} else {
				this.onUserSignedOut();
			}
			this.userChanged$.next(this.uid);
		});
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
		console.log('onUserSignedIn()');
		if (afUser.uid === this.uid) {
			return;
		}
		console.log('afUser:', afUser);
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
		const userDoc = this.userCollection.doc(uid);
		this.userDocSubscription = userDoc
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
						setTimeout(() => this.createUserRecord(userDoc.ref, afUser), 1);
					}
				}
			}, err => this.errorLogger.logErrorHandler('failed to process user changed'));
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
