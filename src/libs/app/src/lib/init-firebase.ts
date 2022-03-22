import { IFirebaseConfig } from "./environment-config";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

export function initFirebase(firebaseConfig: IFirebaseConfig): void {
	console.log('initFirebase', firebaseConfig);
	const firebaseApp = firebase.initializeApp(firebaseConfig);
	if (firebaseConfig.useEmulators && firebaseConfig.emulator) {
		console.log("using firebase emulators", firebaseConfig);
		const emulator = firebaseConfig.emulator;
		if (emulator.authPort) {
			console.log("using firebase auth emulator on port", emulator.authPort);
			firebaseApp.auth().useEmulator("http://localhost:" + emulator.authPort);
		}
		if (emulator.firestorePort) {
			const host = "localhost";
			console.log(`using firebase firestore emulator on ${host}:${emulator.authPort}`);
			firebaseApp.firestore().useEmulator(host, emulator.firestorePort);
		}
	}
}
