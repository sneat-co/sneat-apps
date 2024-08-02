/// <reference types='cypress' />

// import { UserCredential } from 'firebase/auth';

declare namespace Cypress {
	interface Chainable<Subject> {
		login(email: string, password: string): Chainable<Subject>;
		initializeFirebaseEmulators(): Chainable<Subject>;
		deleteAllAuthUsers(): Chainable<Response>;
		createUser(email: string, password: string): Chainable<Subject>;
		initializeTestEnvironment(): Chainable<Subject>;
		userExists(email: string): Chainable<boolean>;
	}
}
