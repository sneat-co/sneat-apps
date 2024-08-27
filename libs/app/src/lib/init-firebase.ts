import { connectAuthEmulator, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator } from '@angular/fire/firestore';
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
			if (firebaseConfig.useEmulators && emulator) {
				console.log(
					`using firebase firestore emulator on ${emulator.firestoreHost}:${emulator.firestorePort}`,
				);
				connectFirestoreEmulator(
					firestore,
					emulator.firestoreHost || 'localhost',
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
			const fbApp = injector.get(FirebaseApp);
			const auth = getAuth(fbApp);
			const { emulator } = firebaseConfig;
			if (firebaseConfig.useEmulators && emulator?.authPort) {
				// noinspection HttpUrlsUsage
				connectAuthEmulator(
					auth,
					`${emulator.authPort === 443 ? 'https' : 'http'}://${emulator.authHost || 'localhost'}:${emulator.authPort}`,
				);
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
			(firebaseConfig.useEmulators && firebaseConfig.emulator
				? ' - using firebase emulators'
				: ''),
		firebaseConfig,
	);
	return initializeApp(firebaseConfig);
}
