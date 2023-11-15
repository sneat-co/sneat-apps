// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import {
	getAuth as getLibAuth,
	connectAuthEmulator,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import {
	connectFirestoreEmulator,
	getFirestore as getLibFirestore,
} from '@firebase/firestore';

const EMULATOR_CONFIG = {
	authPort: 9099,
	firestorePort: 8080,
};
const FIREBASE_CONFIG = {
	useEmulators: true,
	emulator: EMULATOR_CONFIG,
	apiKey: 'emulator-does-not-need-api-key',
	authDomain: 'sneat.app',
	projectId: 'demo-local-sneat-app',
	appId: '1:5233273170:web:61e8d4f12d03a07e',
	measurementId: 'G-CMCYD6HVGN',
	nickname: 'Sneat.app',
	messagingSenderId: 5233273170,
};
const HOST = '127.0.0.1';
const AUTH_ENDPOINT = `http://${HOST}:${EMULATOR_CONFIG.authPort}`;
const TEST_USER_EMAIL = 'test@gmail.com';
const TEST_USER_PASS = 'password';

const getFirebaseApp = () =>
	initializeApp(FIREBASE_CONFIG as unknown as FirebaseOptions);
const getAuth = () => getLibAuth(getFirebaseApp());
const getFirestore = () => getLibFirestore(getFirebaseApp());

const signInProgrammatically = (email: string, password: string) => {
	const signIn = signInWithEmailAndPassword(getAuth(), email, password).catch(
		(e) => {
			cy.log(`User could not sign in programmatically!`);
			console.error(e);
		},
	);

	return cy.wrap(signIn);
};

Cypress.Commands.add('login', (email, password) => {
	return cy.session([email, password], () => {
		signInProgrammatically(email, password).then(() => {
			localStorage.setItem('emailForSignIn', email);
		});
	});
});

Cypress.Commands.add('initializeFirebaseEmulators', () => {
	return cy.wrap(
		(() => {
			connectFirestoreEmulator(
				getFirestore(),
				HOST,
				EMULATOR_CONFIG.firestorePort,
			);
			connectAuthEmulator(getAuth(), AUTH_ENDPOINT, { disableWarnings: true });
			sessionStorage.clear();
		})(),
	);
});

Cypress.Commands.add('deleteAllAuthUsers', () => {
	cy.request(
		'DELETE',
		`${AUTH_ENDPOINT}/emulator/v1/projects/${FIREBASE_CONFIG.projectId}/accounts`,
	).then((response) => {
		expect(response.status).to.eq(200);
	});
});

Cypress.Commands.add('createUser', (email: string, password: string) =>
	cy.wrap(createUserWithEmailAndPassword(getAuth(), email, password)),
);

Cypress.Commands.add('initializeTestEnvironment', () => {
	cy.initializeFirebaseEmulators();
	return cy.userExists(TEST_USER_EMAIL).then((userExists) => {
		if (userExists) {
			return cy.login(TEST_USER_EMAIL, TEST_USER_PASS);
		}

		return cy
			.createUser(TEST_USER_EMAIL, TEST_USER_PASS)
			.login(TEST_USER_EMAIL, TEST_USER_PASS);
	});
});

Cypress.Commands.add('userExists', (email: string) =>
	cy.wrap(
		new Promise<boolean>((resolve) => {
			fetchSignInMethodsForEmail(getAuth(), email)
				.then((signInMethods) => {
					if (signInMethods.length > 0) {
						resolve(true);
					} else {
						resolve(false);
					}
				})
				.catch(() => resolve(false));
		}),
	),
);
