import { connectAuthEmulator, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator } from '@angular/fire/firestore';
import { IFirebaseConfig } from './environment-config';
import { provideFirebaseApp, initializeApp, FirebaseApp } from '@angular/fire/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';


export function ImportFirebaseModules(firebaseConfig: IFirebaseConfig) {
	// console.log('ImportFirebaseModules');
	return [
		provideFirebaseApp(() => initFirebase(firebaseConfig)),
		provideFirestore(() => {
			console.log('AngularFire: provideFirestore');
			const firestore = getFirestore();
			const { emulator } = firebaseConfig;
			if (firebaseConfig.useEmulators && emulator?.firestorePort) {
				const host = 'localhost';
				console.log(`using firebase firestore emulator on ${host}:${emulator.authPort}`);
				connectFirestoreEmulator(firestore, host, emulator.firestorePort);
			}
			return firestore;
		}),
		provideAuth(() => {
			console.log('AngularFire: provideAuth');
			const auth = getAuth();
			const { emulator } = firebaseConfig;
			if (firebaseConfig.useEmulators && emulator?.authPort) {
				connectAuthEmulator(auth, 'http://localhost:' + emulator.authPort);
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
	console.log('initFirebase', firebaseConfig);
	const firebaseApp = initializeApp(firebaseConfig);
	if (firebaseConfig.useEmulators && firebaseConfig.emulator) {
		console.log('using firebase emulators', firebaseConfig);
	}
	return firebaseApp;
}
