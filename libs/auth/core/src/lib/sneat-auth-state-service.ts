import { SignInWithOAuthOptions } from '@capacitor-firebase/authentication/dist/esm/definitions';
import { Capacitor } from '@capacitor/core';
import {
  FirebaseAuthentication,
  SignInResult,
} from '@capacitor-firebase/authentication';
import {
  AnalyticsService,
  EnumAsUnionOfKeys,
  IAnalyticsService,
} from '@sneat/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';
import {
  Auth,
  AuthProvider,
  getAuth,
  signInWithCredential,
  User,
  UserCredential,
  UserInfo,
} from '@angular/fire/auth';

import {
  GoogleAuthProvider,
  OAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithEmailLink,
  signInWithCustomToken,
  signInWithPopup,
  linkWithPopup,
  unlink,
} from 'firebase/auth';

// TODO: fix & remove this eslint hint @nrwl/nx/enforce-module-boundaries

import { newRandomId } from '@sneat/random';

export enum AuthStatuses {
  authenticating = 'authenticating',
  authenticated = 'authenticated',
  notAuthenticated = 'notAuthenticated',
}

export type AuthStatus = EnumAsUnionOfKeys<typeof AuthStatuses>;

export interface ISneatAuthUser extends UserInfo {
  readonly isAnonymous: boolean;
  readonly emailVerified: boolean;
  readonly providerData: readonly UserInfo[];
}

export interface ISneatAuthState {
  readonly status: AuthStatus;
  readonly token?: string | null;
  readonly user?: ISneatAuthUser | null;
  readonly err?: unknown;
}

const initialAuthStatus = AuthStatuses.authenticating;
export const initialSneatAuthState = { status: initialAuthStatus };

@Injectable({ providedIn: 'root' })
export class SneatAuthStateService {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly analyticsService =
    inject<IAnalyticsService>(AnalyticsService);
  readonly fbAuth = inject(Auth);

  private readonly id = newRandomId({ len: 5 });

  private readonly authStatus$ = new BehaviorSubject<AuthStatus>(
    initialAuthStatus,
  );
  public readonly authStatus = this.authStatus$
    .asObservable()
    .pipe(distinctUntilChanged());

  private readonly authUser$ = new BehaviorSubject<
    ISneatAuthUser | null | undefined
  >(undefined);
  public readonly authUser = this.authUser$.asObservable();

  private readonly authState$ = new BehaviorSubject<ISneatAuthState>(
    initialSneatAuthState,
  );
  public readonly authState = this.authState$.asObservable().pipe(
    // tap(v => console.log('SneatAuthStateService => SneatAuthState:', v)),
    shareReplay(1),
  );

  // private readonly fbAuth: Auth;

  constructor() {
    const errorLogger = this.errorLogger;

    console.log(`SneatAuthStateService.constructor(): id=${this.id}`);
    this.fbAuth.onIdTokenChanged({
      next: (firebaseUser) => {
        const status: AuthStatus = firebaseUser
          ? AuthStatuses.authenticated
          : AuthStatuses.notAuthenticated;
        if (
          firebaseUser &&
          this.authState$.value?.user?.uid !== firebaseUser?.uid
        ) {
          this.analyticsService.identify(firebaseUser.uid);
        }
        firebaseUser
          ?.getIdToken()
          .then((token) => {
            const current = this.authState$.value || {};
            this.authState$.next({
              ...current,
              status,
              token,
              user: this.authUser$.value,
            });
            this.authStatus$.next(status); // Should be after authState$
          })
          .catch((err) => {
            const current = this.authState$.value || {};
            this.authState$.next({
              ...current,
              err: `fbUser.getIdToken() failed: ${err}`,
            });
            this.errorLogger.logError(err, 'Failed in fbUser.getIdToken()');
          });
      },
      error: (err) => {
        const current = this.authState$.value || {};
        this.authState$.next({
          ...current,
          err: `fbAuth.onIdTokenChanged() failed: ${err}`,
        });
        errorLogger.logError(err, 'failed in fbAuth.onIdTokenChanged');
      },
      complete: () => void 0,
    });
    this.fbAuth.onAuthStateChanged({
      complete: () => void 0,
      next: (fbUser) => {
        console.log(
          `SneatAuthStateService => authStatus: ${this.authStatus$.value}; fbUser`,
          fbUser,
        );

        const authUser = createSneatAuthUserFromFbUser(fbUser);

        const status = authUser
          ? AuthStatuses.authenticated
          : AuthStatuses.notAuthenticated;
        this.authStatus$.next(status);
        this.authUser$.next(authUser);
        this.authState$.next({
          ...this.authState$.value,
          user: authUser,
          status,
        });
      },
      error: (err) => {
        this.errorLogger.logError(
          err,
          'failed to retrieve Firebase auth user information',
        );
        const current = this.authState$.value || {};
        this.authState$.next({
          ...current,
          err: `fbAuth.onAuthStateChanged() failed: ${err}`,
        });
      },
    });
  }

  public signOut(): Promise<void> {
    return this.fbAuth.signOut();
  }

  public signInWithToken(token: string): Promise<UserCredential> {
    return signInWithCustomToken(this.fbAuth, token);
  }

  public signInWithEmailLink(email: string): Observable<UserCredential> {
    return from(signInWithEmailLink(this.fbAuth, email));
  }

  private isSigningInWith?: AuthProviderName;

  private async signInOnNativeLayer(
    authProviderID: AuthProviderID,
  ): Promise<UserCredential> {
    let signInResult: SignInResult | undefined;

    const o: SignInWithOAuthOptions = { skipNativeAuth: true };

    switch (authProviderID) {
      case 'google.com':
        signInResult = await FirebaseAuthentication.signInWithGoogle(o);
        break;
      case 'apple.com':
        signInResult = await FirebaseAuthentication.signInWithApple(o);
        break;
      case 'facebook.com':
        signInResult = await FirebaseAuthentication.signInWithFacebook(o);
        break;
      case 'microsoft.com':
        signInResult = await FirebaseAuthentication.signInWithMicrosoft(o);
        break;
      default:
        return Promise.reject('unsupported auth provider: ' + authProviderID);
    }

    console.log(
      `SneatAuthStateService.signInWith(${authProviderID}) => signed in on native layer, authenticating in webview...`,
      signInResult,
    );
    // we need to authenticate on webview layer using the id token and nonce from signInResult
    const userCredential = await this.authenticateOnWebviewLayer(
      authProviderID,
      signInResult,
    );

    return Promise.resolve(userCredential);
  }

  private async authenticateOnWebviewLayer(
    authProviderID: AuthProviderID,
    signInResult: SignInResult,
  ): Promise<UserCredential> {
    const oauthProvider = new OAuthProvider(authProviderID);
    const credential = oauthProvider.credential({
      idToken: signInResult.credential?.idToken,
      accessToken: signInResult.credential?.accessToken,
      rawNonce: signInResult.credential?.nonce,
    });
    const auth = getAuth();
    const userCredential = await signInWithCredential(auth, credential);

    // Get a valid Firebase ID token that has a 'kid' header
    const firebaseIdToken = await userCredential.user.getIdToken();
    console.log('firebaseIdToken:', firebaseIdToken);

    return Promise.resolve(userCredential);
  }

  private async signInWithWebSDK(
    authProviderID: AuthProviderID,
  ): Promise<UserCredential> {
    const authProvider = getAuthProvider(authProviderID);
    const userCredential = await signInWithPopup(this.fbAuth, authProvider);
    return Promise.resolve(userCredential);
  }

  public async linkWith(
    authProviderID: AuthProviderID,
  ): Promise<UserCredential | undefined> {
    const authProvider = getAuthProvider(authProviderID);
    if (!this.fbAuth.currentUser) {
      return Promise.reject('no current user');
    }
    const userCredential = await linkWithPopup(
      this.fbAuth.currentUser,
      authProvider,
    );
    return Promise.resolve(userCredential);
  }

  public async unlinkAuthProvider(authProviderID: string): Promise<void> {
    const currentUser = this.fbAuth.currentUser;
    if (currentUser) {
      try {
        const updatedUser = await unlink(currentUser, authProviderID);
        console.log(authProviderID + ' account unlinked successfully!');
        const authUser = createSneatAuthUserFromFbUser(updatedUser);
        this.authUser$.next(authUser);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(
          `Failed to unlink ${authProviderID} account:` + error,
        );
      }
    } else {
      return Promise.reject('No user is currently signed in.');
    }
  }

  public async signInWith(
    authProviderID: AuthProviderID,
  ): Promise<UserCredential | undefined> {
    console.log(
      `SneatAuthStateService.signInWith(${authProviderID}), isSigningInWith=${this.isSigningInWith}, location.protocol=${location.protocol}`,
    );
    this.analyticsService.logEvent('signingInWith', {
      provider: authProviderID,
    });
    try {
      if (this.isSigningInWith) {
        return Promise.reject(
          new Error(
            `a repeated call to SneatAuthStateService.signInWith(${authProviderID}) white previous sign in with ${this.isSigningInWith} is in progress`,
          ),
        );
      }

      let userCredential: UserCredential | undefined = undefined;

      if (Capacitor.isNativePlatform()) {
        userCredential = await this.signInOnNativeLayer(authProviderID);
      } else {
        userCredential = await this.signInWithWebSDK(authProviderID);
      }

      this.isSigningInWith = undefined;
      this.analyticsService.logEvent('signedInWith', {
        provider: authProviderID,
      });
      return Promise.resolve(userCredential);
    } catch (e) {
      this.isSigningInWith = undefined;
      return Promise.reject(e);
    }
  }
}

export type AuthProviderID =
  | 'apple.com'
  | 'google.com'
  | 'microsoft.com'
  | 'facebook.com'
  | 'github.com'
  | 'phone';

export type AuthProviderName =
  | 'Google'
  | 'Apple'
  | 'Microsoft'
  | 'Facebook'
  | 'GitHub';

function getAuthProvider(authProviderID: AuthProviderID): AuthProvider {
  switch (authProviderID) {
    case 'google.com':
      return new GoogleAuthProvider();
    case 'apple.com':
      return new OAuthProvider('apple.com');
    //
    // https://developer.apple.com/documentation/sign_in_with_apple/incorporating-sign-in-with-apple-into-other-platforms
    // (authProvider as OAuthProvider).setCustomParameters({
    // 	// 	// Localize the Apple authentication screen in current app locale.
    // 	locale: 'en', // TODO: set locale
    // });
    case 'microsoft.com':
      return new OAuthProvider('microsoft.com');
    case 'facebook.com': {
      const facebookAuthProvider = new FacebookAuthProvider();
      facebookAuthProvider.addScope('email');
      return facebookAuthProvider;
    }
    case 'github.com': {
      const githubAuthProvider = new GithubAuthProvider();
      githubAuthProvider.addScope('read:user');
      githubAuthProvider.addScope('user:email');
      return githubAuthProvider;
    }
    default:
      throw new Error('unsupported auth provider: ' + authProviderID);
  }
}

function createSneatAuthUserFromFbUser(
  fbUser: User | null,
): ISneatAuthUser | null {
  return (
    fbUser && {
      isAnonymous: fbUser.isAnonymous,
      emailVerified: fbUser.emailVerified,
      email: fbUser.email,
      uid: fbUser.uid,
      displayName: fbUser.displayName,
      phoneNumber: fbUser.phoneNumber,
      photoURL: fbUser.photoURL,
      providerId:
        fbUser.providerData?.length === 1 && fbUser.providerData[0]
          ? fbUser.providerData[0].providerId
          : fbUser.providerId,
      providerData: fbUser.providerData,
    }
  );
}
