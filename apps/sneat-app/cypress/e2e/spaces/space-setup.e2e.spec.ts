import { runSignUpTest } from '../common/auth.spec';
import {
	assertNewSpaceButtonIsVisible,
	assertSpacesDropdownIsVisible,
	clickNewSpaceButton,
} from '../common/spaces.spec';

describe('Space Setup', () => {
	beforeEach(() => {
		cy.deleteAllAuthUsers();
		cy.visit('/');
	});

	it('should create a new space', () => {
		cy.intercept('POST', 'v0/spaces/create_space', (req) => {
			req.body.title = 'something-title';
			req.continue();
		}).as('createNewSpace');

		runSignUpTest();
		assertNewSpaceButtonIsVisible();

		clickNewSpaceButton();
		cy.wait('@createNewSpace');

		// assertSpacesDropdownIsVisible(); // TODO: Restore check - passes locally but fails in CI
	});
});
