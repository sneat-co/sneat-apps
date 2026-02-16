import {
  Injectable,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  // Action,
  Firestore as AngularFirestore,
  CollectionReference,
  DocumentSnapshot,
  collection,
  doc,
  onSnapshot,
  Unsubscribe,
} from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IUserRecord } from '@sneat/auth-models';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import {
  initialSneatAuthState,
  ISneatAuthState,
  ISneatAuthUser,
  SneatAuthStateService,
} from '../sneat-auth-state-service';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {
  IInitUserRecordRequest,
  UserRecordService,
} from './user-record.service';

export interface ISneatUserState extends ISneatAuthState {
  record?: IUserRecord | null; // undefined => not loaded yet, null = does not exists
}

const UsersCollection = 'users';

@Injectable({ providedIn: 'root' }) // TODO: lazy loading
export class SneatUserService {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly sneatApiService = inject(SneatApiService);
  private readonly userRecordService = inject(UserRecordService);

  // private userDocSubscription?: Subscription;
  private readonly injector = inject(Injector);
  private readonly userCollection: CollectionReference<IUserRecord>;
  private readonly userDocRef = (uid: string) =>
    runInInjectionContext(this.injector, () => doc(this.userCollection, uid));

  private uid?: string;
  private $userTitle?: string;

  private readonly userChanged$ = new ReplaySubject<string | undefined>(1);
  public readonly userChanged = this.userChanged$.asObservable();

  private readonly userState$ = new BehaviorSubject<ISneatUserState>(
    initialSneatAuthState,
  );

  public readonly userState = this.userState$.asObservable();

  private _unsubscribeFromUserDoc?: Unsubscribe;

  private unsubscribeFromUserDoc(from: string) {
    if (this._unsubscribeFromUserDoc) {
// console.log(
        'SneatUserService.unsubscribeFromUserDoc() called from ' + from,
      );
      this._unsubscribeFromUserDoc();
      this._unsubscribeFromUserDoc = undefined;
    }
  }

  constructor() {
    const afs = inject(AngularFirestore);
    const sneatAuthStateService = inject(SneatAuthStateService);
// console.log('SneatUserService.constructor()');
    this.userCollection = collection(
      afs,
      UsersCollection,
    ) as CollectionReference<IUserRecord>;
    sneatAuthStateService.authState.subscribe({
      next: this.onAuthStateChanged,
      error: this.errorLogger.logErrorHandler('failed to get sneat auth state'),
    });
  }

  public get currentUserID(): string | undefined {
    return this.uid;
  }

  // public get userTitle(): string | undefined {
  // 	return this.$userTitle;
  // }

  public setUserCountry(countryID: string): Observable<void> {
    return this.sneatApiService.post('users/set_user_country', { countryID });
  }

  public onUserSignedIn(authState: ISneatAuthState): void {
// console.log('onUserSignedIn()', authState);
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
    this.unsubscribeFromUserDoc('onUserSignedIn()');
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
    this.userChanged$.next(uid);
    this.watchUserRecord(uid, authState);
  }

  private watchUserRecord(uid: string, authState: ISneatAuthState): void {
// console.log(
      `SneatUserService.watchUserRecord(uid=${uid}): Loading user record...`,
    );
    this.unsubscribeFromUserDoc('whatUserRecord()');

    // TODO: Remove - setTimeout() not needed but trying to troubleshoot user record issue
    setTimeout(() => {
      try {
        const userDocRef = this.userDocRef(uid);
        this._unsubscribeFromUserDoc = runInInjectionContext(
          this.injector,
          () =>
            onSnapshot(userDocRef, {
              next: (userDocSnapshot) => {
// console.log(
                  `SneatUserService.watchUserRecord(uid=${uid}) => userDocSnapshot:`,
                  userDocSnapshot,
                );
                this.onAuthStateChanged(authState);
                this.userDocChanged(userDocSnapshot, authState);
              },
              error: (err) => {
                console.error(
                  `SneatUserService.watchUserRecord(uid=${uid}) => failed:`,
                  err,
                );
              },
            }),
        );
      } catch (err) {
        console.error(
          `SneatUserService.watchUserRecord(uid=${uid}) => Failed to setup watcher for user record::`,
          err,
        );
        return;
      }
    }, 100);
  }

  private onAuthStateChanged = (authState: ISneatAuthState): void => {
    // console.log('SneatUserService => authState changed:', authState);
    if (authState.user) {
      this.onUserSignedIn(authState);
    } else {
      this.userState$.next(authState);
      this.userChanged$.next(undefined);
      this.onUserSignedOut();
    }
  };

  private userDocChanged(
    userDocSnapshot: DocumentSnapshot<IUserRecord>,
    authState: ISneatAuthState,
  ): void {
// console.log(
      'SneatUserService.userDocChanged() => userDocSnapshot.exists:',
      userDocSnapshot.exists(),
      'authState:',
      authState,
      'userDocSnapshot:',
      userDocSnapshot,
    );
    if (userDocSnapshot.ref.id !== this.uid) {
      console.error(
        'userDocSnapshot.ref.id !== this.uid - Should always be equal as we unsubscribe if uid changes',
      );
      return;
    }
    // console.log('SneatUserService => userDocSnapshot.exists:', userDocSnapshot.exists)
    const authUser = authState.user;
    if (authUser && !userDocSnapshot.exists()) {
      this.initUserRecordFromAuthUser(authUser);
    }
    const userRecord: IUserRecord | null = userDocSnapshot.exists()
      ? (userDocSnapshot.data() as IUserRecord)
      : authUser
        ? { title: authUser.displayName || authUser.email || authUser.uid }
        : null;

    this.userState$.next({
      ...authState,
      record: userRecord,
    });
  }

  private initUserRecordFromAuthUser(authUser: ISneatAuthUser): void {
    let request: IInitUserRecordRequest = {
      email: authUser.email || undefined,
      emailIsVerified: authUser.emailVerified,
      authProvider: authUser?.providerId,
    };
    if (authUser?.displayName) {
      request = { ...request, names: { fullName: authUser.displayName } };
    }
    this.userRecordService.initUserRecord(request).subscribe({
      next: (userDto) => {
// console.log('User record created:', userDto);
      },
      error: this.errorLogger.logErrorHandler('failed to create user record'),
    });
  }

  private onUserSignedOut(): void {
    this.uid = undefined;
    this.unsubscribeFromUserDoc('onUserSignedOut()');
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
