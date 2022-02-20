import { IEnvironmentConfig, IFirebaseConfig } from "./environment-config";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

export function initFirebase(firebaseConfig: IFirebaseConfig): void {
	const firebaseApp = firebase.initializeApp(firebaseConfig);
	if (firebaseConfig.emulator) {
		console.log("using firebase emulators...");
		const emulator = firebaseConfig.emulator;
		if (emulator.authPort) {
			firebaseApp.auth().useEmulator("http://localhost:" + emulator.authPort);
		}
		if (emulator.firestorePort) {
			firebaseApp.firestore().useEmulator("localhost", emulator.firestorePort);
		}
	}
}
