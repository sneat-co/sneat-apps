/// <reference types='cypress' />

// import { UserCredential } from 'firebase/auth';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface Chainable<Subject> {
		login(email: string, password: string): Chainable<Subject>;
		initializeFirebaseEmulators(): Chainable<Subject>;
		deleteAllAuthUsers(): Chainable<Response>;
		createUser(email: string, password: string): Chainable<Subject>;
		initializeTestEnvironment(): Chainable<Subject>;
		userExists(email: string): Chainable<boolean>;
	}
}
