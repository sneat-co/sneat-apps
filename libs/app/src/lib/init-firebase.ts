import { Type } from '@angular/core';
import {
	Auth,
	connectAuthEmulator,
	indexedDBLocalPersistence,
	initializeAuth,
	provideAuth,
} from '@angular/fire/auth';
import { connectFirestoreEmulator } from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';
import { IFirebaseConfig } from './environment-config';
import {
	provideFirebaseApp,
	initializeApp,
	FirebaseApp,
} from '@angular/fire/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export function getAngularFireProviders(firebaseConfig: IFirebaseConfig) {
	// console.log('ImportFirebaseModules');
	return [
		provideFirebaseApp(() => initFirebase(firebaseConfig)),
		provideFirestore((injector) => {
			console.log('AngularFire: provideFirestore');
			const fbApp = injector.get(FirebaseApp);
			const firestore = getFirestore(fbApp);
			const { emulator } = firebaseConfig;
			if (emulator) {
				console.log(
					`using firebase firestore emulator on ${emulator.firestoreHost}:${emulator.firestorePort}`,
				);
				connectFirestoreEmulator(
					firestore,
					emulator.firestoreHost || '127.0.0.1',
					emulator.firestorePort,
				);
				if (emulator.firestorePort === 443) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					firestore['_settings']['ssl'] = true;
				}
			}
			return firestore;
		}),
		provideAuth((injector) => {
			console.log('AngularFire: provideAuth');
			const fbApp = injector.get<FirebaseApp>(FirebaseApp as Type<FirebaseApp>);
			let auth: Auth;
			if (Capacitor.isNativePlatform()) {
				auth = initializeAuth(fbApp, {
					persistence: indexedDBLocalPersistence,
				});
			} else {
				auth = getAuth(fbApp);
			}
			const { emulator } = firebaseConfig;
			if (emulator?.authPort) {
				// alert('Using firebase auth emulator');
				const authUrl = `${emulator.authPort === 443 ? 'https' : 'http'}://${emulator.authHost || '127.0.0.1'}:${emulator.authPort}`;
				console.log('authUrl: ', authUrl);
				// noinspection HttpUrlsUsage
				connectAuthEmulator(auth, authUrl);
			}
			return auth;
		}),
		// provideAnalytics(() => {
		// 	console.log('AngularFire: provideAnalytics');
		// 	return getAnalytics();
		// })
	];
}

export function initFirebase(firebaseConfig: IFirebaseConfig): FirebaseApp {
	console.log(
		'initFirebase()' +
			(firebaseConfig.emulator ? ' - using firebase emulators' : ''),
		firebaseConfig,
	);
	return initializeApp(firebaseConfig);
}
