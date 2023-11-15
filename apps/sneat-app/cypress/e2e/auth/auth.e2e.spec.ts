import {
	MOCK_USER_EMAIL,
	MOCK_USER_PASS,
	runSignInTest,
	runSignUpTest,
} from '../common/auth';
import { assertNewTeamButtonIsVisible } from '../common/teams';

describe('Email Auth', () => {
	beforeEach(() => {
		// Starting off with no users so we can sign one up.
		cy.deleteAllAuthUsers();
		cy.visit('/');
	});

	it('should sign up new user', () => {
		runSignUpTest();
	});

	describe('Sign In/Out', () => {
		before(() => {
			// Programmatically create a user in the back-end to log in with
			cy.initializeFirebaseEmulators();
		});

		beforeEach(() => {
			cy.createUser(MOCK_USER_EMAIL, MOCK_USER_PASS);
		});

		it('should sign user in', () => {
			runSignInTest();
			assertNewTeamButtonIsVisible();
		});

		it('should user sign out', () => {
			runSignInTest();
			assertNewTeamButtonIsVisible();

			cy.get('ion-button[title="Sign-out"]').click();
		});
	});
});
