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
import { environmentConfig } from '../environments/environment';

export function ImportFirebaseModules(firebaseConfig: IFirebaseConfig) {
	// console.log('ImportFirebaseModules');
	return [
		provideFirebaseApp(() => initFirebase(firebaseConfig)),
		provideFirestore((injector) => {
			console.log('AngularFire: provideFirestore');
			const fbApp = injector.get(FirebaseApp);
			const firestore = getFirestore(fbApp);
			const { emulator } = firebaseConfig;
			if (firebaseConfig.useEmulators && emulator?.firestorePort) {
				console.log(
					`using firebase firestore emulator on ${environmentConfig.firebaseBaseUrl}:${emulator.firestorePort}`,
				);
				connectFirestoreEmulator(
					firestore,
					environmentConfig.firebaseBaseUrl!,
					emulator.firestorePort,
				);
			}
			return firestore;
		}),
		provideAuth((injector) => {
			console.log('AngularFire: provideAuth');
			const fbApp = injector.get(FirebaseApp);
			const auth = getAuth(fbApp);
			const { emulator } = firebaseConfig;
			if (firebaseConfig.useEmulators && emulator?.authPort) {
				connectAuthEmulator(
					auth,
					`http://${environmentConfig.firebaseBaseUrl}:${emulator.authPort}`,
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
